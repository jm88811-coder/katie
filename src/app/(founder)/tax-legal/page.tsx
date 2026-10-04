"use client";

import { Card } from "@/components/Card";
import { TAX_LEGAL_ITEMS, TAX_STAGES } from "@/lib/data/tax";

export default function TaxLegalPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">🧾 세금·법률 체크리스트</h1>
        <p className="mt-2 text-sm text-foreground/60">
          사업 단계별로 미리 알아두면 좋은 세금·법률 준비사항입니다. 일반적인 정보이며,
          정확한 신고·등록은 반드시 홈택스 공식 안내나 세무사·전문가 상담을 거치세요.
        </p>
      </div>

      {TAX_STAGES.map((stage) => (
        <div key={stage}>
          <h2 className="mb-3 text-lg font-semibold">{stage}</h2>
          <div className="flex flex-col gap-3">
            {TAX_LEGAL_ITEMS.filter((item) => item.stage === stage).map((item) => (
              <Card key={item.id}>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-foreground/70">{item.description}</p>
                <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                  ⚠ 주의: {item.caution}
                </p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
