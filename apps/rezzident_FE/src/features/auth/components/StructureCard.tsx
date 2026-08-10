import { cn } from "#/shared/utils/cn";

interface StructureSample {
  label: string;
  hierarchy: string;
  levels: { prefix?: string; value: string }[];
}

export interface StructureCardProps {
  sample: StructureSample;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function StructureCard({
  sample,
  className,
  isSelected = false,
  onClick,
}: StructureCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-[12px] border p-5 transition-colors",
        isSelected
          ? "border-activeYellow bg-white"
          : "border-black/8 bg-transparent",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <span className="font-dmsans text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {sample.label}
        </span>
        <span className="font-dmsans text-caption text-gray-500">
          {sample.hierarchy}
        </span>
      </div>

      {/* Level values */}
      <div className="flex flex-col gap-0.5">
        {sample.levels.map((level, i) => (
          <div key={i} className="flex items-baseline gap-1" style={{ paddingLeft: `${i * 16}px` }}>
            {i > 0 && (
              <span className="text-gray-300 text-[12px] mr-1">└</span>
            )}
            {i === 0 && (
              <span className="font-dmsans text-[11px] text-gray-400">e.g</span>
            )}
            <span className="font-dmsans text-body-small font-semibold text-actionDark">
              {level.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Pre-defined structure data ── */

export const STRUCTURE_SAMPLES = {
  "1-level": {
    title: "1-Level Structure",
    description: "The property itself is the only identifier.",
    samples: [
      {
        label: "Sample 1",
        hierarchy: "House No.",
        levels: [{ value: "No. 14" }],
      },
      {
        label: "Sample 2",
        hierarchy: "Plot No.",
        levels: [{ value: "Plot 4" }],
      },
    ],
  },
  "2-level": {
    title: "2-Level Structure",
    description: "One grouping above the property.",
    samples: [
      {
        label: "Sample 1",
        hierarchy: "Street → House No.",
        levels: [{ value: "Admiralty Close" }, { value: "No. 14" }],
      },
      {
        label: "Sample 2",
        hierarchy: "Street → Plot No.",
        levels: [{ value: "Oak Street" }, { value: "Plot 4" }],
      },
    ],
  },
  "3-level": {
    title: "3-Level Structure",
    description: "Two groupings above the property.",
    samples: [
      {
        label: "Sample 1",
        hierarchy: "Phase → Street → House No.",
        levels: [{ value: "Phase 2" }, { value: "Elm Street" }, { value: "No. 12" }],
      },
      {
        label: "Sample 2",
        hierarchy: "Block → Floor → Flat No.",
        levels: [{ value: "Block A" }, { value: "Floor 3" }, { value: "Flat 301" }],
      },
    ],
  },
  "4-level": {
    title: "4-Level Structure",
    description: "Three groupings above the property.",
    samples: [
      {
        label: "Sample 1",
        hierarchy: "Phase → Zone → Street → House No.",
        levels: [{ value: "Phase 1" }, { value: "Zone B" }, { value: "Oak Avenue" }, { value: "No. 8" }],
      },
      {
        label: "Sample 2",
        hierarchy: "Estate → Block → Floor → Flat No.",
        levels: [{ value: "Lekki Gardens" }, { value: "Block D" }, { value: "Floor 5" }, { value: "Flat 502" }],
      },
    ],
  },
};