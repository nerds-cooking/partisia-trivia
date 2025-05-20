import { Game } from "@/components/providers/game/useGame";

export interface AnswersSummaryProps {
  game: Game;
  answers: number[];
}

export function AnswersSummary({ game, answers }: AnswersSummaryProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="space-y-3">
        {game.questions.map((question, index) => (
          <div
            key={index}
            className="rounded-lg border p-4 shadow-sm bg-white dark:bg-muted"
          >
            <p className="text-sm text-muted-foreground mb-1">
              Question {index + 1}
            </p>
            <p className="font-medium">{question.question}</p>
            <div className="mt-2">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                {question.answers[answers[index]]?.answer ?? "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
