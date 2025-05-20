import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';

export interface CreateGameStep1Form {
  gameId: string;
  title: string;
  description: string;
  category: string;
  deadline: Date;
}

export interface CreateGameStep1Props {
  defaultValues: CreateGameStep1Form;
  onSubmit: (data: CreateGameStep1Form) => void;
}

export function CreateGameStep1({
  defaultValues,
  onSubmit
}: CreateGameStep1Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    control
  } = useForm<CreateGameStep1Form>({
    defaultValues
  });

  const description = watch('description');
  const maxLength = 200;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 mx-auto max-w-[800px]'
    >
      <Card>
        <CardHeader>
          <CardTitle>Game Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='gameId'>Game ID</Label>
            <Input
              id='gameId'
              {...register('gameId', {
                required: 'Game ID is required',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Game ID must be numeric'
                },
                maxLength: {
                  value: 10,
                  message: 'Game ID must be 10 digits or fewer'
                }
              })}
              placeholder='Enter game ID'
            />
            {errors.gameId && (
              <p className='text-sm text-red-600 mt-1'>
                {errors.gameId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='title'>Game Name</Label>
            <Input
              id='title'
              {...register('title', {
                required: 'Game name is required',
                minLength: { value: 3, message: 'Minimum 3 characters' },
                maxLength: { value: 50, message: 'Maximum 50 characters' }
              })}
              placeholder='Enter game name'
            />
            {errors.title && (
              <p className='text-sm text-red-600 mt-1'>
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <div className='flex justify-between items-center mb-1'>
              <Label htmlFor='description'>Description</Label>
              <span
                className={`text-sm ${
                  description?.length > maxLength
                    ? 'text-red-600'
                    : description?.length > 0.9 * maxLength
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                }`}
              >
                {description?.length || 0}/{maxLength}
              </span>
            </div>
            <Textarea
              id='description'
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 10, message: 'Minimum 10 characters' },
                maxLength: { value: 200, message: 'Maximum 200 characters' }
              })}
              placeholder='Enter game description'
            />
            {errors.description && (
              <p className='text-sm text-red-600 mt-1'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='category'>Category</Label>
            <Controller
              control={control}
              name='category'
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='general'>General</SelectItem>
                    <SelectItem value='science'>Science</SelectItem>
                    <SelectItem value='history'>History</SelectItem>
                    <SelectItem value='sports'>Sports</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className='text-sm text-red-600 mt-1'>
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='deadline'>Deadline</Label>
            <Controller
              control={control}
              name='deadline'
              rules={{
                required: 'Deadline is required',
                validate: (value) =>
                  (value && value > new Date()) ||
                  'Deadline must be in the future'
              }}
              render={({ field }) => (
                <DateTimePicker value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.deadline && (
              <p className='text-sm text-red-600 mt-1'>
                {errors.deadline.message}
              </p>
            )}
          </div>

          <div className='flex justify-end'>
            <Button type='submit' disabled={Object.values(errors).length > 0}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
