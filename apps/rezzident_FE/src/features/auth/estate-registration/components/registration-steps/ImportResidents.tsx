import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
import type { UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'
import { FileUpload } from '#/shared/components/ui/file-upload'

interface Props {
  registration: UseRegistrationFormReturn
}

export function ImportResidents({ registration }: Props) {
  const { form, updateField, handleDownloadTemplate } = registration

  return (
    <motion.div key="step8" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Import Residents (Optional)
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm leading-relaxed text-gray-500">
        Upload a CSV file with your residents data to give them instant access to the app. You can
        always add residents manually later.
      </p>

      <div className="mb-web-md">
        <h3 className="font-dmsans text-web-base font-web-bold text-actionDark mb-2">
          CSV Template Format
        </h3>
        <p className="font-dmsans text-web-sm mb-4 text-gray-500">
          Arrange your CSV data in the following format, then upload.
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F5F0]">
              <tr>
                <th className="font-web-bold text-actionDark p-4">Full Name</th>
                {form.levelStructure === '1' ? (
                  <th className="font-web-bold text-actionDark p-4">House No.</th>
                ) : (
                  <>
                    <th className="font-web-bold text-actionDark p-4">Block</th>
                    <th className="font-web-bold text-actionDark p-4">Unit</th>
                  </>
                )}
                <th className="font-web-bold text-actionDark p-4">Phone Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="p-4 text-gray-700">John Doe</td>
                {form.levelStructure === '1' ? (
                  <td className="p-4 text-gray-700">14</td>
                ) : (
                  <>
                    <td className="p-4 text-gray-700">A</td>
                    <td className="p-4 text-gray-700">12</td>
                  </>
                )}
                <td className="p-4 text-gray-700">+234 801 234 5678</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-700">Jane Smith</td>
                {form.levelStructure === '1' ? (
                  <td className="p-4 text-gray-700">27</td>
                ) : (
                  <>
                    <td className="p-4 text-gray-700">B</td>
                    <td className="p-4 text-gray-700">5</td>
                  </>
                )}
                <td className="p-4 text-gray-700">+234 802 345 6789</td>
              </tr>
            </tbody>
          </table>
        </div>

        <a
          href="#"
          className="font-dmsans text-web-sm font-web-bold text-actionDark mt-4 inline-flex items-center gap-2 hover:underline"
          onClick={handleDownloadTemplate}
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download Template
        </a>
      </div>

      <div>
        <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Upload CSV File</label>
        <FileUpload
          label="Upload"
          title="Residents Data (CSV)"
          description="Upload a CSV file containing your residents data. CSV only · Max 5MB"
          value={form.residentsCsv}
          onChange={(file) => updateField('residentsCsv', file)}
          accept=".csv"
        />
      </div>
    </motion.div>
  )
}
