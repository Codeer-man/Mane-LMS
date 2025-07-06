import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className=" flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            " size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className=" text-base font-semibold text-foreground">
        Drop your file here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          Click to upload
        </span>
      </p>
      <Button type="button" className="mt-4 cursor-pointer py-2 px-4">
        Select File
      </Button>
    </div>
  );
}

export function RenderError() {
  return (
    <div className="text-center">
      <div className=" flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30">
        <ImageIcon className=" size-6 text-destructive" />
      </div>
      <p className="text-base font-semibold mt-2">Upload faied</p>
      <p className=" text-sm text-muted-foreground mt-1">
        SomeThing went wrong
      </p>
      <Button type="button" className="mt-4">
        Retry Uploading
      </Button>
    </div>
  );
}
