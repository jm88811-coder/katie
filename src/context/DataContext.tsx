import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { rowToClient, rowToDocument, rowToProfile, rowToTask, rowToTransaction } from '../lib/mappers';
import type {
  Client,
  DocumentRecord,
  Profile,
  TaskItem,
  Transaction,
} from '../types';

const DEFAULT_PROFILE: Profile = {
  businessName: '',
  ownerName: '',
  businessNumber: '',
  phone: '',
  email: '',
  address: '',
  bankInfo: '',
};

interface DataContextValue {
  loading: boolean;

  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;

  clients: Client[];
  addClient: (c: Omit<Client, 'id' | 'createdAt'>) => Promise<Client | null>;
  updateClient: (id: string, c: Partial<Client>) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
  getClient: (id: string | undefined) => Client | undefined;

  documents: DocumentRecord[];
  addDocument: (d: Omit<DocumentRecord, 'id' | 'createdAt'>) => Promise<DocumentRecord | null>;
  updateDocument: (id: string, d: Partial<DocumentRecord>) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  getDocument: (id: string | undefined) => DocumentRecord | undefined;
  nextDocNumber: (type: DocumentRecord['type']) => string;

  tasks: TaskItem[];
  addTask: (t: Omit<TaskItem, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, t: Partial<TaskItem>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;

  profile: Profile;
  updateProfile: (p: Partial<Profile>) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setClients([]);
      setDocuments([]);
      setTasks([]);
      setProfile(DEFAULT_PROFILE);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const [txRes, clientRes, docRes, taskRes, profileRes] = await Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('documents').select('*').order('issue_date', { ascending: false }),
        supabase.from('tasks').select('*').order('due_date', { ascending: true, nullsFirst: false }),
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      ]);
      if (cancelled) return;
      setTransactions((txRes.data ?? []).map(rowToTransaction));
      setClients((clientRes.data ?? []).map(rowToClient));
      setDocuments((docRes.data ?? []).map(rowToDocument));
      setTasks((taskRes.data ?? []).map(rowToTask));
      setProfile(profileRes.data ? rowToProfile(profileRes.data) : DEFAULT_PROFILE);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const value = useMemo<DataContextValue>(() => {
    const addTransaction: DataContextValue['addTransaction'] = async (t) => {
      if (!user) return;
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: t.type,
          date: t.date,
          amount: t.amount,
          category: t.category,
          client_id: t.clientId ?? null,
          memo: t.memo ?? null,
        })
        .select()
        .single();
      if (!error && data) setTransactions((prev) => [rowToTransaction(data), ...prev]);
    };

    const updateTransaction: DataContextValue['updateTransaction'] = async (id, t) => {
      const patch: Record<string, unknown> = {};
      if (t.type !== undefined) patch.type = t.type;
      if (t.date !== undefined) patch.date = t.date;
      if (t.amount !== undefined) patch.amount = t.amount;
      if (t.category !== undefined) patch.category = t.category;
      if ('clientId' in t) patch.client_id = t.clientId ?? null;
      if ('memo' in t) patch.memo = t.memo ?? null;
      const { data, error } = await supabase.from('transactions').update(patch).eq('id', id).select().single();
      if (!error && data) setTransactions((prev) => prev.map((x) => (x.id === id ? rowToTransaction(data) : x)));
    };

    const removeTransaction: DataContextValue['removeTransaction'] = async (id) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (!error) setTransactions((prev) => prev.filter((x) => x.id !== id));
    };

    const addClient: DataContextValue['addClient'] = async (c) => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: c.name,
          contact_name: c.contactName ?? null,
          phone: c.phone ?? null,
          email: c.email ?? null,
          address: c.address ?? null,
          business_number: c.businessNumber ?? null,
          memo: c.memo ?? null,
        })
        .select()
        .single();
      if (error || !data) return null;
      const client = rowToClient(data);
      setClients((prev) => [client, ...prev]);
      return client;
    };

    const updateClient: DataContextValue['updateClient'] = async (id, c) => {
      const patch: Record<string, unknown> = {};
      if (c.name !== undefined) patch.name = c.name;
      if ('contactName' in c) patch.contact_name = c.contactName ?? null;
      if ('phone' in c) patch.phone = c.phone ?? null;
      if ('email' in c) patch.email = c.email ?? null;
      if ('address' in c) patch.address = c.address ?? null;
      if ('businessNumber' in c) patch.business_number = c.businessNumber ?? null;
      if ('memo' in c) patch.memo = c.memo ?? null;
      const { data, error } = await supabase.from('clients').update(patch).eq('id', id).select().single();
      if (!error && data) setClients((prev) => prev.map((x) => (x.id === id ? rowToClient(data) : x)));
    };

    const removeClient: DataContextValue['removeClient'] = async (id) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (!error) setClients((prev) => prev.filter((x) => x.id !== id));
    };

    const getClient: DataContextValue['getClient'] = (id) =>
      id ? clients.find((x) => x.id === id) : undefined;

    const addDocument: DataContextValue['addDocument'] = async (d) => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type: d.type,
          doc_number: d.docNumber,
          client_id: d.clientId,
          issue_date: d.issueDate,
          due_date: d.dueDate ?? null,
          items: d.items,
          tax_rate: d.taxRate,
          status: d.status,
          memo: d.memo ?? null,
        })
        .select()
        .single();
      if (error || !data) return null;
      const doc = rowToDocument(data);
      setDocuments((prev) => [doc, ...prev]);
      return doc;
    };

    const updateDocument: DataContextValue['updateDocument'] = async (id, d) => {
      const patch: Record<string, unknown> = {};
      if (d.type !== undefined) patch.type = d.type;
      if (d.docNumber !== undefined) patch.doc_number = d.docNumber;
      if (d.clientId !== undefined) patch.client_id = d.clientId;
      if (d.issueDate !== undefined) patch.issue_date = d.issueDate;
      if ('dueDate' in d) patch.due_date = d.dueDate ?? null;
      if (d.items !== undefined) patch.items = d.items;
      if (d.taxRate !== undefined) patch.tax_rate = d.taxRate;
      if (d.status !== undefined) patch.status = d.status;
      if ('memo' in d) patch.memo = d.memo ?? null;
      const { data, error } = await supabase.from('documents').update(patch).eq('id', id).select().single();
      if (!error && data) setDocuments((prev) => prev.map((x) => (x.id === id ? rowToDocument(data) : x)));
    };

    const removeDocument: DataContextValue['removeDocument'] = async (id) => {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (!error) setDocuments((prev) => prev.filter((x) => x.id !== id));
    };

    const getDocument: DataContextValue['getDocument'] = (id) =>
      id ? documents.find((x) => x.id === id) : undefined;

    const nextDocNumber: DataContextValue['nextDocNumber'] = (type) => {
      const prefix = type === 'quote' ? 'Q' : 'INV';
      const year = new Date().getFullYear();
      const count = documents.filter(
        (d) => d.type === type && d.docNumber.startsWith(`${prefix}-${year}`),
      ).length;
      return `${prefix}-${year}-${String(count + 1).padStart(3, '0')}`;
    };

    const addTask: DataContextValue['addTask'] = async (t) => {
      if (!user) return;
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: t.title,
          due_date: t.dueDate ?? null,
          priority: t.priority,
          status: t.status,
          memo: t.memo ?? null,
        })
        .select()
        .single();
      if (!error && data) setTasks((prev) => [rowToTask(data), ...prev]);
    };

    const updateTask: DataContextValue['updateTask'] = async (id, t) => {
      const patch: Record<string, unknown> = {};
      if (t.title !== undefined) patch.title = t.title;
      if ('dueDate' in t) patch.due_date = t.dueDate ?? null;
      if (t.priority !== undefined) patch.priority = t.priority;
      if (t.status !== undefined) patch.status = t.status;
      if ('memo' in t) patch.memo = t.memo ?? null;
      const { data, error } = await supabase.from('tasks').update(patch).eq('id', id).select().single();
      if (!error && data) setTasks((prev) => prev.map((x) => (x.id === id ? rowToTask(data) : x)));
    };

    const removeTask: DataContextValue['removeTask'] = async (id) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (!error) setTasks((prev) => prev.filter((x) => x.id !== id));
    };

    const updateProfile: DataContextValue['updateProfile'] = async (p) => {
      if (!user) return;
      const next = { ...profile, ...p };
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: user.id,
            business_name: next.businessName,
            owner_name: next.ownerName,
            business_number: next.businessNumber,
            phone: next.phone,
            email: next.email,
            address: next.address,
            bank_info: next.bankInfo,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        )
        .select()
        .single();
      if (!error && data) setProfile(rowToProfile(data));
    };

    return {
      loading,
      transactions,
      addTransaction,
      updateTransaction,
      removeTransaction,
      clients,
      addClient,
      updateClient,
      removeClient,
      getClient,
      documents,
      addDocument,
      updateDocument,
      removeDocument,
      getDocument,
      nextDocNumber,
      tasks,
      addTask,
      updateTask,
      removeTask,
      profile,
      updateProfile,
    };
  }, [user, loading, transactions, clients, documents, tasks, profile]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
