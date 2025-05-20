import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";

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
  onSubmit,
}: CreateGameStep1Props) {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    watch,
    control,
  } = useForm<CreateGameStep1Form>({
    defaultValues,
  });

  const description = watch("description");
  const maxLength = 200;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mx-auto max-w-[800px]"
    >
      <Card>
        <CardHeader>
          <CardTitle>Game Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gameId" className="mb-2">
              Game ID
            </Label>
            <Input
              id="gameId"
              {...register("gameId", {
                required: "Game ID is required",
                min: {
                  value: 0,
                  message: "Game ID must be a positive number",
                },
                max: {
                  value: 4_294_967_295,
                  message:
                    "Game ID must be less than or equal to 4,294,967,295",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Game ID must be a numeric string",
                },
              })}
              placeholder="Enter game ID"
            />
            {errors.gameId && (
              <p className="text-sm font-medium text-red-600 mt-1">
                {errors.gameId.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="title" className="mb-2">
              Game Name
            </Label>
            <Input
              id="title"
              {...register("title", {
                required: "Game name is required",
                maxLength: {
                  value: 50,
                  message: "Game name cannot exceed 50 characters",
                },
                minLength: {
                  value: 3,
                  message: "Game name must be at least 3 characters long",
                },
              })}
              placeholder="Enter game name"
            />
            {errors.title && (
              <p className="text-sm font-medium text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="mb-2"
            >
              <Label htmlFor="description">Description</Label>
              <span
                className={`text-sm ${
                  description?.length > maxLength
                    ? "text-sm font-medium text-red-600 mt-1"
                    : description?.length > 0.9 * maxLength
                      ? "text-yellow-500"
                      : "text-gray-400"
                }`}
              >
                {description?.length || 0}/{maxLength}
              </span>
            </div>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 200,
                  message: "Description cannot exceed 200 characters",
                },
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters long",
                },
              })}
              placeholder="Enter game description"
            />
            {errors.description && (
              <p className="text-sm font-medium text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category" className="mb-2">
              Category
            </Label>
            <Select
              defaultValue={defaultValues.category}
              onValueChange={(value) =>
                setValue("category", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              {...register("category", {
                required: "Category is required",
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm font-medium text-red-600 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="deadline" className="mb-2">
              Deadline
            </Label>
            <Controller
              control={control}
              name="deadline"
              rules={{
                required: "Deadline is required",
                validate: (value) =>
                  value && value > new Date()
                    ? true
                    : "Deadline must be in the future",
              }}
              render={({ field }) => (
                <DateTimePicker value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.deadline && (
              <p className="text-sm font-medium text-red-600 mt-1">
                {errors.deadline.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className=""
              disabled={Object.values(errors).length > 0}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
