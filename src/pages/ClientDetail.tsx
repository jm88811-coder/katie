import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Badge, Button, Card, Field, Input, PageHeader, Textarea } from '../components/ui';
import { formatCurrency, formatDate } from '../lib/format';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClient, updateClient, removeClient, transactions, documents } = useData();
  const client = getClient(id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(client);

  const clientTransactions = useMemo(
    () => transactions.filter((t) => t.clientId === id).sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, id],
  );
  const clientDocuments = useMemo(
    () => documents.filter((d) => d.clientId === id).sort((a, b) => b.issueDate.localeCompare(a.issueDate)),
    [documents, id],
  );

  if (!client) {
    return (
      <div>
        <PageHeader title="거래처를 찾을 수 없습니다" />
        <Link to="/clients" className="text-sm text-indigo-600">
          거래처 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    updateClient(client!.id, form);
    setEditing(false);
  }

  return (
    <div>
      <PageHeader
        title={client.name}
        subtitle="거래처 상세 정보 및 거래 이력"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing((v) => !v)}>
              {editing ? '취소' : '수정'}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('이 거래처를 삭제하시겠습니까?')) {
                  removeClient(client.id);
                  navigate('/clients');
                }
              }}
            >
              삭제
            </Button>
          </div>
        }
      />

      {editing && form ? (
        <Card className="mb-6">
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="거래처명">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="담당자명">
              <Input value={form.contactName ?? ''} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </Field>
            <Field label="전화번호">
              <Input value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="이메일">
              <Input value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="사업자등록번호">
              <Input value={form.businessNumber ?? ''} onChange={(e) => setForm({ ...form, businessNumber: e.target.value })} />
            </Field>
            <Field label="주소">
              <Input value={form.address ?? ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="메모">
                <Textarea rows={2} value={form.memo ?? ''} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">저장</Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="mb-6">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-slate-400">담당자</dt>
              <dd className="mt-0.5 text-slate-700">{client.contactName || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">전화번호</dt>
              <dd className="mt-0.5 text-slate-700">{client.phone || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">이메일</dt>
              <dd className="mt-0.5 text-slate-700">{client.email || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">사업자등록번호</dt>
              <dd className="mt-0.5 text-slate-700">{client.businessNumber || '-'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-slate-400">주소</dt>
              <dd className="mt-0.5 text-slate-700">{client.address || '-'}</dd>
            </div>
            {client.memo && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-400">메모</dt>
                <dd className="mt-0.5 text-slate-700">{client.memo}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">거래 내역</h2>
          {clientTransactions.length === 0 ? (
            <p className="text-sm text-slate-400">거래 내역이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {clientTransactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-500">{formatDate(t.date)}</span>
                  <span className={t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}>
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">견적·청구서</h2>
          {clientDocuments.length === 0 ? (
            <p className="text-sm text-slate-400">발행된 문서가 없습니다.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {clientDocuments.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-2 text-sm">
                  <Link to={`/documents/${d.id}`} className="text-indigo-600 hover:underline">
                    {d.docNumber}
                  </Link>
                  <Badge tone={d.type === 'invoice' ? 'indigo' : 'slate'}>{d.type === 'invoice' ? '청구서' : '견적서'}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
