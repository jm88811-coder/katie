import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Button, Card, EmptyState, Field, Input, PageHeader, Textarea } from '../components/ui';

const emptyForm = {
  name: '',
  contactName: '',
  phone: '',
  email: '',
  address: '',
  businessNumber: '',
  memo: '',
};

export default function Clients() {
  const { clients, addClient } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    addClient({
      name: form.name.trim(),
      contactName: form.contactName || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      address: form.address || undefined,
      businessNumber: form.businessNumber || undefined,
      memo: form.memo || undefined,
    });
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <div>
      <PageHeader
        title="고객·거래처 관리"
        subtitle="거래처 정보를 등록하고 이력을 확인하세요."
        action={<Button onClick={() => setShowForm((v) => !v)}>{showForm ? '닫기' : '+ 거래처 추가'}</Button>}
      />

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="거래처명 *">
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </Field>
            <Field label="담당자명">
              <Input value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} />
            </Field>
            <Field label="전화번호">
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </Field>
            <Field label="이메일">
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </Field>
            <Field label="사업자등록번호">
              <Input value={form.businessNumber} onChange={(e) => setForm((f) => ({ ...f, businessNumber: e.target.value }))} />
            </Field>
            <Field label="주소">
              <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="메모">
                <Textarea rows={2} value={form.memo} onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">저장</Button>
            </div>
          </form>
        </Card>
      )}

      {clients.length === 0 ? (
        <EmptyState message="등록된 거래처가 없습니다." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Link key={c.id} to={`/clients/${c.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <p className="font-semibold text-slate-900">{c.name}</p>
                {c.contactName && <p className="mt-1 text-sm text-slate-500">담당: {c.contactName}</p>}
                {c.phone && <p className="mt-1 text-sm text-slate-500">{c.phone}</p>}
                {c.email && <p className="text-sm text-slate-500">{c.email}</p>}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
