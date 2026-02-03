"use client";

import {
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { QuizResult } from "@/actions/student-courses";
import { submitChapterQuiz } from "@/actions/student-courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type QuizQuestion = {
  id: string;
  questionText: string;
  points: number;
  options: Array<{ id: string; optionText: string }>;
};

type QuizFormProps = {
  chapterId: string;
  questions: QuizQuestion[];
};

// ============================================================================
// Quiz Results Card
// ============================================================================

function QuizResultsCard({
  results,
  score,
  totalPoints,
  passed,
  percentage,
  onRetry,
}: {
  results: QuizResult[];
  score: number;
  totalPoints: number;
  passed: boolean;
  percentage: number;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card
        className={cn(
          passed
            ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
            : "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20",
        )}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full mb-4",
                passed
                  ? "bg-green-100 dark:bg-green-900/50"
                  : "bg-amber-100 dark:bg-amber-900/50",
              )}
            >
              {passed ? (
                <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
              ) : (
                <RefreshCw className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {passed ? "Quiz Passed!" : "Keep Learning!"}
            </h3>
            <p className="text-muted-foreground mb-4">
              You scored <span className="font-semibold">{score}</span> out of{" "}
              <span className="font-semibold">{totalPoints}</span> points (
              {percentage}%)
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mb-4">
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    passed ? "bg-green-500" : "bg-amber-500",
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {passed ? "70% required to pass" : "You need 70% to pass"}
              </p>
            </div>

            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Question Review
        </h4>

        {results.map((result, index) => (
          <Card
            key={result.questionId}
            className={cn(
              "overflow-hidden p-0",
              result.isCorrect
                ? "border-green-200 dark:border-green-900"
                : "border-red-200 dark:border-red-900",
            )}
          >
            <CardHeader
              className={cn(
                "px-6 py-3",
                result.isCorrect
                  ? "bg-green-50 dark:bg-green-950/30"
                  : "bg-red-50 dark:bg-red-950/30",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    result.isCorrect
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium leading-relaxed">
                    {result.questionText}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={result.isCorrect ? "secondary" : "destructive"}
                      className={cn(
                        "text-xs",
                        result.isCorrect &&
                          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                      )}
                    >
                      {result.isCorrect ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Correct
                        </>
                      ) : (
                        <>
                          <X className="mr-1 h-3 w-3" />
                          Incorrect
                        </>
                      )}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {result.isCorrect ? result.points : 0} / {result.points}{" "}
                      pts
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pt-4 pb-6 space-y-3">
              {/* Your Answer */}
              {result.selectedOptionText && (
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      "shrink-0 mt-0.5",
                      result.isCorrect ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Your answer:
                    </span>
                    <p
                      className={cn(
                        "text-sm",
                        result.isCorrect
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-700 dark:text-red-400 line-through",
                      )}
                    >
                      {result.selectedOptionText}
                    </p>
                  </div>
                </div>
              )}

              {/* Correct Answer (if wrong) */}
              {!result.isCorrect && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Correct answer:
                    </span>
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                      {result.correctOptionText}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Quiz Question Card (Taking Quiz)
// ============================================================================

function QuizQuestionCard({
  question,
  index,
  selectedOptionId,
  onSelect,
}: {
  question: QuizQuestion;
  index: number;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
            {index + 1}
          </div>
          <div className="flex-1">
            <CardTitle className="text-base font-medium leading-relaxed">
              {question.questionText}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {question.points} point{question.points !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-muted/50",
              selectedOptionId === option.id &&
                "border-primary bg-primary/5 ring-1 ring-primary",
            )}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => onSelect(option.id)}
              className="sr-only"
              required
            />
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                selectedOptionId === option.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30",
              )}
            >
              {selectedOptionId === option.id && <Check className="h-3 w-3" />}
            </div>
            <span className="text-sm">{option.optionText}</span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Quiz Form Component
// ============================================================================

export function ChapterQuizForm({ chapterId, questions }: QuizFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitChapterQuiz,
    null,
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResults, setShowResults] = useState(false);

  // When we get successful results, show them
  useEffect(() => {
    if (state?.success && state.results) {
      setShowResults(true);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  const handleRetry = () => {
    setShowResults(false);
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = questions.length;
  const allAnswered = answeredCount === totalQuestions;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  // Show results view
  if (showResults && state?.results) {
    return (
      <QuizResultsCard
        results={state.results}
        score={state.score ?? 0}
        totalPoints={state.totalPoints ?? 0}
        passed={state.passed ?? false}
        percentage={state.percentage ?? 0}
        onRetry={handleRetry}
      />
    );
  }

  // Show quiz form
  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="chapterId" value={chapterId} />

      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {answeredCount} of {totalQuestions} questions answered
        </span>
        <Badge variant="outline">{totalPoints} total points</Badge>
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuizQuestionCard
            key={question.id}
            question={question}
            index={index}
            selectedOptionId={selectedAnswers[question.id] ?? null}
            onSelect={(optionId) =>
              setSelectedAnswers((prev) => ({
                ...prev,
                [question.id]: optionId,
              }))
            }
          />
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          {!allAnswered && `Answer all questions to submit`}
        </p>
        <Button type="submit" disabled={isPending || !allAnswered} size="lg">
          {isPending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Quiz
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
