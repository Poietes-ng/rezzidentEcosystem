import { motion } from 'framer-motion'
import { StructureCard, STRUCTURE_SAMPLES } from '../StructureCard'
import { pageVariants } from '../../hooks/animation'
import { STRUCTURE_PAGES } from '../../hooks/useRegistrationForm'
import type { UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'

interface Props {
  registration: UseRegistrationFormReturn
}

export function StructureExamples({ registration }: Props) {
  const { structurePage, setStructurePage, updateField, setSubStep } = registration

  return (
    <motion.div key="step2" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Naming structure
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm text-warmGray leading-relaxed">
        Define how streets, blocks, and units are labeled within your estate. Below are samples of
        some structures for a better understanding of how to create your estate structure.
      </p>

      {/* Structure examples */}
      <div className="gap-web-md flex flex-col">
        {STRUCTURE_PAGES[structurePage].structures.map((key) => {
          const data = STRUCTURE_SAMPLES[key]
          // Extract the level number from the key (e.g. "2-level" → "2")
          const levelNum = key.split('-')[0]
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                updateField('levelStructure', levelNum)
                updateField('estateStructure', '')
                setSubStep(3)
              }}
              className="hover:border-actionYellowHover/50 hover:bg-actionYellowHover/5 focus:ring-actionYellowHover/30 w-full rounded-xl border border-transparent p-3 text-left transition-colors focus:ring-2 focus:outline-none"
            >
              <h3 className="font-dmsans font-web-bold text-actionDark mb-1 text-sm">
                {data.title}
              </h3>
              <p className="font-dmsans text-web-xs text-warmGray mb-3 font-normal">
                {data.description}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {data.samples.map((sample, idx) => (
                  <StructureCard key={idx} sample={sample} />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Carousel dots + arrows */}
      <div className="mt-web-md flex items-center justify-center gap-4">
        <button
          onClick={() => setStructurePage(Math.max(0, structurePage - 1))}
          disabled={structurePage === 0}
          className="border-actionDark/10 text-warmGray flex h-[28px] w-[28px] items-center justify-center rounded-full border hover:bg-black/5 disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>

        <div className="flex gap-2">
          {STRUCTURE_PAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStructurePage(idx)}
              className={`h-[8px] w-[8px] rounded-full transition-colors ${
                structurePage === idx ? 'bg-actionDark' : 'bg-actionDarkDisabled'
              }`}
              aria-label={`Page ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setStructurePage(Math.min(STRUCTURE_PAGES.length - 1, structurePage + 1))}
          disabled={structurePage === STRUCTURE_PAGES.length - 1}
          className="border-actionBlack/10 text-warmGray flex h-[28px] w-[28px] items-center justify-center rounded-full border hover:bg-black/5 disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </motion.div>
  )
}
