"use client";
import { FileRejection, useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { useCallback, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderError,
  RenderState,
  RenderSuccess,
  RenderUploading,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidV4 } from "uuid";
import UseImgConstructUrl from "@/hooks/img-construct";

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

interface IAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function Uploader({ onChange, value }: IAppProps) {
  const fileUrl = UseImgConstructUrl(value || "");
  const [filestate, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progess: 0,
    isDeleting: false,
    error: false,
    objectUrl: fileUrl,
    fileType: "image",
    key: value,
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progess: 0,
    }));

    try {
      const presignedResponse = await fetch("/api/S3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to generate presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progess: 0,
          error: true,
        }));
        return;
      }
      console.log(presignedResponse, "preseign url");

      const { presignedUrl, Key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentageCom = (e.loaded / e.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progess: Math.round(percentageCom),
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progess: 100,
              key: Key,
            }));
            onChange?.(Key);
            toast.success("File uploaded");
            resolve();
          } else {
            reject(new Error("Upload failed..."));
          }
        };
        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("ContentType", file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.error(error);
      toast.error("Invalid server error");
      setFileState((prev) => ({
        ...prev,
        progess: 0,
        uploading: false,
        error: true,
      }));
    }
  }

  const onDrop = useCallback(
    (acceptedFile: File[]) => {
      if (acceptedFile.length > 0) {
        const file = acceptedFile[0];

        if (filestate.objectUrl && !filestate.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(filestate.objectUrl);
        }

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
        uploadFile(file);
      }
    },
    [filestate.objectUrl]
  );

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

  function RenderContent() {
    console.log(filestate);

    if (filestate.error) {
      return <RenderError />;
    }

    if (filestate.uploading) {
      return (
        <RenderUploading
          progess={filestate.progess}
          file={filestate.file as File}
        />
      );
    }

    if (filestate.objectUrl) {
      return (
        <RenderSuccess
          handleDeletingFile={handleRemoveImage}
          isDeleting={filestate.isDeleting}
          previewUrl={filestate.objectUrl}
        />
      );
    }

    return <RenderState isDragActive={isDragActive} />;
  }

  // useEffect(() => {
  //   if (filestate.objectUrl && !filestate.objectUrl.startsWith("https")) {
  //     URL.revokeObjectURL(filestate.objectUrl);
  //   }
  // }, [filestate.objectUrl]);

  async function handleRemoveImage() {
    if (filestate.isDeleting || !filestate.objectUrl) {
      return;
    }
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/S3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: filestate.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to delete the image");

        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: false,
        }));
        return;
      }

      if (filestate.objectUrl && filestate.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(filestate.objectUrl);
      }
      onChange?.("");
      setFileState({
        id: null,
        file: null,
        uploading: false,
        progess: 0,
        isDeleting: false,
        error: false,
        objectUrl: "",
        fileType: "image",
      });

      toast.success("File removed successfully");
    } catch (error) {
      toast.error("Error removing file please try again");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
      console.error(error);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5 mb
    onDropRejected: rejectedFile,
    disabled: filestate.uploading || !!filestate.objectUrl,
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
        {RenderContent()}
      </CardContent>
    </Card>
  );
}
