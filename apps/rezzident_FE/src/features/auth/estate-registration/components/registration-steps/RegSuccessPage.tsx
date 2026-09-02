import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'

export function RegSuccessPage() {
  return (
    <motion.div
      key="step9"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      {/* Success Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2F854F]">
          <span className="material-symbols-outlined text-[32px] text-white">check</span>
        </div>
      </div>

      {/* Title & Description */}
      <h1 className="font-cabinet text-web-h2 font-web-bold text-actionDark mb-4 leading-[1.1]">
        Hurray you've completed your estate setup!
      </h1>
      <p className="font-dmsans text-web-base text-gray-500">
        Your estate has been successfully configured. You can now manage residents, handle visitor
        access, and oversee all estate operations.
      </p>
    </motion.div>
  )
}
