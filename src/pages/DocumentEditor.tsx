import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useData } from '../context/DataContext';
import { Button, Card, Field, Input, PageHeader, Select, Textarea } from '../components/ui';
import { formatCurrency, todayISO } from '../lib/format';
import { itemAmount, subtotalOf, taxOf, totalOf } from '../lib/documentMath';
import type { DocumentItem, DocumentStatus, DocumentType } from '../types';

function newItem(): DocumentItem {
  return { id: uuid(), description: '', quantity: 1, unitPrice: 0 };
}

export default function DocumentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, addDocument, updateDocument, getDocument, nextDocNumber } = useData();
  const existing = id ? getDocument(id) : undefined;

  const [type, setType] = useState<DocumentType>(existing?.type ?? 'quote');
  const [docNumber, setDocNumber] = useState(existing?.docNumber ?? nextDocNumber(type));
  const [clientId, setClientId] = useState(existing?.clientId ?? clients[0]?.id ?? '');
  const [issueDate, setIssueDate] = useState(existing?.issueDate ?? todayISO());
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? '');
  const [taxRate, setTaxRate] = useState(existing?.taxRate ?? 10);
  const [status, setStatus] = useState<DocumentStatus>(existing?.status ?? 'draft');
  const [memo, setMemo] = useState(existing?.memo ?? '');
  const [items, setItems] = useState<DocumentItem[]>(existing?.items ?? [newItem()]);

  function updateItem(itemId: string, patch: Partial<DocumentItem>) {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, ...patch } : it)));
  }

  function removeItem(itemId: string) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== itemId) : prev));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) {
      alert('거래처를 선택해주세요. 거래처가 없다면 먼저 고객 관리에서 등록해주세요.');
      return;
    }
    const payload = {
      type,
      docNumber,
      clientId,
      issueDate,
      dueDate: dueDate || undefined,
      items: items.filter((it) => it.description.trim() || it.quantity || it.unitPrice),
      taxRate,
      status,
      memo: memo || undefined,
    };
    if (existing) {
      updateDocument(existing.id, payload);
      navigate(`/documents/${existing.id}`);
    } else {
      const doc = addDocument(payload);
      navigate(`/documents/${doc.id}`);
    }
  }

  return (
    <div>
      <PageHeader title={existing ? '문서 수정' : '새 문서 작성'} subtitle="견적서 또는 청구서를 작성하세요." />

      <form onSubmit={submit} className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="종류">
              <Select
                value={type}
                onChange={(e) => {
                  const t = e.target.value as DocumentType;
                  setType(t);
                  if (!existing) setDocNumber(nextDocNumber(t));
                }}
              >
                <option value="quote">견적서</option>
                <option value="invoice">청구서</option>
              </Select>
            </Field>
            <Field label="문서번호">
              <Input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} required />
            </Field>
            <Field label="거래처">
              <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">선택하세요</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="상태">
              <Select value={status} onChange={(e) => setStatus(e.target.value as DocumentStatus)}>
                <option value="draft">임시저장</option>
                <option value="sent">발송됨</option>
                <option value="paid">결제완료</option>
                <option value="cancelled">취소</option>
              </Select>
            </Field>
            <Field label="발행일">
              <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
            </Field>
            <Field label="지급기한 (선택)">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Field>
            <Field label="부가세율 (%)">
              <Input type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">품목</h2>
            <Button type="button" variant="secondary" onClick={() => setItems((prev) => [...prev, newItem()])}>
              + 품목 추가
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
                <div className="sm:col-span-5">
                  <Input
                    placeholder="품목명"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="수량"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    min="0"
                    placeholder="단가"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 sm:col-span-2">
                  <span className="text-sm text-slate-600">{formatCurrency(itemAmount(item))}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-right text-sm">
            <p className="text-slate-500">
              공급가액 <span className="ml-3 font-medium text-slate-800">{formatCurrency(subtotalOf(items))}</span>
            </p>
            <p className="text-slate-500">
              부가세 ({taxRate}%) <span className="ml-3 font-medium text-slate-800">{formatCurrency(taxOf(items, taxRate))}</span>
            </p>
            <p className="text-base font-bold text-slate-900">
              합계 <span className="ml-3">{formatCurrency(totalOf(items, taxRate))}</span>
            </p>
          </div>
        </Card>

        <Card>
          <Field label="메모">
            <Textarea rows={3} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="특이사항이나 결제 안내 등을 적어주세요." />
          </Field>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
