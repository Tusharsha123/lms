import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = process.env.S3_ACCESS_KEY ? new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  endpoint: process.env.S3_ENDPOINT,
}) : null;

const BUCKET = process.env.S3_BUCKET || 'lms-platform';

export async function uploadFile(key, body, contentType) {
  if (!s3Client) {
    console.warn('S3 not configured, skipping upload');
    return `/uploads/${key}`;
  }
  
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  
  await s3Client.send(command);
  return `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
}

export async function getSignedDownloadUrl(key, expiresIn = 3600) {
  if (!s3Client) {
    return `/uploads/${key}`;
  }
  
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  
  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFile(key) {
  if (!s3Client) {
    return;
  }
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  
  await s3Client.send(command);
}

export function generateKey(folder, filename) {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${folder}/${timestamp}-${sanitized}`;
}
