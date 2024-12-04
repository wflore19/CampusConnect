import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { STORAGE_ACCESS_KEY, STORAGE_SECRET, STORAGE_ENDPOINT } from './env';

const s3Client = new S3Client({
    endpoint: STORAGE_ENDPOINT,
    region: 'nyc1',
    credentials: {
        accessKeyId: STORAGE_ACCESS_KEY,
        secretAccessKey: STORAGE_SECRET,
    },
});

/**
 * Uploads an image from Google CDN to DigitalOcean Spaces
 * @param {string} cdnUrl - The URL of the image to buffer and upload
 * @param {string} filename - The file name to save the image as
 * @returns {string} The URL of the uploaded file
 */
export async function uploadImageToSpaces(cdnUrl: string, filename: string) {
    const response = await fetch(cdnUrl);

    const buffer = await response.arrayBuffer();
    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: 'campus-connect',
            Key: filename,
            Body: Buffer.from(buffer),
            ContentType: 'image/jpeg',
            ACL: 'public-read', // Optional: Set ACL if you want the file to be publicly accessible
        },
    });

    const result = await upload.done();
    if (!result.Location) throw new Error('Failed to upload image');
    return result.Location; // Returns the URL of the uploaded file
}
