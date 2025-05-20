import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateGameStep1Form } from './CreateGameStep1';
import { CreateGameStep2Form } from './CreateGameStep2';

interface ConfirmGameStepProps {
  values: CreateGameStep1Form & CreateGameStep2Form;
  onConfirm: () => void;
  onBack: () => void;
}

export function ConfirmGameStep({
  values,
  onConfirm,
  onBack
}: ConfirmGameStepProps) {
  return (
    <Card className='space-y-6'>
      <CardHeader>
        <CardTitle>Confirm Game Details</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <div>
            <strong>Game ID:</strong> {values.gameId}
          </div>
          <div>
            <strong>Title:</strong> {values.title}
          </div>
          <div>
            <strong>Description:</strong> {values.description}
          </div>
          <div>
            <strong>Category:</strong> {values.category}
          </div>
          <div>
            <strong>Deadline:</strong> {values.deadline.toLocaleString()}
          </div>
        </div>

        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Questions Summary</h2>
          <div className='space-y-3'>
            {values.questions.map((q, index) => (
              <div
                key={index}
                className='rounded-lg border p-4 shadow-sm bg-white dark:bg-muted'
              >
                <p className='text-sm text-muted-foreground mb-1'>
                  Question {index + 1}
                </p>
                <p className='font-medium mb-2'>{q.question}</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2'>
                  {q.options.map((opt, i) => (
                    <span
                      key={i}
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-center ${
                        i === q.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {opt || '—'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-between pt-4'>
          <Button type='button' variant='ghost' onClick={onBack}>
            Back
          </Button>
          <Button onClick={onConfirm}>Confirm & Create Game</Button>
        </div>
      </CardContent>
    </Card>
  );
}
