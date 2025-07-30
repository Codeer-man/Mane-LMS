import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createLessonValidation } from "@/lib/zodschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createLesson } from "./action";
import { toast } from "sonner";
import { lessonCreationType } from "@/lib/zodschema";

export default function NewLessonCreation({
  courseId,
  chapterId,
}: {
  courseId: string | undefined;
  chapterId: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pending, startTransistion] = useTransition();

  const form = useForm<lessonCreationType>({
    resolver: zodResolver(createLessonValidation),
    defaultValues: {
      name: "",
      courseId: courseId,
      chapterId: chapterId,
    },
  });

  async function onSubmit(values: lessonCreationType) {
    startTransistion(async () => {
      try {
        const data = await createLesson(values);

        if (!data) {
          return;
        }

        if (data.status === "error") {
          toast.error(data?.message as string);
          return;
        }

        if (data.status === "success") {
          toast.success("New Chapter has been added");
          setIsOpen(false);
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong Please try again");
      }
    });
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className=" gap-1 w-full justify-center cursor-pointer">
          <Plus /> New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new chapter</DialogTitle>
          <DialogDescription>
            What would you like to name your chapter
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className=" space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chapter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={pending} type="submit">
                {pending ? "Saving changes" : "Save change"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
