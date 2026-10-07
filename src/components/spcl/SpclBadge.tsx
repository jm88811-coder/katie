import { SPCL_META, type SpclKey } from "@/lib/spcl/types";

export default function SpclBadge({ k }: { k: SpclKey }) {
  const m = SPCL_META[k];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${m.color}`}>
      {m.name} · {m.ko}
    </span>
  );
}
