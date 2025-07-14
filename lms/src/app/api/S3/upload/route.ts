import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import z from "zod";
import { s3 } from "@/lib/s3-client";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
import AdminRequire from "@/app/data/admin/require-admin";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "file name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "size is required" }),
  isImage: z.boolean(),
});

export async function POST(req: Request) {
  await AdminRequire();
  try {
    const body = await req.json();

    const validate = fileUploadSchema.safeParse(body);

    if (!validate.success) {
      return NextResponse.json(
        { error: "Invalid credentilas of image" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validate.data;
    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_IMAGE_NAME,
      ContentLength: size,
      ContentType: contentType,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 360, // 6 min
    });

    const response = {
      presignedUrl,
      Key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: "failed to generate presigned url", error },
      { status: 500 }
    );
  }
}
