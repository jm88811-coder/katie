import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button, Card, Field, Input, PageHeader, Textarea } from '../components/ui';

export default function Settings() {
  const { profile, updateProfile } = useData();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <PageHeader title="설정" subtitle="견적서·청구서에 표시될 사업자 정보를 입력하세요." />
      <Card className="max-w-2xl">
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="상호명">
            <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          </Field>
          <Field label="대표자명">
            <Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
          </Field>
          <Field label="사업자등록번호">
            <Input value={form.businessNumber} onChange={(e) => setForm({ ...form, businessNumber: e.target.value })} />
          </Field>
          <Field label="전화번호">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="이메일">
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="주소">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="입금 계좌 정보">
              <Textarea rows={2} value={form.bankInfo} onChange={(e) => setForm({ ...form, bankInfo: e.target.value })} placeholder="예: 국민은행 123-456-789 (홍길동)" />
            </Field>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit">저장</Button>
            {saved && <span className="text-sm text-emerald-600">저장되었습니다.</span>}
          </div>
        </form>
      </Card>

      <Card className="mt-6 max-w-2xl">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">데이터 안내</h2>
        <p className="text-sm text-slate-500">
          모든 데이터는 이 브라우저에만 저장됩니다 (서버 전송 없음). 브라우저 저장 공간을 초기화하면 데이터가 사라질 수 있으니
          주의하세요.
        </p>
      </Card>
    </div>
  );
}
