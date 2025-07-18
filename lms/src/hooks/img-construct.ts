export default function UseImgConstructUrl(key: string): string {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_IMAGE_NAME}.t3.storage.dev/${key}`;
}
