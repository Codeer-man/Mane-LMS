"use client";
import { FileRejection, useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { useCallback, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidV4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progess: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl: string;
  fileType: "image" | "video";
}

export function Uploader() {
  const [filestate, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progess: 0,
    isDeleting: false,
    error: false,
    objectUrl: "",
    fileType: "image",
  });

  function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progess: 0,
    }));

    try {
        
    } catch (error) {
        
    }
  }

  const onDrop = useCallback((acceptedFile: File[]) => {
    if (acceptedFile.length > 0) {
      const file = acceptedFile[0];

      setFileState({
        file: file,
        uploading: false,
        progess: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidV4(),
        isDeleting: false,
        fileType: "image",
      });
    }

    console.log(acceptedFile);
  }, []);

  function rejectedFile(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFile = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      const fileSizeTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (tooManyFile) {
        toast.error("Too many files selected max is 1");
      }

      if (fileSizeTooBig) {
        toast.error("File excledues 5 mb limit");
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "images/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5 mb
    onDropRejected: rejectedFile,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? " border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className=" flex items-center justify-center h-full w-full">
        <Input {...getInputProps()} />
        <RenderState isDragActive={isDragActive} />
        {/* <RenderError /> */}
      </CardContent>
    </Card>
  );
}
