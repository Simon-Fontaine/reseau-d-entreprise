"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/actions/tutor-courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  courseLevelSchema,
  coursePublishStatusSchema,
} from "@/validations/course";

const courseLevels = courseLevelSchema.options;
const publishStatuses = coursePublishStatusSchema.options;

type CourseFormProps = {
  title: string;
  action: (
    prevState: ActionState | null,
    formData: FormData,
  ) => Promise<ActionState>;
  themes: Array<{ id: string; name: string }>;
  defaultValues?: {
    courseId?: string;
    title?: string;
    description?: string | null;
    minLevel?: string;
    maxLevel?: string;
    themeId?: string | null;
    estimatedDuration?: number | null;
    emoji?: string | null;
    imageUrl?: string | null;
    publishStatus?: string;
  };
  submitLabel: string;
};

export function TutorCourseForm({
  title,
  action,
  themes,
  defaultValues,
  submitLabel,
}: CourseFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  const formKey = useMemo(
    () =>
      JSON.stringify({
        courseId: defaultValues?.courseId ?? "",
        title: defaultValues?.title ?? "",
        description: defaultValues?.description ?? "",
        minLevel: defaultValues?.minLevel ?? courseLevels[0],
        maxLevel: defaultValues?.maxLevel ?? courseLevels[1],
        themeId: defaultValues?.themeId ?? "",
        estimatedDuration: defaultValues?.estimatedDuration ?? "",
        emoji: defaultValues?.emoji ?? "",
        imageUrl: defaultValues?.imageUrl ?? "",
        publishStatus: defaultValues?.publishStatus ?? "draft",
      }),
    [defaultValues],
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          key={formKey}
          ref={formRef}
          action={formAction}
          className="space-y-4"
        >
          {defaultValues?.courseId && (
            <input
              type="hidden"
              name="courseId"
              value={defaultValues.courseId}
            />
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Course title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={defaultValues?.title ?? ""}
                required
              />
              {state?.errors?.title && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.title.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={defaultValues?.description ?? ""}
              />
              {state?.errors?.description && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.description.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="minLevel">Minimum level</Label>
              <select
                id="minLevel"
                name="minLevel"
                defaultValue={defaultValues?.minLevel ?? courseLevels[0]}
                className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] w-full"
              >
                {courseLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {state?.errors?.minLevel && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.minLevel.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLevel">Maximum level</Label>
              <select
                id="maxLevel"
                name="maxLevel"
                defaultValue={defaultValues?.maxLevel ?? courseLevels[1]}
                className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] w-full"
              >
                {courseLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {state?.errors?.maxLevel && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.maxLevel.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="themeId">Theme</Label>
              <select
                id="themeId"
                name="themeId"
                defaultValue={defaultValues?.themeId ?? ""}
                className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] w-full"
              >
                <option value="">No theme</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
              {state?.errors?.themeId && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.themeId.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">
                Estimated duration (minutes)
              </Label>
              <Input
                id="estimatedDuration"
                name="estimatedDuration"
                type="number"
                min={0}
                defaultValue={defaultValues?.estimatedDuration ?? ""}
              />
              {state?.errors?.estimatedDuration && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.estimatedDuration.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                name="emoji"
                defaultValue={defaultValues?.emoji ?? ""}
              />
              {state?.errors?.emoji && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.emoji.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={defaultValues?.imageUrl ?? ""}
              />
              {state?.errors?.imageUrl && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.imageUrl.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishStatus">Publish status</Label>
              <select
                id="publishStatus"
                name="publishStatus"
                defaultValue={defaultValues?.publishStatus ?? "draft"}
                className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] w-full"
              >
                {publishStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {state?.errors?.publishStatus && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {state.errors.publishStatus.join(", ")}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
