import React, { useState } from 'react'
import { Button } from '../../../shared/components/ui/button'

const ISSUE_OPTIONS = [
  'Select type of issue',
  'Forgot PIN',
  'Cannot sign in',
  'Visitor code issue',
  'Payment / Billing issue',
  'App bug / crash',
  'Other',
]

export function ReportAnIssueScreen() {
  const [issueType, setIssueType] = useState('')
  const [description, setDescription] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      setError('Please provide a description of the issue')
      return
    }
    setShowSuccess(true)
    setError('')
    setDescription('')
    setIssueType('')
  }

  return (
    <div className="font-dmsans flex min-h-full w-full flex-col justify-between bg-white px-6 py-4">
      {/* ── Top Bar / Success Banner ── */}
      <div>
        {showSuccess ? (
          <div className="animate-in fade-in slide-in-from-top-2 mt-2 mb-6 flex items-center justify-center gap-2 rounded-[14px] bg-[#258750] px-4 py-3.5 text-white shadow-sm duration-200">
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span className="font-dmsans text-[14px] font-semibold">
              Report submitted successfully
            </span>
          </div>
        ) : (
          <div className="relative flex items-center justify-center pt-2 pb-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-actionDark absolute left-0 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-4xl">
                chevron_left
              </span>
            </button>
            <h2 className="font-dmsans text-actionDark text-[16px] font-semibold">
              Report an Issue
            </h2>
          </div>
        )}

        {/* ── Heading & Subtitle ── */}
        <div className="mt-2 mb-6">
          <h1 className="font-dmsans text-actionDark text-[28px] font-bold tracking-tight">
            What went wrong?
          </h1>
          <p className="font-dmsans mt-1 text-[14px] text-gray-500">
            Describe the issue and we’ll look into it.
          </p>
        </div>

        {/* ── Form Inputs ── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Type Select */}
          <div>
            <label className="font-dmsans block text-[13px] font-medium text-gray-500">
              Issue Type
            </label>
            <div className="relative mt-1 flex items-center border-b border-[#E5E5E5] pt-1 pb-2 transition-colors focus-within:border-b-2 focus-within:border-b-[#FFE022]">
              <select
                value={issueType}
                onChange={(e) => {
                  setIssueType(e.target.value)
                  if (error) setError('')
                }}
                className="font-dmsans text-actionDark w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] placeholder:text-gray-400 focus:outline-none"
              >
                <option value="" disabled hidden>
                  e.g. Can’t sign in, Forgot PIN
                </option>
                {ISSUE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 flex items-center">
                <svg
                  className="text-actionDark h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="font-dmsans block text-[13px] font-medium text-gray-500">
              Description
            </label>
            <div className="mt-1 border-b border-[#E5E5E5] pt-1 pb-2 transition-colors focus-within:border-b-2 focus-within:border-b-[#FFE022]">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Tell us more about what happened..."
                className="font-dmsans text-actionDark w-full resize-none bg-transparent text-[15px] leading-relaxed placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <div className="pt-4">
            <Button
              type="submit"
              className="bg-actionDark h-[52px] w-full rounded-[14px] text-[15px] font-medium text-white hover:bg-black"
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
