import { cn } from '#/shared/utils/cn'

interface StructureSample {
  label: string
  hierarchy: string
  levels: { prefix?: string; value: string }[]
}

export interface StructureCardProps {
  sample: StructureSample
  className?: string
  isSelected?: boolean
  onClick?: () => void
}

export function StructureCard({
  sample,
  className,
  isSelected = false,
  onClick,
}: StructureCardProps) {
  const levelCount = sample.levels.length
  // Only adjust spacing/indentation for deep structures to prevent overflow
  const isDeep = levelCount >= 5
  const indent = isDeep ? 8 : 12

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col rounded-[12px] border transition-colors',
        isDeep ? 'gap-1.5 p-3' : 'gap-2 p-4',
        isSelected ? 'border-activeYellow bg-white' : 'border-black/8 bg-transparent',
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <span className="font-dmsans text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
          {sample.label}
        </span>
        <span className="font-dmsans text-[11px] leading-tight text-gray-500">
          {sample.hierarchy}
        </span>
      </div>

      {/* Level values */}
      <div className="flex flex-col gap-0">
        {sample.levels.map((level, i) => (
          <div
            key={i}
            className="flex items-baseline gap-1"
            style={{ paddingLeft: `${i * indent}px` }}
          >
            {i > 0 && <span className="mr-0.5 text-[10px] text-gray-300">└</span>}
            {i === 0 && <span className="font-dmsans text-[10px] text-gray-400">e.g</span>}
            <span className="font-dmsans text-actionDark text-[11px] font-semibold">
              {level.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Pre-defined structure data ── */

export const STRUCTURE_SAMPLES = {
  '1-level': {
    title: '1-Level Structure',
    description: 'The property itself is the only identifier.',
    samples: [
      {
        label: 'Sample 1',
        hierarchy: 'House No.',
        levels: [{ value: 'No. 14' }],
      },
      {
        label: 'Sample 2',
        hierarchy: 'Plot No.',
        levels: [{ value: 'Plot 4' }],
      },
    ],
  },
  '2-level': {
    title: '2-Level Structure',
    description: 'One grouping above the property.',
    samples: [
      {
        label: 'Sample 1',
        hierarchy: 'Street → House No.',
        levels: [{ value: 'Admiralty Close' }, { value: 'No. 14' }],
      },
      {
        label: 'Sample 2',
        hierarchy: 'Street → Plot No.',
        levels: [{ value: 'Oak Street' }, { value: 'Plot 4' }],
      },
    ],
  },
  '3-level': {
    title: '3-Level Structure',
    description: 'Two groupings above the property.',
    samples: [
      {
        label: 'Sample 1',
        hierarchy: 'Phase → Street → House No.',
        levels: [{ value: 'Phase 2' }, { value: 'Elm Street' }, { value: 'No. 12' }],
      },
      {
        label: 'Sample 2',
        hierarchy: 'Block → Floor → Flat No.',
        levels: [{ value: 'Block A' }, { value: 'Floor 3' }, { value: 'Flat 301' }],
      },
    ],
  },
  '4-level': {
    title: '4-Level Structure',
    description: 'Three groupings above the property.',
    samples: [
      {
        label: 'Sample 1',
        hierarchy: 'Phase → Zone → Street → House No.',
        levels: [
          { value: 'Phase 1' },
          { value: 'Zone B' },
          { value: 'Oak Avenue' },
          { value: 'No. 8' },
        ],
      },
      {
        label: 'Sample 2',
        hierarchy: 'Estate → Block → Floor → Flat No.',
        levels: [
          { value: 'Lekki Gardens' },
          { value: 'Block D' },
          { value: 'Floor 5' },
          { value: 'Flat 502' },
        ],
      },
    ],
  },
  '5-level': {
    title: '5-Level Structure',
    description: 'Four groupings above the property — for very large estates.',
    samples: [
      {
        label: 'Sample 1',
        hierarchy: 'Phase → Zone → Block → Floor → Flat No.',
        levels: [
          { value: 'Phase 1' },
          { value: 'Zone B' },
          { value: 'Block C' },
          { value: 'Floor 5' },
          { value: 'Flat 12' },
        ],
      },
      {
        label: 'Sample 2',
        hierarchy: 'District → Phase → Zone → Street → House No.',
        levels: [
          { value: 'District A' },
          { value: 'Phase 1' },
          { value: 'Zone C' },
          { value: 'Bank Street' },
          { value: 'No. 24' },
        ],
      },
    ],
  },
  '6-level': {
    title: '6-Level Structure',
    description: 'Five groupings — the maximum, for mega-developments.',
    samples: [
      {
        label: 'Sample 1',
        hierarchy: 'District → Phase → Zone → Block → Floor → Flat No.',
        levels: [
          { value: 'District A' },
          { value: 'Phase 1' },
          { value: 'Zone B' },
          { value: 'Block C' },
          { value: 'Floor 5' },
          { value: 'Flat 12' },
        ],
      },
      {
        label: 'Sample 2',
        hierarchy: 'District → Phase → Zone → Tower → Floor → Unit No.',
        levels: [
          { value: 'District A' },
          { value: 'Phase 1' },
          { value: 'Zone B' },
          { value: 'Tower 2' },
          { value: 'Floor 12' },
          { value: 'Unit 4' },
        ],
      },
    ],
  },
}
