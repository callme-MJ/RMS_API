import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Photo } from '../entities/photo.entitiy';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async uploadFile(file) {
    const { originalname } = file;
    
    return await this.s3Upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
      );
    }
    async deleteFile(file:any) {
      let Key = file.key;
      console.log(Key);
      
      return await this.s3Delete(Key, this.AWS_S3_BUCKET);
    }

  async s3Upload(file, bucket, name, mimetype) {
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
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async s3Delete(Key, bucket) {
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
