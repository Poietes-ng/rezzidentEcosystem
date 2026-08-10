import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "./button";

export type PollOption = {
  id: string;
  text: string;
  votes: number;
  isWinner?: boolean;
};

export type PollsCardProps = {
  question: string;
  options: PollOption[];
  totalVotes: number;
  timeLeft: string;
  state: "unvoted" | "selected" | "voted" | "closed";
  selectedOptionId?: string;
  userVotedOptionId?: string;
  onSelectOption?: (id: string) => void;
  onVote?: () => void;
  className?: string;
  isPositionPoll?: boolean;
  positionTitle?: string;
  renderAvatar?: (optionId: string) => React.ReactNode;
  optionSubtext?: (optionId: string) => React.ReactNode;
};

export function PollsCard({
  question,
  options,
  totalVotes,
  timeLeft,
  state,
  selectedOptionId,
  userVotedOptionId,
  onSelectOption,
  onVote,
  className,
  isPositionPoll,
  positionTitle,
  renderAvatar,
  optionSubtext,
}: PollsCardProps) {
  const isClosed = state === "closed";
  const hasVoted = state === "voted" || state === "closed";

  return (
    <div
      className={cn(
        "flex flex-col rounded-[24px] border border-black/5 bg-white p-[20px] shadow-sm",
        isClosed && "bg-[#F5F4F0] opacity-80",
        className
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-[24px]">
          {isPositionPoll ? "how_to_vote" : "bar_chart"}
        </span>
        <div className="flex flex-col">
          {isPositionPoll && positionTitle && (
            <span className="text-caption text-gray-500">{positionTitle}</span>
          )}
          <h3 className="text-body-base font-semibold">{question}</h3>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isUserVoted = userVotedOptionId === option.id;
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

          return (
            <button
              key={option.id}
              onClick={() => !hasVoted && onSelectOption?.(option.id)}
              disabled={hasVoted}
              className={cn(
                "relative flex items-center gap-3 rounded-[12px] border px-[16px] py-[12px] text-left transition-all",
                !hasVoted && "hover:border-actionYellow",
                isSelected && !hasVoted && "border-actionYellow bg-actionYellow/10",
                hasVoted && "cursor-default border-transparent bg-gray-50",
                !isSelected && !hasVoted && "border-black/10 bg-white"
              )}
            >
              {renderAvatar && (
                <div className="shrink-0">{renderAvatar(option.id)}</div>
              )}

              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-body-small font-medium">{option.text}</span>
                  {hasVoted && (
                    <span className={cn(
                      "text-caption font-semibold",
                      option.isWinner ? "text-actionDark" : "text-gray-400"
                    )}>
                      {percentage}%
                    </span>
                  )}
                </div>
                {optionSubtext && (
                  <span className="text-caption text-gray-400">
                    {optionSubtext(option.id)}
                  </span>
                )}
                {hasVoted && (
                  <div className="mt-1 h-[4px] w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        option.isWinner ? "bg-actionYellow" : "bg-gray-300"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>

              {!hasVoted && (
                <div className={cn(
                  "flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border-2",
                  isSelected ? "border-actionYellow bg-actionYellow" : "border-gray-300"
                )}>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[14px] text-white">check</span>
                  )}
                </div>
              )}

              {hasVoted && isUserVoted && (
                <span className="material-symbols-outlined text-[18px] text-actionYellow">check_circle</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-caption text-gray-400">
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""} · {timeLeft}
        </span>
        {state === "selected" && (
          <Button variant="default" onClick={onVote} className="h-[40px] px-6 text-body-small">
            Vote
          </Button>
        )}
      </div>
    </div>
  );
}
