import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select } from '../components/ui';
import { currentMonthKey, formatCurrency, formatDate, monthKeyOf, todayISO } from '../lib/format';
import type { Transaction, TransactionType } from '../types';

const INCOME_CATEGORIES = ['매출', '용역비', '기타수입'];
const EXPENSE_CATEGORIES = ['재료비', '임대료', '통신비', '세금', '마케팅', '식비', '기타지출'];

const emptyForm = {
  type: 'income' as TransactionType,
  date: todayISO(),
  amount: '',
  category: INCOME_CATEGORIES[0],
  clientId: '',
  memo: '',
};

export default function Transactions() {
  const { transactions, addTransaction, removeTransaction, clients } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [monthFilter, setMonthFilter] = useState(currentMonthKey());

  const filtered = useMemo(
    () =>
      transactions
        .filter((t) => !monthFilter || monthKeyOf(t.date) === monthFilter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, monthFilter],
  );

  const totals = useMemo(() => {
    const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [filtered]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return;
    addTransaction({
      type: form.type,
      date: form.date,
      amount,
      category: form.category,
      clientId: form.clientId || undefined,
      memo: form.memo || undefined,
    });
    setForm({ ...emptyForm, type: form.type, category: form.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] });
    setShowForm(false);
  }

  function categoriesFor(type: TransactionType) {
    return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }

  return (
    <div>
      <PageHeader
        title="매출·지출 관리"
        subtitle="수입과 지출 내역을 기록하고 월별 현황을 확인하세요."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>{showForm ? '닫기' : '+ 내역 추가'}</Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="구분">
              <Select
                value={form.type}
                onChange={(e) => {
                  const type = e.target.value as TransactionType;
                  setForm((f) => ({ ...f, type, category: categoriesFor(type)[0] }));
                }}
              >
                <option value="income">매출(수입)</option>
                <option value="expense">지출</option>
              </Select>
            </Field>
            <Field label="날짜">
              <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
            </Field>
            <Field label="금액">
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                required
              />
            </Field>
            <Field label="카테고리">
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {categoriesFor(form.type).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="거래처 (선택)">
              <Select value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}>
                <option value="">선택 안함</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="메모">
              <Input value={form.memo} onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))} placeholder="메모 (선택)" />
            </Field>
            <div className="flex items-end lg:col-span-2">
              <Button type="submit" className="w-full sm:w-auto">
                저장
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="w-auto"
        />
        <Button variant="ghost" onClick={() => setMonthFilter('')}>
          전체 보기
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium text-slate-500">수입</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">{formatCurrency(totals.income)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-slate-500">지출</p>
          <p className="mt-1 text-xl font-bold text-red-500">{formatCurrency(totals.expense)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-slate-500">순이익</p>
          <p className={`mt-1 text-xl font-bold ${totals.net >= 0 ? 'text-slate-900' : 'text-red-500'}`}>
            {formatCurrency(totals.net)}
          </p>
        </Card>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="해당 기간에 등록된 내역이 없습니다." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">날짜</th>
                <th className="px-4 py-3 font-medium">구분</th>
                <th className="px-4 py-3 font-medium">카테고리</th>
                <th className="px-4 py-3 font-medium">거래처</th>
                <th className="px-4 py-3 font-medium">메모</th>
                <th className="px-4 py-3 text-right font-medium">금액</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: Transaction) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={t.type === 'income' ? 'green' : 'red'}>{t.type === 'income' ? '수입' : '지출'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.category}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {clients.find((c) => c.id === t.clientId)?.name ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{t.memo ?? '-'}</td>
                  <td className={`px-4 py-3 text-right font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeTransaction(t.id)}
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
