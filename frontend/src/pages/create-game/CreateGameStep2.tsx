import { SortableItem } from "@/components/misc/sortable-item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  CircleAlert,
  CircleCheckIcon,
  CircleIcon,
  GripIcon,
  PlusCircle,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface CreateGameStep2Form {
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface CreateGameStep2Props {
  defaultValues: CreateGameStep2Form;
  onSubmit: (data: CreateGameStep2Form) => void;
  handlePreviousStep: () => void;
}

export function CreateGameStep2({
  defaultValues,
  onSubmit,
  handlePreviousStep,
}: CreateGameStep2Props) {
  const [questions, setQuestions] = useState(defaultValues.questions);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null); // Track the active dragged item
  const [openAccordion, setOpenAccordion] = useState<string | null>(null); // Track the currently open accordion

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id); // Set the active dragged item
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null); // Clear the active dragged item

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(
        (q) => `question-${questions.indexOf(q)}` === active.id
      );
      const newIndex = questions.findIndex(
        (q) => `question-${questions.indexOf(q)}` === over.id
      );
      const updatedQuestions = arrayMove(questions, oldIndex, newIndex);
      setQuestions(updatedQuestions);

      if (openAccordion) {
        const previousIndex = questions.findIndex(
          (_, index) => `question-${index}` === openAccordion
        );
        const newOpenAccordion = `question-${
          arrayMove(
            questions.map((_, index) => index),
            oldIndex,
            newIndex
          )[previousIndex]
        }`;
        setOpenAccordion(newOpenAccordion);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null); // Clear the active dragged item if drag is canceled
  };

  const handleOptionDragEnd = (questionIndex: number, event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = questions[questionIndex].options.findIndex(
        (_, index) => `option-${index}` === active.id
      );
      const newIndex = questions[questionIndex].options.findIndex(
        (_, index) => `option-${index}` === over.id
      );

      const updatedQuestions = [...questions];
      const updatedOptions = arrayMove(
        updatedQuestions[questionIndex].options,
        oldIndex,
        newIndex
      );

      // Update the correctAnswer index if it matches the old index
      const correctAnswer = updatedQuestions[questionIndex].correctAnswer;
      if (correctAnswer === oldIndex) {
        updatedQuestions[questionIndex].correctAnswer = newIndex;
      } else if (correctAnswer > oldIndex && correctAnswer <= newIndex) {
        updatedQuestions[questionIndex].correctAnswer -= 1;
      } else if (correctAnswer < oldIndex && correctAnswer >= newIndex) {
        updatedQuestions[questionIndex].correctAnswer += 1;
      }

      updatedQuestions[questionIndex].options = updatedOptions;
      setQuestions(updatedQuestions);
    }
  };

  const getQuestionError = useCallback(
    (idx: number) => {
      const question = questions[idx];

      if (!question) {
        throw new Error("couldnt find question");
      }

      const hasEmptyOption = question.options.some((option) => option === "");
      if (hasEmptyOption) {
        return "Please fill in all options.";
      }

      const hasEmptyQuestion = question.question === "";
      if (hasEmptyQuestion) {
        return "Please fill in the question.";
      }

      const hasNoCorrectAnswer =
        question.correctAnswer < 0 ||
        question.correctAnswer >= question.options.length;
      if (hasNoCorrectAnswer) {
        return "Please select a correct answer.";
      }

      const hasLessThanTwoOptions = question.options.length < 2;
      if (hasLessThanTwoOptions) {
        return "Please provide at least two options.";
      }

      const hasNoOptions = question.options.length === 0;
      if (hasNoOptions) {
        return "Please provide at least one option.";
      }

      const hasNoQuestion = question.question === "";
      if (hasNoQuestion) {
        return "Please provide a question.";
      }

      return false;
    },
    [questions]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions and Answers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2">Questions</Label>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]} // Lock drag to vertical axis
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={questions.map((_, index) => `question-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              {questions.map((question, index) => {
                const hasError = getQuestionError(index);

                return (
                  <SortableItem
                    key={`question-${index}`}
                    id={`question-${index}`}
                    dragHandle={
                      <div className="cursor-grab pt-3">
                        <GripIcon />
                      </div>
                    }
                  >
                    <Accordion
                      type="single"
                      collapsible
                      value={openAccordion || ""}
                      onValueChange={(value) => setOpenAccordion(value)}
                    >
                      <AccordionItem value={`question-${index}`}>
                        <AccordionTrigger
                          className={
                            hasError ? "text-red-500 border-red-500" : ""
                          }
                        >
                          <span className={`flex items-center`}>
                            {hasError && <CircleAlert className="mr-2" />}
                            Question {index + 1}:{" "}
                            {question.question || "Untitled"}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-1">
                            {hasError && (
                              <p className="text-sm font-medium text-red-600 mb-2">
                                {hasError}
                              </p>
                            )}
                            <div>
                              <Label
                                htmlFor={`questions.${index}.question`}
                                className="mb-2"
                              >
                                Question
                              </Label>
                              <Input
                                id={`questions.${index}.question`}
                                value={question.question}
                                onChange={(e) => {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[index].question =
                                    e.target.value;
                                  setQuestions(updatedQuestions);
                                }}
                                placeholder={`Enter question ${index + 1}`}
                              />
                            </div>
                            <div className="space-y-2 mt-4">
                              <Label>Answers</Label>
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                modifiers={[restrictToVerticalAxis]} // Lock drag to vertical axis
                                onDragEnd={(event) =>
                                  handleOptionDragEnd(index, event)
                                }
                              >
                                <SortableContext
                                  items={question.options.map(
                                    (_, optionIndex) => `option-${optionIndex}`
                                  )}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <SortableItem
                                        key={`option-${optionIndex}`}
                                        id={`option-${optionIndex}`}
                                        dragHandle={
                                          <div className="cursor-grab pt-1">
                                            <GripIcon />
                                          </div>
                                        }
                                      >
                                        <div
                                          className={`flex items-center space-x-2`}
                                        >
                                          <Button
                                            variant="ghost"
                                            tabIndex={-1}
                                            onClick={() => {
                                              const updatedQuestions = [
                                                ...questions,
                                              ];
                                              updatedQuestions[
                                                index
                                              ].correctAnswer = optionIndex;
                                              setQuestions(updatedQuestions);
                                            }}
                                          >
                                            {question.correctAnswer ===
                                            optionIndex ? (
                                              <CircleCheckIcon />
                                            ) : (
                                              <CircleIcon />
                                            )}
                                          </Button>
                                          <Input
                                            value={option}
                                            onChange={(e) => {
                                              const updatedQuestions = [
                                                ...questions,
                                              ];
                                              updatedQuestions[index].options[
                                                optionIndex
                                              ] = e.target.value;
                                              setQuestions(updatedQuestions);
                                            }}
                                            placeholder={`Please enter an option`}
                                            className={`${
                                              !option ? "opacity-50" : ""
                                            } ${
                                              question.correctAnswer ===
                                              optionIndex
                                                ? "border-green-500 border-1"
                                                : ""
                                            }`}
                                          />
                                          <Button
                                            variant="destructive"
                                            tabIndex={-1}
                                            onClick={() => {
                                              const updatedQuestions = [
                                                ...questions,
                                              ];
                                              updatedQuestions[
                                                index
                                              ].options.splice(optionIndex, 1);
                                              setQuestions(updatedQuestions);
                                            }}
                                          >
                                            <X />
                                          </Button>
                                        </div>
                                      </SortableItem>
                                    )
                                  )}
                                </SortableContext>
                              </DndContext>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[index].options.push("");
                                  setQuestions(updatedQuestions);
                                }}
                              >
                                Add Option
                              </Button>
                            </div>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                const updatedQuestions = [...questions];
                                updatedQuestions.splice(index, 1);
                                setQuestions(updatedQuestions);
                              }}
                              className="mt-4"
                            >
                              Remove Question
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </SortableItem>
                );
              })}
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="p-4 border rounded shadow">
                  {questions.find(
                    (_, index) => `question-${index}` === activeId
                  )?.question || "Untitled"}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          <Button
            variant="outline"
            onClick={() =>
              setQuestions([
                ...questions,
                {
                  question: "",
                  options: ["", "", "", ""],
                  correctAnswer: 0,
                },
              ])
            }
          >
            Add Question
            <PlusCircle />
          </Button>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={handlePreviousStep}>
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              const hasErrors = questions.some((_, index) => {
                const error = getQuestionError(index);
                if (error) {
                  toast.error(`Question ${index + 1}: ${error}`);
                  return true;
                }
                return false;
              });

              if (!hasErrors) {
                toast.info("Saving game...");
                onSubmit({ questions });
              }
            }}
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
