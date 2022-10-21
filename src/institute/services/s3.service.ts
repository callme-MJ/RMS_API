import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async uploadFile(file) {
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }
  async deleteFile(file) {
    let Key=file.photoKey
    return await this.s3_delete(Key,this.AWS_S3_BUCKET);
  }
  // async deletePublicFile(fileId: number) {
  //     const file = await this.publicFilesRepository.findOne({ id: fileId });
  //     const s3 = new S3();
  //     await s3.deleteObject({
  //       Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
  //       Key: file.key,
  //     }).promise();
  //     await this.publicFilesRepository.delete(fileId);
  //   }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    // console.log(params);

    try {
      let s3Response = await this.s3.upload(params).promise();

      // console.log(s3Response.Location);
      return s3Response;
    } catch (e) {
      // console.log(e);
    }
  }

  async s3_delete(Key, bucket) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: Key,
    };
    try {
      let s3Response = await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.log(error);
    }
  }
}
