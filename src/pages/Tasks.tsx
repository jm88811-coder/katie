import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select } from '../components/ui';
import { formatDate, todayISO } from '../lib/format';
import type { TaskItem, TaskPriority, TaskStatus } from '../types';

const PRIORITY_LABEL: Record<TaskPriority, string> = { low: '낮음', medium: '보통', high: '높음' };
const PRIORITY_TONE: Record<TaskPriority, 'slate' | 'amber' | 'red'> = { low: 'slate', medium: 'amber', high: 'red' };
const STATUS_LABEL: Record<TaskStatus, string> = { todo: '할 일', in_progress: '진행중', done: '완료' };

const emptyForm = {
  title: '',
  dueDate: todayISO(),
  priority: 'medium' as TaskPriority,
  memo: '',
};

export default function Tasks() {
  const { tasks, addTask, updateTask, removeTask } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [hideDone, setHideDone] = useState(true);

  const sorted = useMemo(() => {
    const list = hideDone ? tasks.filter((t) => t.status !== 'done') : tasks;
    return [...list].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, hideDone]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask({
      title: form.title.trim(),
      dueDate: form.dueDate || undefined,
      priority: form.priority,
      status: 'todo',
      memo: form.memo || undefined,
    });
    setForm(emptyForm);
    setShowForm(false);
  }

  function cycleStatus(task: TaskItem) {
    const order: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    updateTask(task.id, { status: next });
  }

  const isOverdue = (t: TaskItem) => !!t.dueDate && t.dueDate < todayISO() && t.status !== 'done';

  return (
    <div>
      <PageHeader
        title="할 일·일정 관리"
        subtitle="업무 태스크와 마감일을 관리하세요."
        action={<Button onClick={() => setShowForm((v) => !v)}>{showForm ? '닫기' : '+ 할 일 추가'}</Button>}
      />

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Field label="할 일 *">
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
              </Field>
            </div>
            <Field label="마감일">
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            </Field>
            <Field label="우선순위">
              <Select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}>
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </Select>
            </Field>
            <div className="lg:col-span-4">
              <Field label="메모">
                <Input value={form.memo} onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))} />
              </Field>
            </div>
            <div className="lg:col-span-4">
              <Button type="submit">저장</Button>
            </div>
          </form>
        </Card>
      )}

      <label className="mb-4 flex w-fit items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
        완료된 항목 숨기기
      </label>

      {sorted.length === 0 ? (
        <EmptyState message="표시할 할 일이 없습니다." />
      ) : (
        <div className="space-y-2">
          {sorted.map((t) => (
            <Card key={t.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => cycleStatus(t)}
                  className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 ${
                    t.status === 'done'
                      ? 'border-emerald-500 bg-emerald-500'
                      : t.status === 'in_progress'
                        ? 'border-amber-500'
                        : 'border-slate-300'
                  }`}
                  aria-label="상태 변경"
                />
                <div>
                  <p className={`text-sm font-medium ${t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {t.title}
                  </p>
                  {t.memo && <p className="mt-0.5 text-xs text-slate-500">{t.memo}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 pl-8 sm:pl-0">
                {t.dueDate && (
                  <Badge tone={isOverdue(t) ? 'red' : 'slate'}>{formatDate(t.dueDate)}</Badge>
                )}
                <Badge tone={PRIORITY_TONE[t.priority]}>{PRIORITY_LABEL[t.priority]}</Badge>
                <Badge tone="indigo">{STATUS_LABEL[t.status]}</Badge>
                <button onClick={() => removeTask(t.id)} className="text-xs text-slate-400 hover:text-red-500">
                  삭제
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
