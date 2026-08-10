import { cn } from "../../utils/cn";

export interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  showLabel?: boolean;
}

export function StepProgress({
  currentStep,
  totalSteps,
  className,
  showLabel = true,
}: StepProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {/* Full-width progress bar */}
      <div className="relative h-[4px] w-full overflow-hidden rounded-full bg-[#E5E5E5]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-actionDark transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Label */}
      {showLabel && (
        <span className="font-dmsans text-[11px] font-medium uppercase tracking-wider text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
      )}
    </div>
  );
}
