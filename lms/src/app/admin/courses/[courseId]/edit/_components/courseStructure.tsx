"use client";

import { getSingleCourse } from "@/actions/course_create";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { reorderChapterFunction, reorderLessonFunction } from "./action";
import NewChapterModel from "./NewChapterModel";
import NewLessonCreation from "./LessonCreation";

interface iAppProps {
  data: getSingleCourse;
}

interface sortableItemsProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data: {
    type: "chapter" | "lesson";
    chapterId: string;
  };
}

export default function CourseStructure({ data }: iAppProps) {
  const initialState =
    data?.chapters.map((Chapter) => ({
      id: Chapter.id,
      title: Chapter.title,
      order: Chapter.position,
      isOpen: true,
      lessons: Chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialState);

  useEffect(() => {
    setItems((prevItem) => {
      const updateItems =
        data?.chapters.map((Chapter) => ({
          id: Chapter.id,
          title: Chapter.title,
          order: Chapter.position,
          isOpen:
            prevItem.find((item) => item.id === Chapter.id)?.isOpen ?? true,
          lessons: Chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];

      return updateItems;
    });
  }, [data]);

  function SortableItem({ children, className, id, data }: sortableItemsProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const courseId = data?.id;
    const activeId = active.id;
    const overId = over.id;
    const overType = over.data.current?.type as "chapter" | "lesson";
    const activeType = active.data.current?.type as "chapter" | "lesson";

    //   chapter dragging

    if (activeType === "chapter") {
      let targetChapter = null;

      if (overType === "chapter") {
        targetChapter = overId;
      } else if (overType === "lesson") {
        targetChapter = over.data.current?.chapterId ?? null;
      }

      if (targetChapter === null) {
        toast.error("could not determine the chapter for reorderinf");
        return;
      }

      const oldIndex = items.findIndex((items) => items.id === activeId);
      const newIndex = items.findIndex((items) => items.id === targetChapter);

      if (newIndex === -1 || oldIndex === -1) {
        toast.error("could not find the old or new chapter id");
        return;
      }

      const recodeLocalChpater = arrayMove(items, oldIndex, newIndex);

      const updateChapterStatus = recodeLocalChpater.map((chapters, index) => ({
        ...chapters,
        order: index + 1,
      }));

      const previousState = [...items];

      setItems(updateChapterStatus);

      if (courseId) {
        const chapterToUpdate = updateChapterStatus.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));

        const reorderPrommise = () =>
          reorderChapterFunction(courseId, chapterToUpdate);
        toast.promise(reorderPrommise(), {
          loading: "Reordering chapters...",
          success: (result) => {
            if (result.status === "success") return "Chapter reordered";
          },
          error: (result) => {
            setItems(previousState);
            if (result.status === "error") return "Failed to reorder chapters";
          },
        });
      }
    }
    // lesson dragging
    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error(
          "Lesson moved between two chapter or invalid chapter id  is not allowed"
        );
        return;
      }

      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );
      if (chapterIndex === -1) {
        toast.error("Could not find chapter ");
        return;
      }

      const chapterUpdate = items[chapterIndex];

      const oldLessonIndex = chapterUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );

      const newLessonIndex = chapterUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Could not find lesson for reordering");
        return;
      }

      const reOrderedLesson = arrayMove(
        chapterUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonForState = reOrderedLesson.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const NewItems = [...items];
      NewItems[chapterIndex] = {
        ...chapterUpdate,
        lessons: updatedLessonForState,
      };

      const oldItems = [...items];
      setItems(NewItems);

      if (courseId) {
        const lessToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        const reorderLessonPromise = () =>
          reorderLessonFunction(chapterId, lessToUpdate, courseId);
        toast.promise(reorderLessonPromise(), {
          loading: "Reordering lessons...",
          success: (result) => {
            if (result.status === "success") return result.message as string;
          },
          error: (result) => {
            setItems(oldItems);
            if (result.status === "error")
              return result.message || "failed to reorder lessons";
          },
        });
      }
      return;
    }
  }
  console.log(items, "items");
  // track the movement
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className=" flex flex-row items-center justify-between border-b border-border">
          <CardTitle className="">Chapter</CardTitle>
          <NewChapterModel courseId={data?.id} />
        </CardHeader>
        <CardContent className=" space-y-6">
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((items) => (
              <SortableItem
                id={items.id}
                data={{ type: "chapter", chapterId: "" }}
                key={items.id}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={items.isOpen}
                      onOpenChange={() => toggleChapter(items.id)}
                    >
                      <div className=" flex items-center justify-between border border-border border-b p-3">
                        <div className=" flex  items-center gap-2">
                          <Button size="icon" variant="ghost" {...listeners}>
                            <GripVertical className=" size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button size="icon" variant="ghost">
                              {items.isOpen ? (
                                <ChevronDown className=" size-4" />
                              ) : (
                                <ChevronRight className=" size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p>{items.title} </p>
                        </div>
                        <Button size={"icon"} variant={"outline"}>
                          <Trash2 className=" size-4" />
                        </Button>
                      </div>
                      <CollapsibleContent>
                        <div className=" p-1">
                          <SortableContext
                            items={items.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {items.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: items.id }}
                              >
                                {(lessonListenera) => (
                                  <div className=" flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className=" flex items-center gap-2">
                                      <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        {...lessonListenera}
                                      >
                                        {" "}
                                        <GripVertical className=" size-4" />
                                      </Button>
                                      <FileText className=" size-4" />
                                      <Link
                                        href={`/admin/courses/${data?.id}/${items.id}/${lesson.id}`}
                                      >
                                        {lesson.title}{" "}
                                      </Link>
                                    </div>
                                    <Button variant={"outline"} size={"icon"}>
                                      <Trash2 className=" size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className=" p-2 ">
                            <NewLessonCreation
                              chapterId={items.id}
                              courseId={data?.id}
                            />
                            {/* <Button variant={"outline"} className=" w-full">
                              Create a New Lesson
                            </Button> */}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
