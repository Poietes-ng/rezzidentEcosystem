import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
import type { UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'
import { FormField } from '#/shared/components/ui/form-field'
import { FileUpload } from '#/shared/components/ui/file-upload'

interface Props {
  registration: UseRegistrationFormReturn
}

export function ImportResidents({ registration }: Props) {
  const { form, errors, updateField, handleDownloadTemplate, structureTemplates } = registration

  const selectedTemplate = structureTemplates.find((t) => t.template_id === form.estateStructure)

  return (
    <motion.div key="step8" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Import Residents (Optional)
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm text-warmGray leading-relaxed">
        Upload a CSV file with your residents data to give them instant access to the app. You can
        always add residents manually later.
      </p>

      <div className="mb-web-md">
        <h3 className="font-dmsans text-web-base font-web-bold text-actionDark mb-2">
          CSV Template Format
        </h3>
        <p className="font-dmsans text-web-sm text-warmGray mb-4">
          Arrange your CSV data in the following format, then upload.
        </p>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F5F5F0]">
              <tr>
                <th className="font-web-bold text-actionDark p-4">Full Name</th>
                {selectedTemplate ? (
                  <>
                    {selectedTemplate.levels.map((level, i) => (
                      <th
                        key={i}
                        className={`font-web-bold text-actionDark p-4 ${i >= 1 ? 'hidden md:table-cell' : ''}`}
                      >
                        {level.label}
                      </th>
                    ))}
                    {selectedTemplate.levels.length >= 2 && (
                      <th className="font-web-bold text-actionDark p-4 md:hidden">...</th>
                    )}
                  </>
                ) : form.levelStructure === '1' ? (
                  <th className="font-web-bold text-actionDark p-4">House No.</th>
                ) : (
                  <>
                    <th className="font-web-bold text-actionDark p-4">Block</th>
                    <th className="font-web-bold text-actionDark hidden p-4 md:table-cell">Unit</th>
                    <th className="font-web-bold text-actionDark p-4 md:hidden">...</th>
                  </>
                )}
                <th
                  className={`font-web-bold text-actionDark p-4 ${
                    (selectedTemplate && selectedTemplate.levels.length >= 2) ||
                    (!selectedTemplate && form.levelStructure !== '1')
                      ? 'hidden md:table-cell'
                      : ''
                  }`}
                >
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="p-4 text-gray-700">John Doe</td>
                {selectedTemplate ? (
                  <>
                    {selectedTemplate.levels.map((_, i) => (
                      <td
                        key={i}
                        className={`p-4 text-gray-700 ${i >= 1 ? 'hidden md:table-cell' : ''}`}
                      >
                        {i === 0 ? 'A' : i === 1 ? '12' : i === 2 ? 'Phase 1' : '1'}
                      </td>
                    ))}
                    {selectedTemplate.levels.length >= 2 && (
                      <td className="p-4 text-gray-700 md:hidden">...</td>
                    )}
                  </>
                ) : form.levelStructure === '1' ? (
                  <td className="p-4 text-gray-700">14</td>
                ) : (
                  <>
                    <td className="p-4 text-gray-700">A</td>
                    <td className="hidden p-4 text-gray-700 md:table-cell">12</td>
                    <td className="p-4 text-gray-700 md:hidden">...</td>
                  </>
                )}
                <td
                  className={`p-4 text-gray-700 ${
                    (selectedTemplate && selectedTemplate.levels.length >= 2) ||
                    (!selectedTemplate && form.levelStructure !== '1')
                      ? 'hidden md:table-cell'
                      : ''
                  }`}
                >
                  +234 801 234 5678
                </td>
              </tr>
              <tr>
                <td className="p-4 text-gray-700">Jane Smith</td>
                {selectedTemplate ? (
                  <>
                    {selectedTemplate.levels.map((_, i) => (
                      <td
                        key={i}
                        className={`p-4 text-gray-700 ${i >= 1 ? 'hidden md:table-cell' : ''}`}
                      >
                        {i === 0 ? 'B' : i === 1 ? '5' : i === 2 ? 'Phase 2' : '2'}
                      </td>
                    ))}
                    {selectedTemplate.levels.length >= 2 && (
                      <td className="p-4 text-gray-700 md:hidden">...</td>
                    )}
                  </>
                ) : form.levelStructure === '1' ? (
                  <td className="p-4 text-gray-700">27</td>
                ) : (
                  <>
                    <td className="p-4 text-gray-700">B</td>
                    <td className="hidden p-4 text-gray-700 md:table-cell">5</td>
                    <td className="p-4 text-gray-700 md:hidden">...</td>
                  </>
                )}
                <td
                  className={`p-4 text-gray-700 ${
                    (selectedTemplate && selectedTemplate.levels.length >= 2) ||
                    (!selectedTemplate && form.levelStructure !== '1')
                      ? 'hidden md:table-cell'
                      : ''
                  }`}
                >
                  +234 802 345 6789
                </td>
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

      {/* CSV Upload — children mode (FileUpload) */}
      <FormField
        id="residents-csv"
        label="Upload CSV File"
        errorMessage={errors.residentsCsv}
        fieldState={errors.residentsCsv ? 'error' : form.residentsCsv ? 'filled' : 'default'}
        filledMessage="CSV file ready to import"
        helperText="Not sure of the format? Use the template above"
      >
        <FileUpload
          label="Upload"
          title="Residents Data (CSV)"
          description="Upload a CSV file containing your residents data. CSV only · Max 5MB"
          value={form.residentsCsv}
          onChange={(file) => updateField('residentsCsv', file)}
          accept=".csv"
        />
      </FormField>
    </motion.div>
  )
}
