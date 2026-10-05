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
      <div className="relative mb-6 flex items-center justify-center">
        <img src="/assets/success-circle.svg" alt="Success" className="h-24 w-24 object-contain" />
      </div>

      {/* Title & Description */}
      <h1 className="font-cabinet text-web-h2 font-web-bold text-actionDark mb-4 leading-[1.1]">
        Hurray you've completed your estate setup!
      </h1>
      <p className="font-dmsans text-web-base text-warmGray">
        Your estate has been successfully configured. You can now manage residents, handle visitor
        access, and oversee all estate operations.
      </p>
    </motion.div>
  )
}
