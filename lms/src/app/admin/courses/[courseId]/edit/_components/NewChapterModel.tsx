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
import { CreateChapterSchema, createChapterType } from "@/lib/zodschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createChapter } from "./action";
import { toast } from "sonner";

export default function NewChapterModel({
  courseId,
}: {
  courseId: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pending, startTransistion] = useTransition();

  const form = useForm<createChapterType>({
    resolver: zodResolver(CreateChapterSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
    },
  });

  async function onSubmit(values: createChapterType) {
    startTransistion(async () => {
      try {
        const data = await createChapter(values);
        console.log(data, "data");

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
        <Button size={"sm"} variant={"outline"}>
          <Plus /> New Chapter
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
