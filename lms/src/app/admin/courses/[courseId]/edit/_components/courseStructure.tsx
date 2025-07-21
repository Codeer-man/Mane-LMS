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
import React, { useState } from "react";

interface iAppProps {
  data: getSingleCourse;
}

interface sortableItemsProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
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

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

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
        </CardHeader>
        <CardContent>
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
                            <Button variant={"outline"} className=" w-full">
                              Create a New Lesson
                            </Button>
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
