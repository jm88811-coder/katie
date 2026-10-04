"use client";

import { useState } from "react";
import { Card, Tag } from "@/components/Card";
import { INSPIRATION_ITEMS } from "@/lib/data/inspiration";
import { useLocalState, STORAGE_KEYS } from "@/lib/storage";
import { UserInspirationNote } from "@/lib/types";

export default function InspirationPage() {
  const { value: notes, setValue: setNotes } = useLocalState<UserInspirationNote[]>(
    STORAGE_KEYS.inspirationNotes,
    []
  );
  const [draft, setDraft] = useState("");

  function addNote() {
    if (!draft.trim()) return;
    const note: UserInspirationNote = {
      id: `note-${Date.now()}`,
      text: draft.trim(),
      isIdeaCandidate: false,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
    setDraft("");
  }

  function toggleCandidate(id: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isIdeaCandidate: !n.isIdeaCandidate } : n))
    );
  }

  function removeNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">💡 영감 노트</h1>
        <p className="mt-2 text-sm text-foreground/60">
          국내외에서 반복적으로 관찰되는 이슈·불편·불만을 정리했습니다. 스스로 개선 아이템을
          찾아보세요. (특정 뉴스 인용이 아닌 트렌드 정리이니 실제 시장 검증은 별도로 진행하세요.)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {INSPIRATION_ITEMS.map((item) => (
          <Card key={item.id}>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{item.title}</h3>
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              <Tag>{item.category}</Tag>
              {item.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <p className="text-sm text-foreground/60">{item.description}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">나만의 영감 메모</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50 dark:border-white/15"
            placeholder="관찰한 불편/불만/아이디어를 적어보세요"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
          <button
            onClick={addNote}
            className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            추가
          </button>
        </div>

        {notes.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {notes.map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
              >
                <span className={n.isIdeaCandidate ? "font-medium" : ""}>{n.text}</span>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => toggleCandidate(n.id)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      n.isIdeaCandidate
                        ? "bg-foreground text-background"
                        : "bg-foreground/10 text-foreground/70"
                    }`}
                  >
                    {n.isIdeaCandidate ? "★ 아이디어 후보" : "후보로 표시"}
                  </button>
                  <button
                    onClick={() => removeNote(n.id)}
                    className="rounded-full bg-foreground/10 px-2.5 py-1 text-xs text-foreground/50"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
