import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Badge, Button, Card, PageHeader } from '../components/ui';
import { formatCurrency, formatDate } from '../lib/format';
import { itemAmount, subtotalOf, taxOf, totalOf } from '../lib/documentMath';

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, getClient, removeDocument, profile } = useData();
  const doc = getDocument(id);

  if (!doc) {
    return (
      <div>
        <PageHeader title="문서를 찾을 수 없습니다" />
        <Link to="/documents" className="text-sm text-indigo-600">
          문서 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const client = getClient(doc.clientId);
  const title = doc.type === 'invoice' ? '청구서' : '견적서';

  return (
    <div>
      <PageHeader
        title={`${title} ${doc.docNumber}`}
        action={
          <div className="flex flex-wrap gap-2 no-print">
            <Button variant="secondary" onClick={() => navigate(`/documents/${doc.id}/edit`)}>
              수정
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              인쇄 / PDF 저장
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('이 문서를 삭제하시겠습니까?')) {
                  removeDocument(doc.id);
                  navigate('/documents');
                }
              }}
            >
              삭제
            </Button>
          </div>
        }
      />

      <Card className="mx-auto max-w-3xl print:border-none print:shadow-none">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{doc.docNumber}</p>
          </div>
          <Badge tone="indigo">{formatDate(doc.issueDate)}</Badge>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-400">공급자</p>
            <p className="font-medium text-slate-900">{profile.businessName || '사업자명을 설정에서 입력하세요'}</p>
            <p className="text-sm text-slate-500">{profile.ownerName}</p>
            <p className="text-sm text-slate-500">{profile.businessNumber}</p>
            <p className="text-sm text-slate-500">{profile.address}</p>
            <p className="text-sm text-slate-500">{profile.phone}</p>
            <p className="text-sm text-slate-500">{profile.email}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-400">공급받는자</p>
            <p className="font-medium text-slate-900">{client?.name ?? '-'}</p>
            <p className="text-sm text-slate-500">{client?.contactName}</p>
            <p className="text-sm text-slate-500">{client?.businessNumber}</p>
            <p className="text-sm text-slate-500">{client?.address}</p>
            <p className="text-sm text-slate-500">{client?.phone}</p>
            <p className="text-sm text-slate-500">{client?.email}</p>
          </div>
        </div>

        {doc.dueDate && (
          <p className="mb-4 text-sm text-slate-500">지급기한: {formatDate(doc.dueDate)}</p>
        )}

        <table className="w-full text-left text-sm">
          <thead className="border-b-2 border-slate-800 text-xs text-slate-500">
            <tr>
              <th className="py-2 font-medium">품목</th>
              <th className="py-2 text-right font-medium">수량</th>
              <th className="py-2 text-right font-medium">단가</th>
              <th className="py-2 text-right font-medium">금액</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-2.5 text-slate-700">{item.description}</td>
                <td className="py-2.5 text-right text-slate-600">{item.quantity}</td>
                <td className="py-2.5 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                <td className="py-2.5 text-right text-slate-800">{formatCurrency(itemAmount(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>공급가액</span>
              <span>{formatCurrency(subtotalOf(doc.items))}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>부가세 ({doc.taxRate}%)</span>
              <span>{formatCurrency(taxOf(doc.items, doc.taxRate))}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 text-base font-bold text-slate-900">
              <span>합계</span>
              <span>{formatCurrency(totalOf(doc.items, doc.taxRate))}</span>
            </div>
          </div>
        </div>

        {doc.memo && (
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <p className="mb-1 text-xs font-semibold text-slate-400">메모</p>
            {doc.memo}
          </div>
        )}

        {profile.bankInfo && (
          <div className="mt-4 text-sm text-slate-500">
            <p className="text-xs font-semibold text-slate-400">입금 계좌</p>
            {profile.bankInfo}
          </div>
        )}
      </Card>
    </div>
  );
}
