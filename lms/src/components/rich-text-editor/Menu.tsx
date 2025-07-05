import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  ListIcon,
  ListOrdered,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface MenuProps {
  editor: Editor | null;
}

const menuItems = [
  {
    name: "bold",
    icon: Bold,
    action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor: Editor) => editor.isActive("bold"),
    tooltip: "Bold",
  },
  {
    name: "italic",
    icon: Italic,
    action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor: Editor) => editor.isActive("italic"),
    tooltip: "Italic",
  },
  {
    name: "strike",
    icon: Strikethrough,
    action: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor: Editor) => editor.isActive("strike"),
    tooltip: "Strike",
  },
  {
    name: "heading1",
    icon: Heading1,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor: Editor) => editor.isActive("heading", { level: 1 }),
    tooltip: "H1",
  },
  {
    name: "heading2",
    icon: Heading2,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor: Editor) => editor.isActive("heading", { level: 2 }),
    tooltip: "H2",
  },
  {
    name: "heading3",
    icon: Heading3,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor: Editor) => editor.isActive("heading", { level: 3 }),
    tooltip: "H3",
  },
  {
    name: "bulletList",
    icon: ListIcon,
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor: Editor) => editor.isActive("bulletList"),
    tooltip: "Bullet List",
  },
  {
    name: "orderedList",
    icon: ListOrdered,
    action: (editor: Editor) =>
      editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor: Editor) => editor.isActive("orderedList"),
    tooltip: "ordered List",
  },
];

const textAlign = [
  {
    name: "align-left",
    icon: AlignLeft,
    action: (editor: Editor) =>
      editor.chain().focus().setTextAlign("left").run(),
    isActive: (editor: Editor) => editor.isActive({ textAlign: "left" }),
    tooltip: "Align Left",
  },
  {
    name: "align-center",
    icon: AlignCenter,
    action: (editor: Editor) =>
      editor.chain().focus().setTextAlign("center").run(),
    isActive: (editor: Editor) => editor.isActive({ textAlign: "center" }),
    tooltip: "Align Center",
  },
  {
    name: "align-right",
    icon: AlignRight,
    action: (editor: Editor) =>
      editor.chain().focus().setTextAlign("right").run(),
    isActive: (editor: Editor) => editor.isActive({ textAlign: "right" }),
    tooltip: "Align Right",
  },
];

const cmd = [
  {
    name: "undo",
    icon: Undo2,
    action: (editor: Editor) => editor.chain().focus().undo().run(),
    tooltip: "undo",
    disable: (editor: Editor) => editor.can().undo(),
  },
  {
    name: "redo",
    icon: Redo2,
    action: (editor: Editor) => editor.chain().focus().redo().run(),
    tooltip: "redo",
    disable: (editor: Editor) => editor.can().redo(),
  },
];

export default function MenuBar({ editor }: MenuProps) {
  if (!editor) return null;

  return (
    <div className=" border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {menuItems.map(({ name, icon: Icon, action, isActive, tooltip }) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={isActive(editor)}
                  onPressedChange={() => action(editor)}
                  className={cn(
                    isActive(editor) && "bg-muted text-muted-foreground ",
                    "cursor-pointer"
                  )}
                >
                  <Icon />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="w-px h-6 bg-border mx-2" />
        <div className=" flex flex-wrap gap-1">
          {textAlign.map(({ name, icon: Icon, action, isActive, tooltip }) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={isActive(editor)}
                  onPressedChange={() => action(editor)}
                  className={cn(
                    isActive(editor) && "bg-muted text-muted-foreground",
                    "cursor-pointer"
                  )}
                >
                  <Icon />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>{tooltip} </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className=" w-px h-6 bg-border mx-2" />
        <div className=" flex flex-wrap g-2">
          {cmd.map(({ name, icon: Icon, action, tooltip, disable }) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <Button
                  className=" cursor-pointer"
                  size={"sm"}
                  variant={"ghost"}
                  onClick={() => action(editor)}
                  type="button"
                  disabled={!disable(editor)}
                >
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}

//* format for refrence without map
{
  /* <Tooltip>
  <TooltipTrigger asChild>
    <Toggle
      size={"sm"}
      pressed={editor.isActive("bulletList")}
      onPressedChange={() => editor.chain().focus().toggleBulletList.run()}
      className={cn(
        editor.isActive("bulletList") && "bg-muted text-muted-foreground"
      )}
    >
      <ListIcon />
    </Toggle>
  </TooltipTrigger>
  <TooltipContent>Bulleting</TooltipContent>
</Tooltip>; */
}
