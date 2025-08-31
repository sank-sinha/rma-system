import React, { useCallback } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, AlertCircle, Eye, CheckCircle, Sparkles } from 'lucide-react';
import { RMARecord } from '../types';
import { CSVViewer } from './CSVViewer';

interface ExcelUploaderProps {
  onDataLoaded: (data: RMARecord[], filename: string, stats: { totalRows: number; validRMAs: number }) => void;
  hasData: boolean;
}

// Column mapping for the RMA CSV file
const COLUMN_MAPPING = {
  rmaNumber: 'RMA ID',
  customerName: 'Name on the invoice',
  customerPhone: 'Contact Number',
  invoice: 'Attach your invoice',
  productName: 'Product Name (as per invoice)',
  issueDescription: 'Issue you\'re facing',
  replacementAddress: 'Full Address for Return Pick Up',
  dateOrdered: 'Date of Purchase',
  orderedFrom: 'Purchased From',
  trackingNumber: 'Tracking Number',
  status: 'Returns Status',
  productSku: 'Product SKU',
  productRemarks: 'Product Remarks',
  rmaStatus: 'RMA Status',
  alternateSku: 'Alternate SKU Replace',
  noOfDays: 'No of Days',
  replacementTracking: 'Tracking Number',
  replacementStatus: 'Replacement Status',
  week: 'Week',
  sku: 'SKU',
  month: 'Month'
};

function getColumnValue(row: Record<string, any>, columnName: string): string {
  return String(row[columnName] || '').trim();
}

function extractRma(raw: any, rowIndex: number, allRowData: Record<string, any>): string {
  if (raw != null) {
    const s = String(raw).trim();
    if (s) return s;
  }
  
  // If RMA ID is empty, try to find it in other columns or generate based on context
  // Check if there's an RMA number in the tracking or other fields
  const trackingNumber = String(allRowData['Tracking Number'] || '').trim();
  const replacementStatus = String(allRowData['Replacement Status'] || '').trim();
  
  // Look for RMA pattern in tracking or replacement status
  const rmaPattern = /RMA\/\d+/i;
  if (trackingNumber && rmaPattern.test(trackingNumber)) {
    const match = trackingNumber.match(rmaPattern);
    if (match) return match[0];
  }
  
  if (replacementStatus && rmaPattern.test(replacementStatus)) {
    const match = replacementStatus.match(rmaPattern);
    if (match) return match[0];
  }
  
  // Generate RMA number based on row position if we can't find it
  return `RMA/${String(rowIndex + 32).padStart(4, '0')}`;
}

export function ExcelUploader({ onDataLoaded, hasData }: ExcelUploaderProps) {
  const [showViewer, setShowViewer] = React.useState(false);
  const [fileStats, setFileStats] = React.useState<{ totalRows: number; validRMAs: number } | null>(null);
  const [originalFileName, setOriginalFileName] = React.useState<string>('');
  const [originalCsvData, setOriginalCsvData] = React.useState<string[][]>([]);
  const [originalHeaders, setOriginalHeaders] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setOriginalFileName(file.name);
    console.log('Starting file upload:', file.name);

    Papa.parse(file, {
      header: true,                    // use first line as headers
      skipEmptyLines: 'greedy',        // ignore empty/whitespace-only lines
      dynamicTyping: false,            // keep strings
      transformHeader: (h) => h.trim(),// trim header whitespace
      encoding: 'utf-8',               // handle BOM safely
      delimiter: ',',                  // explicit comma delimiter
      quoteChar: '"',                 // handle quoted fields
      escapeChar: '"',                // handle escaped quotes
      complete: (results) => {
        try {
          console.log('Parse results:', results);
          console.log('Parse errors:', results.errors);
          
          const rows = (results.data as Record<string, any>[])
            // filter out objects that are completely empty
            .filter(r => Object.values(r).some(v => String(v ?? '').trim() !== ''));

          console.log('Filtered rows count:', rows.length);
          console.log('First few rows:', rows.slice(0, 3));

          const headers = results.meta.fields ?? Object.keys(rows[0] || {});
          console.log('Headers found:', headers);
          setOriginalHeaders(headers);

          // Build the 2D array for CSVViewer in the SAME order as headers
          const csvData = rows.map(r => headers.map(h => String(r[h] ?? '').trim()));
          setOriginalCsvData(csvData);

          // Map to RMARecord using the specific column structure
          const mapped: RMARecord[] = rows.map((r, idx) => {
            const rmaRecord = {
              rmaNumber: extractRma(getColumnValue(r, COLUMN_MAPPING.rmaNumber), idx, r),
              customerName: getColumnValue(r, COLUMN_MAPPING.customerName),
              customerPhone: getColumnValue(r, COLUMN_MAPPING.customerPhone),
              productName: getColumnValue(r, COLUMN_MAPPING.productName),
              issueDescription: getColumnValue(r, COLUMN_MAPPING.issueDescription),
              dateReceived: '', // Not available in this CSV
              status: getColumnValue(r, COLUMN_MAPPING.status) || 'Pending',
              originalStatus: getColumnValue(r, COLUMN_MAPPING.rmaStatus),
              orderedFrom: getColumnValue(r, COLUMN_MAPPING.orderedFrom),
              dateOrdered: getColumnValue(r, COLUMN_MAPPING.dateOrdered),
              orderNumber: '', // Not available in this CSV
              invoice: getColumnValue(r, COLUMN_MAPPING.invoice),
              invoiceLink: getColumnValue(r, COLUMN_MAPPING.invoice), // Same as invoice
              replacementAddress: getColumnValue(r, COLUMN_MAPPING.replacementAddress),
            } as RMARecord;
            
            if (idx < 3) {
              console.log(`Row ${idx} mapped:`, rmaRecord);
            }
            
            return rmaRecord;
          });
          
          console.log('Total mapped records:', mapped.length);

          // Keep all RMA records without deduplication to preserve all entries
          console.log('Total mapped records:', mapped.length);

          setFileStats({ totalRows: rows.length, validRMAs: mapped.length });
          console.log('Calling onDataLoaded with mapped data');
          onDataLoaded(mapped, file.name, { totalRows: rows.length, validRMAs: mapped.length });
          setIsUploading(false);
        } catch (err) {
          console.error('Mapping error:', err);
          alert(`Error processing CSV: ${err}`);
          setIsUploading(false);
        }
      },
      error: (err) => {
        console.error('Papa parse error:', err);
        alert(`Error parsing CSV: ${err}`);
        setIsUploading(false);
      },
    });

    // allow re-selecting the same file if needed
    event.target.value = '';
  }, [onDataLoaded]);

  if (hasData) {
    return (
      <>
        <div className="glass-effect border border-green-200/50 rounded-2xl p-6 mb-8 shadow-elegant">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">CSV Data Loaded Successfully</h3>
                {fileStats && (
                  <p className="text-sm text-gray-600">
                    {fileStats.validRMAs} RMA records loaded from {fileStats.totalRows} total rows
                  </p>
                )}
                {originalFileName && (
                  <p className="text-xs text-gray-500 mt-1">File: {originalFileName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowViewer(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-smooth"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Data</span>
              </button>
              <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl transition-smooth font-medium gradient-bg text-white hover:shadow-lg cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Upload New File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {showViewer && (
          <CSVViewer
            csvData={originalCsvData}
            headers={originalHeaders}
            onClose={() => setShowViewer(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-3xl p-12 text-center shadow-elegant border border-purple-100/50">
        <div className="relative">
          <div className="absolute -top-4 -right-4 p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl mb-8">
            <FileSpreadsheet className="w-20 h-20 mx-auto mb-4 text-purple-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your CSV File</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Upload your customer returns CSV file to get started with RMA testing.
            Our system will automatically parse and organize your data.
          </p>

          <label className={`inline-flex items-center space-x-3 px-8 py-4 gradient-bg text-white rounded-2xl hover:shadow-xl cursor-pointer transition-smooth font-semibold text-lg group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>{isUploading ? 'Processing...' : 'Choose CSV File'}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-semibold text-purple-900 mb-3">CSV File Requirements</h4>
                <p className="text-sm text-purple-800">
                  Newlines inside quotes, commas in addresses, and BOM are all handled automatically.
                  Headers are used to map columns, so your column order can vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}