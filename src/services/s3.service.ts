import s3 from "../config/s3Client"
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3"

class S3Service {
  async uploadFile(bucketName: string, fileKey: string, file: Express.Multer.File) {
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    }

    try {
      await s3.send(new PutObjectCommand(params))
      const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
      return fileUrl
    } catch (error) {
      console.error("Error uploading file to AWS S3", error)
      return null
    }
  }
}

export const s3Service = new S3Service()
