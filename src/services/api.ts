import { RMARecord, TestResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export class ApiService {
  static async uploadCSVData(data: RMARecord[], filename: string, stats: { totalRows: number; validRMAs: number }) {
    const response = await fetch(`${API_BASE_URL}/upload-csv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, filename, stats }),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload CSV: ${response.statusText}`);
    }

    return response.json();
  }

  static async getRMARecords(): Promise<RMARecord[]> {
    const response = await fetch(`${API_BASE_URL}/rma-records`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RMA records: ${response.statusText}`);
    }

    const records = await response.json();
    
    // Convert database format to frontend format
    return records.map((record: any) => ({
      rmaNumber: record.rma_number,
      customerName: record.customer_name,
      customerPhone: record.customer_phone,
      productName: record.product_name,
      issueDescription: record.issue_description,
      dateReceived: record.date_received,
      status: record.status,
      orderedFrom: record.ordered_from,
      dateOrdered: record.date_ordered,
      orderNumber: record.order_number,
      invoice: record.invoice,
      invoiceLink: record.invoice_link,
      replacementAddress: record.replacement_address,
      originalStatus: record.original_status,
    }));
  }

  static async getTestResults(): Promise<TestResult[]> {
    const response = await fetch(`${API_BASE_URL}/test-results`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test results: ${response.statusText}`);
    }

    const results = await response.json();
    
    // Convert database format to frontend format
    return results.map((result: any) => ({
      id: result.id,
      rmaNumber: result.rma_number,
      customerName: result.customer_name,
      orderNumber: result.order_number,
      invoice: result.invoice,
      customerPhone: result.customer_phone,
      productSkuId: result.product_sku_id,
      testingStatus: result.testing_status,
      dateTested: result.date_tested,
      issueDescription: result.issue_description,
      dateOrdered: result.date_ordered,
      additionalComments: result.additional_comments,
      invoiceLink: result.invoice_link,
      replacementAddress: result.replacement_address,
    }));
  }

  static async submitTestResult(result: TestResult) {
    const response = await fetch(`${API_BASE_URL}/test-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit test result: ${response.statusText}`);
    }

    return response.json();
  }

  static async getSystemStatus() {
    const response = await fetch(`${API_BASE_URL}/status`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch system status: ${response.statusText}`);
    }

    return response.json();
  }
}