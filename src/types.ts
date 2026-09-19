export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  amount: number;
  category: string;
  clientId?: string;
  memo?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessNumber?: string; // 사업자등록번호
  memo?: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type DocumentType = 'quote' | 'invoice'; // 견적서 / 청구서
export type DocumentStatus = 'draft' | 'sent' | 'paid' | 'cancelled';

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  docNumber: string;
  clientId: string;
  issueDate: string;
  dueDate?: string;
  items: DocumentItem[];
  taxRate: number; // percent, e.g. 10
  status: DocumentStatus;
  memo?: string;
  createdAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface TaskItem {
  id: string;
  title: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  memo?: string;
  createdAt: string;
}

export interface Profile {
  businessName: string;
  ownerName: string;
  businessNumber: string;
  phone: string;
  email: string;
  address: string;
  bankInfo: string;
}
