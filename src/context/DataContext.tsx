import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStore } from '../lib/useLocalStore';
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
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;

  clients: Client[];
  addClient: (c: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, c: Partial<Client>) => void;
  removeClient: (id: string) => void;
  getClient: (id: string | undefined) => Client | undefined;

  documents: DocumentRecord[];
  addDocument: (d: Omit<DocumentRecord, 'id' | 'createdAt'>) => DocumentRecord;
  updateDocument: (id: string, d: Partial<DocumentRecord>) => void;
  removeDocument: (id: string) => void;
  getDocument: (id: string | undefined) => DocumentRecord | undefined;
  nextDocNumber: (type: DocumentRecord['type']) => string;

  tasks: TaskItem[];
  addTask: (t: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, t: Partial<TaskItem>) => void;
  removeTask: (id: string) => void;

  profile: Profile;
  updateProfile: (p: Partial<Profile>) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useLocalStore<Transaction>('katie:transactions', []);
  const [clients, setClients] = useLocalStore<Client>('katie:clients', []);
  const [documents, setDocuments] = useLocalStore<DocumentRecord>('katie:documents', []);
  const [tasks, setTasks] = useLocalStore<TaskItem>('katie:tasks', []);
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const raw = localStorage.getItem('katie:profile');
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const value = useMemo<DataContextValue>(() => {
    const addTransaction: DataContextValue['addTransaction'] = (t) => {
      setTransactions([
        ...transactions,
        { ...t, id: uuid(), createdAt: new Date().toISOString() },
      ]);
    };
    const updateTransaction: DataContextValue['updateTransaction'] = (id, t) => {
      setTransactions(transactions.map((x) => (x.id === id ? { ...x, ...t } : x)));
    };
    const removeTransaction: DataContextValue['removeTransaction'] = (id) => {
      setTransactions(transactions.filter((x) => x.id !== id));
    };

    const addClient: DataContextValue['addClient'] = (c) => {
      const client: Client = { ...c, id: uuid(), createdAt: new Date().toISOString() };
      setClients([...clients, client]);
      return client;
    };
    const updateClient: DataContextValue['updateClient'] = (id, c) => {
      setClients(clients.map((x) => (x.id === id ? { ...x, ...c } : x)));
    };
    const removeClient: DataContextValue['removeClient'] = (id) => {
      setClients(clients.filter((x) => x.id !== id));
    };
    const getClient: DataContextValue['getClient'] = (id) =>
      id ? clients.find((x) => x.id === id) : undefined;

    const addDocument: DataContextValue['addDocument'] = (d) => {
      const doc: DocumentRecord = { ...d, id: uuid(), createdAt: new Date().toISOString() };
      setDocuments([...documents, doc]);
      return doc;
    };
    const updateDocument: DataContextValue['updateDocument'] = (id, d) => {
      setDocuments(documents.map((x) => (x.id === id ? { ...x, ...d } : x)));
    };
    const removeDocument: DataContextValue['removeDocument'] = (id) => {
      setDocuments(documents.filter((x) => x.id !== id));
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

    const addTask: DataContextValue['addTask'] = (t) => {
      setTasks([...tasks, { ...t, id: uuid(), createdAt: new Date().toISOString() }]);
    };
    const updateTask: DataContextValue['updateTask'] = (id, t) => {
      setTasks(tasks.map((x) => (x.id === id ? { ...x, ...t } : x)));
    };
    const removeTask: DataContextValue['removeTask'] = (id) => {
      setTasks(tasks.filter((x) => x.id !== id));
    };

    const updateProfile: DataContextValue['updateProfile'] = (p) => {
      setProfile((prev) => {
        const next = { ...prev, ...p };
        try {
          localStorage.setItem('katie:profile', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    };

    return {
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
  }, [transactions, setTransactions, clients, setClients, documents, setDocuments, tasks, setTasks, profile]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
