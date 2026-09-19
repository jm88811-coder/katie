import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Documents from './pages/Documents';
import DocumentEditor from './pages/DocumentEditor';
import DocumentView from './pages/DocumentView';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/new" element={<DocumentEditor />} />
        <Route path="/documents/:id/edit" element={<DocumentEditor />} />
        <Route path="/documents/:id" element={<DocumentView />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
