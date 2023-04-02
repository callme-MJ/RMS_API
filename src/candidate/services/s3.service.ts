import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Photo } from '../interfaces/photo.entitiy';

@Injectable()
export class S3Service {
  s3: AWS.S3;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>("AWS_S3_ACCESS_KEY"),
      secretAccessKey: this.configService.get<string>("AWS_S3_KEY_SECRET"),
    });
  }

  public async uploadFile(file: Express.Multer.File, name: string): Promise<ManagedUpload.SendData> {
    return await this.s3Upload(
      file,
      name
    );
  }

  public async deleteFile(file: Photo): Promise<boolean> {
    if (!file || !file.key) return false;
    return await this.s3Delete(file.key);
  }

  async s3Upload(file: Express.Multer.File, name: string) {
    const params = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
      Key: name,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {

      // TODO: Resize the image before upload
      return await this.s3.upload(params).promise();
    } catch (error) {
      throw error;
    }
  }

  async s3Delete(key: string) {
    try {
      await this.s3.deleteObject({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
      }).promise();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
