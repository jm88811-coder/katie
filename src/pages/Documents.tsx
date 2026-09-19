import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Badge, Button, Card, EmptyState, PageHeader, Select } from '../components/ui';
import { formatCurrency, formatDate } from '../lib/format';
import { totalOf } from '../lib/documentMath';
import type { DocumentStatus, DocumentType } from '../types';

const STATUS_LABEL: Record<DocumentStatus, string> = {
  draft: '임시저장',
  sent: '발송됨',
  paid: '결제완료',
  cancelled: '취소',
};

const STATUS_TONE: Record<DocumentStatus, 'slate' | 'amber' | 'green' | 'red'> = {
  draft: 'slate',
  sent: 'amber',
  paid: 'green',
  cancelled: 'red',
};

export default function Documents() {
  const { documents, clients } = useData();
  const [typeFilter, setTypeFilter] = useState<'' | DocumentType>('');

  const filtered = useMemo(
    () =>
      documents
        .filter((d) => !typeFilter || d.type === typeFilter)
        .sort((a, b) => b.issueDate.localeCompare(a.issueDate)),
    [documents, typeFilter],
  );

  return (
    <div>
      <PageHeader
        title="견적서·청구서"
        subtitle="견적서와 청구서를 작성하고 발행 이력을 관리하세요."
        action={
          <Link to="/documents/new">
            <Button>+ 새 문서 작성</Button>
          </Link>
        }
      />

      <div className="mb-4">
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as '' | DocumentType)} className="w-auto">
          <option value="">전체</option>
          <option value="quote">견적서</option>
          <option value="invoice">청구서</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message="작성된 문서가 없습니다."
          action={
            <Link to="/documents/new">
              <Button>+ 새 문서 작성</Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">문서번호</th>
                <th className="px-4 py-3 font-medium">종류</th>
                <th className="px-4 py-3 font-medium">거래처</th>
                <th className="px-4 py-3 font-medium">발행일</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 text-right font-medium">금액</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/documents/${d.id}`} className="font-medium text-indigo-600 hover:underline">
                      {d.docNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{d.type === 'invoice' ? '청구서' : '견적서'}</td>
                  <td className="px-4 py-3 text-slate-600">{clients.find((c) => c.id === d.clientId)?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(d.issueDate)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[d.status]}>{STATUS_LABEL[d.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    {formatCurrency(totalOf(d.items, d.taxRate))}
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
