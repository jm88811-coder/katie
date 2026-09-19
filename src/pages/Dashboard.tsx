import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../context/DataContext';
import { Badge, Card, EmptyState, PageHeader } from '../components/ui';
import { currentMonthKey, formatCurrency, formatDate, monthKeyOf, todayISO } from '../lib/format';
import { totalOf } from '../lib/documentMath';

function lastNMonths(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const dd = new Date(d);
    dd.setMonth(d.getMonth() - i);
    out.push(`${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}

export default function Dashboard() {
  const { transactions, documents, tasks, clients, profile } = useData();
  const thisMonth = currentMonthKey();

  const monthTx = useMemo(() => transactions.filter((t) => monthKeyOf(t.date) === thisMonth), [transactions, thisMonth]);
  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const chartData = useMemo(() => {
    const months = lastNMonths(6);
    return months.map((m) => {
      const tx = transactions.filter((t) => monthKeyOf(t.date) === m);
      return {
        month: m.slice(5),
        수입: tx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        지출: tx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== 'done')
        .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'))
        .slice(0, 5),
    [tasks],
  );
  const overdueCount = tasks.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate < todayISO()).length;

  const recentDocs = useMemo(() => [...documents].sort((a, b) => b.issueDate.localeCompare(a.issueDate)).slice(0, 5), [documents]);
  const unpaidInvoices = documents.filter((d) => d.type === 'invoice' && d.status !== 'paid' && d.status !== 'cancelled');
  const unpaidTotal = unpaidInvoices.reduce((s, d) => s + totalOf(d.items, d.taxRate), 0);

  return (
    <div>
      <PageHeader
        title={`안녕하세요${profile.ownerName ? `, ${profile.ownerName}님` : ''} 👋`}
        subtitle={`오늘은 ${formatDate(todayISO())} 입니다. 비즈니스 현황을 한눈에 확인하세요.`}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs font-medium text-slate-500">이번 달 수입</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">{formatCurrency(income)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-slate-500">이번 달 지출</p>
          <p className="mt-1 text-xl font-bold text-red-500">{formatCurrency(expense)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-slate-500">이번 달 순이익</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(income - expense)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-slate-500">미수금 (미결제 청구서)</p>
          <p className="mt-1 text-xl font-bold text-amber-600">{formatCurrency(unpaidTotal)}</p>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">최근 6개월 수입/지출</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => new Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(Number(v))}
                />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="수입" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="지출" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">할 일</h2>
            <Link to="/tasks" className="text-xs text-indigo-600 hover:underline">
              전체 보기
            </Link>
          </div>
          {overdueCount > 0 && (
            <p className="mb-2 text-xs font-medium text-red-500">기한이 지난 할 일 {overdueCount}건</p>
          )}
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-400">할 일이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingTasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{t.title}</span>
                  {t.dueDate && <span className="text-xs text-slate-400">{formatDate(t.dueDate)}</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">최근 견적·청구서</h2>
            <Link to="/documents" className="text-xs text-indigo-600 hover:underline">
              전체 보기
            </Link>
          </div>
          {recentDocs.length === 0 ? (
            <EmptyState message="아직 작성된 문서가 없습니다." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentDocs.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-2 text-sm">
                  <Link to={`/documents/${d.id}`} className="text-slate-700 hover:text-indigo-600">
                    {d.docNumber} · {clients.find((c) => c.id === d.clientId)?.name ?? '-'}
                  </Link>
                  <Badge tone={d.type === 'invoice' ? 'indigo' : 'slate'}>{d.type === 'invoice' ? '청구서' : '견적서'}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">거래처 현황</h2>
            <Link to="/clients" className="text-xs text-indigo-600 hover:underline">
              전체 보기
            </Link>
          </div>
          {clients.length === 0 ? (
            <EmptyState message="등록된 거래처가 없습니다." />
          ) : (
            <p className="text-sm text-slate-600">총 {clients.length}개 거래처와 거래 중입니다.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
