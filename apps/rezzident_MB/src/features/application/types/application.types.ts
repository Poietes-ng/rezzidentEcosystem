export type {
  EstateLookupResponse as EstateLookup,
  EstateJoinPayload as JoinEstatePayload,
} from '@rezzident/shared-types'

export type JoinEstateStep = 'estate' | 'personal' | 'otp' | 'address' | 'face' | 'pin'

export interface JoinEstateFormState {
  estateId: string
  fullName: string
  phone: string
  otp: string
  street: string
  houseNumber: string
  enableFaceId: boolean
  faceCaptureUri: string | null
  pin: string
  confirmPin: string
}
