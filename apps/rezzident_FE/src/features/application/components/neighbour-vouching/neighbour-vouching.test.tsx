// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { IntroStep } from "./IntroStep";
import { PersonalDetailsStep } from "./PersonalDetailsStep";
import { OtpVerificationStep, MOCK_VALID_OTP } from "./OtpVerificationStep";
import { PinSetupStep } from "./PinSetupStep";
import { VouchingStatusStep } from "./VouchingStatusStep";
import { CompletedStep } from "./CompletedStep";
import type { NeighbourVouch } from "./types";

describe("Neighbour Vouching Steps", () => {
  describe("IntroStep", () => {
    it("renders intro title, steps list, and calls onStart when button clicked", () => {
      const onStart = vi.fn();
      const onBack = vi.fn();
      render(<IntroStep onStart={onStart} onBack={onBack} />);

      expect(screen.getByText(/Get verified by your neighbours/i)).toBeDefined();
      const startBtn = screen.getByRole("button", { name: /Get Started/i });
      expect(startBtn).toBeDefined();

      fireEvent.click(startBtn);
      expect(onStart).toHaveBeenCalledTimes(1);
    });
  });

  describe("PersonalDetailsStep", () => {
    it("renders form inputs and validates inputs before advancing", () => {
      const onNext = vi.fn();
      const onFullNameChange = vi.fn();
      const onPhoneNumberChange = vi.fn();

      render(
        <PersonalDetailsStep
          currentStep={1}
          totalSteps={5}
          fullName=""
          phoneNumber=""
          onFullNameChange={onFullNameChange}
          onPhoneNumberChange={onPhoneNumberChange}
          onNext={onNext}
        />
      );

      expect(screen.getByText(/Your details/i)).toBeDefined();
      const continueBtn = screen.getByRole("button", { name: /Continue/i });

      // Attempt submit with empty fields
      fireEvent.click(continueBtn);
      expect(onNext).not.toHaveBeenCalled();
      expect(screen.getByText(/Please enter your full name/i)).toBeDefined();
    });

    it("triggers onNext when name and phone are valid", () => {
      const onNext = vi.fn();
      render(
        <PersonalDetailsStep
          currentStep={1}
          totalSteps={5}
          fullName="Amara Obi"
          phoneNumber="8012345678"
          onFullNameChange={() => {}}
          onPhoneNumberChange={() => {}}
          onNext={onNext}
        />
      );

      const continueBtn = screen.getByRole("button", { name: /Continue/i });
      fireEvent.click(continueBtn);
      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("OtpVerificationStep", () => {
    it("verifies with valid OTP", () => {
      const onVerify = vi.fn();
      render(
        <OtpVerificationStep
          currentStep={2}
          totalSteps={5}
          phoneNumber="8012345678"
          otp={MOCK_VALID_OTP}
          onOtpChange={() => {}}
          onVerify={onVerify}
        />
      );

      const verifyBtn = screen.getByRole("button", { name: /Verify/i });
      fireEvent.click(verifyBtn);
      expect(onVerify).toHaveBeenCalledTimes(1);
    });

    it("shows error for invalid OTP", () => {
      const onVerify = vi.fn();
      render(
        <OtpVerificationStep
          currentStep={2}
          totalSteps={5}
          phoneNumber="8012345678"
          otp="9991"
          onOtpChange={() => {}}
          onVerify={onVerify}
        />
      );

      const verifyBtn = screen.getByRole("button", { name: /Verify/i });
      fireEvent.click(verifyBtn);
      expect(onVerify).not.toHaveBeenCalled();
      expect(screen.getByText(/Incorrect code/i)).toBeDefined();
    });
  });

  describe("PinSetupStep", () => {
    it("requires matching 4-digit PINs before completion", () => {
      const onComplete = vi.fn();
      const { rerender } = render(
        <PinSetupStep
          currentStep={5}
          totalSteps={5}
          pin="1234"
          confirmPin="0000"
          faceIdEnabled={false}
          onPinChange={() => {}}
          onConfirmPinChange={() => {}}
          onFaceIdToggle={() => {}}
          onComplete={onComplete}
        />
      );

      // Submit mismatch
      const completeBtn = screen.getByRole("button", { name: /Complete Setup/i });
      fireEvent.click(completeBtn);
      expect(onComplete).not.toHaveBeenCalled();
      expect(screen.getByText(/PINs do not match/i)).toBeDefined();

      // Submit match
      rerender(
        <PinSetupStep
          currentStep={5}
          totalSteps={5}
          pin="1234"
          confirmPin="1234"
          faceIdEnabled={true}
          onPinChange={() => {}}
          onConfirmPinChange={() => {}}
          onFaceIdToggle={() => {}}
          onComplete={onComplete}
        />
      );

      const completeBtnUpdated = screen.getByRole("button", { name: /Complete Setup/i });
      fireEvent.click(completeBtnUpdated);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("VouchingStatusStep", () => {
    const mockNeighbours: NeighbourVouch[] = [
      { id: "1", name: "Amara Obi", unit: "Block C, Unit 3", status: "vouched" },
      { id: "2", name: "Chidi Eze", unit: "Block C, Unit 12", status: "vouched" },
    ];

    it("displays complete state with continue button when 2 neighbours vouched", () => {
      const onContinue = vi.fn();
      render(
        <VouchingStatusStep
          currentStep={4}
          totalSteps={5}
          vouchCount={2}
          neighbours={mockNeighbours}
          onRefresh={() => {}}
          onContinue={onContinue}
        />
      );

      expect(screen.getByText(/2 of 2 neighbours vouched/i)).toBeDefined();
      const continueBtn = screen.getByRole("button", { name: /Continue/i });
      fireEvent.click(continueBtn);
      expect(onContinue).toHaveBeenCalledTimes(1);
    });
  });

  describe("CompletedStep", () => {
    it("renders welcome message and summary card", () => {
      const onFinish = vi.fn();
      render(
        <CompletedStep
          fullName="John Doe"
          faceIdEnabled={true}
          onFinish={onFinish}
        />
      );

      expect(screen.getByText(/Welcome to Rezzident!/i)).toBeDefined();
      expect(screen.getByText(/John Doe/i)).toBeDefined();
      expect(screen.getByText(/Tier 2 Verified/i)).toBeDefined();

      const enterBtn = screen.getByRole("button", { name: /Enter Dashboard/i });
      fireEvent.click(enterBtn);
      expect(onFinish).toHaveBeenCalledTimes(1);
    });
  });
});
