export interface RMARecord {
  rmaNumber: string;
  customerName: string;
  productName: string;
  issueDescription: string;
  dateReceived: string;
  status: 'Pending' | 'In Testing' | 'Completed';
  orderedFrom?: string;
  dateOrdered?: string;
  customerPhone?: string;
  orderNumber?: string;
  invoice?: string;
  invoiceLink?: string;
  replacementAddress?: string;
  originalStatus?: string; // Store the original RMA status from CSV
}

export interface Product {
  id: string;
  name: string;
  skuId: string;
}

export interface TestResult {
  id: string;
  rmaNumber: string;
  customerName: string;
  orderNumber: string;
  invoice: string;
  customerPhone: string;
  productSkuId: string;
  testingStatus: 'More testing needed' | 'Replacement' | 'No issues found' | 'Physical Damage';
  dateTested: string;
  issueDescription: string;
  dateOrdered: string;
  additionalComments?: string;
  invoiceLink?: string;
  replacementAddress?: string;
}

export interface DashboardStats {
  totalForms: number;
  totalReturns: number;
  unresolved: number;
  physicalDamage: number;
  moreTestingRequired: number;
  noIssuesFound: number;
  replacements: number;
  averageResolutionTime: number;
  pendingTests: number;
  completedTests: number;
}