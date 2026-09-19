import type { Client, DocumentRecord, Profile, TaskItem, Transaction } from '../types';

// Supabase rows use snake_case; app types use camelCase. These functions
// translate between the two so the rest of the app never sees raw rows.

export function rowToTransaction(row: any): Transaction {
  return {
    id: row.id,
    type: row.type,
    date: row.date,
    amount: Number(row.amount),
    category: row.category,
    clientId: row.client_id ?? undefined,
    memo: row.memo ?? undefined,
    createdAt: row.created_at,
  };
}

export function rowToClient(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    contactName: row.contact_name ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    address: row.address ?? undefined,
    businessNumber: row.business_number ?? undefined,
    memo: row.memo ?? undefined,
    createdAt: row.created_at,
  };
}

export function rowToDocument(row: any): DocumentRecord {
  return {
    id: row.id,
    type: row.type,
    docNumber: row.doc_number,
    clientId: row.client_id,
    issueDate: row.issue_date,
    dueDate: row.due_date ?? undefined,
    items: row.items ?? [],
    taxRate: Number(row.tax_rate),
    status: row.status,
    memo: row.memo ?? undefined,
    createdAt: row.created_at,
  };
}

export function rowToTask(row: any): TaskItem {
  return {
    id: row.id,
    title: row.title,
    dueDate: row.due_date ?? undefined,
    priority: row.priority,
    status: row.status,
    memo: row.memo ?? undefined,
    createdAt: row.created_at,
  };
}

export function rowToProfile(row: any): Profile {
  return {
    businessName: row.business_name ?? '',
    ownerName: row.owner_name ?? '',
    businessNumber: row.business_number ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    address: row.address ?? '',
    bankInfo: row.bank_info ?? '',
  };
}
