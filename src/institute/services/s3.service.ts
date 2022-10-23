import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Photo } from '../entities/photo.entitiy';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET: string;
  s3: AWS.S3;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.AWS_S3_BUCKET = this.configService.get<string>('AWS_S3_BUCKET');
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>("AWS_S3_ACCESS_KEY"),
      secretAccessKey: this.configService.get<string>("AWS_S3_KEY_SECRET"),
    });
  }

  async uploadFile(file: Express.Multer.File) {
    return await this.s3Upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      file.originalname,
      file.mimetype,
    );
  }

  async deleteFile(file: Photo) {
    let Key = file.key;

    return await this.s3Delete(file.key);
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

    try {
      return await this.s3.upload(params).promise();
    } catch (error) {
      throw error;
    }
  }

  async s3Delete(key: string) {
    try {
      await this.s3.deleteObject({
        Bucket: this.AWS_S3_BUCKET,
        Key: key,
      }).promise();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
