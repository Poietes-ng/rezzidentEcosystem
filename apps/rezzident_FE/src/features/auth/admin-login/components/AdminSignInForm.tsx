import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'

export function AdminLogin() {
  const navigate = useNavigate()
  const [estateId, setEstateId] = useState('')
  const [password, setPassword] = useState('')

  const handleBack = () => {
    navigate({ to: '/' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implement admin sign-in API call
    void estateId
    void password
  }

  return (
    <div className="flex w-full flex-col">
      {/* Go Back */}
      <button
        onClick={handleBack}
        className="md:mb-web-lg font-dmsans text-web-sm font-web-medium text-actionDark mt-3 mb-2 inline-flex items-center gap-1 self-start hover:opacity-70 md:mt-0"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        Go Back
      </button>

      {/* Header */}
      <div className="mb-web-lg">
        <h1 className="font-cabinet text-web-h3 font-web-bold text-actionDark mb-2">
          Sign In to Your Account
        </h1>
        <p className="font-dmsans text-web-sm text-gray-500">
          Enter your credentials to access your estate dashboard and manage your community on
          Rezzident.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="gap-web-md flex flex-col">
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Estate ID</label>
          <Input
            value={estateId}
            onChange={(e) => setEstateId(e.target.value)}
            placeholder="e.g. RSZ-2024-ABCD"
          />
        </div>

        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <Button
            type="submit"
            className="h-[52px] w-full text-[14px]"
            disabled={!estateId || !password}
          >
            Sign in
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="h-[52px] w-full text-[14px]"
            onClick={() => navigate({ to: '/registration-criteria' })}
          >
            I don't have an account
          </Button>
        </div>
      </form>
    </div>
  )
}
