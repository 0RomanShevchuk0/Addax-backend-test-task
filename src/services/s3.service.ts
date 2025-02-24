import s3 from "../config/s3Client"
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3"

class S3Service {
  async uploadFile(bucketName: string, fileKey: string, file: Express.Multer.File) {
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    try {
      await s3.send(new PutObjectCommand(params))
      const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
      return fileUrl
    } catch (error) {
      console.error("Error uploading file to AWS S3")
      return null
    }
  }

  async deleteFile(bucketName: string, fileKey: string) {
    const params: DeleteObjectCommandInput = {
      Bucket: bucketName,
      Key: fileKey,
    }

    try {
      const response = await s3.send(new DeleteObjectCommand(params))
      return response
    } catch (error) {
      console.error("Error deleting file on AWS S3", error)
      throw new Error("Error deleting file on AWS S3")
    }
  }
}

export const s3Service = new S3Service()
