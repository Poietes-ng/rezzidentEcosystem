export type VouchingFlowStep =
  | "INTRO"
  | "DETAILS" // Step 1 of 5
  | "OTP" // Step 2 of 5
  | "FACIAL" // Step 3 of 5
  | "VOUCH_CODE" // Step 4 of 5 (Share)
  | "STATUS" // Step 4 of 5 (Status)
  | "SUCCESS" // Celebration
  | "PIN_SETUP" // Step 5 of 5
  | "COMPLETED";

export type VouchStatus = "pending" | "vouched";

export interface NeighbourVouch {
  id: string;
  name: string;
  unit: string;
  avatarUrl?: string;
  avatarPlaceholder?: boolean;
  status: VouchStatus;
}

export interface VouchingState {
  currentStep: VouchingFlowStep;
  fullName: string;
  phoneNumber: string;
  otp: string;
  otpVerified: boolean;
  facialVerificationCompleted: boolean;
  capturedPhotoUrl?: string;
  vouchCode: string;
  vouchLink: string;
  vouchCount: 0 | 1 | 2;
  neighbours: NeighbourVouch[];
  pin: string;
  confirmPin: string;
  faceIdEnabled: boolean;
  isCompleted: boolean;
}
