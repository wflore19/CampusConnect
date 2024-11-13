import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const { STORAGE_ACCESS_KEY, STORAGE_SECRET, STORAGE_ENDPOINT } = process.env;

if (!STORAGE_ENDPOINT || !STORAGE_ACCESS_KEY || !STORAGE_SECRET) {
    throw new Error('Storage configuration is missing required values');
}

export const s3Client = new S3Client({
    endpoint: STORAGE_ENDPOINT,
    region: 'nyc1',
    credentials: {
        accessKeyId: STORAGE_ACCESS_KEY,
        secretAccessKey: STORAGE_SECRET,
    },
});

/**
 * Uploads an image from Google CDN to DigitalOcean Spaces
 * @param {string} cdnUrl - The URL of the image to upload
 * @param {string} filename - The name of the file to save the image as
 * @returns {string} The URL of the uploaded file
 */
export async function uploadImageFromCDN(cdnUrl: string, filename: string) {
    const response = await fetch(cdnUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

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

    try {
        const result = await upload.done();
        return result.Location; // Returns the URL of the uploaded file
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
