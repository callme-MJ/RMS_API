import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { S3Service } from 'src/candidate/services/s3.service';
import { Repository } from 'typeorm';
import { CreateNewsDTO } from './dto/create-news.dto';
import { UpdateNewsDTO } from './dto/update-media.dto';
import { News } from './entities/news.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,
    private readonly s3Service: S3Service,

  ) { }

  async create(createNewsDTO: CreateNewsDTO,photo: Express.Multer.File) {

    const newNews=  await this.newsRepo.create(createNewsDTO)
     await this.newsRepo.save(newNews)
     await this.uploadPhoto(newNews,photo)
     return newNews;
  }

  findAll() {
    return this.newsRepo.find()
  }

  findOne(id: number) {
    return this.newsRepo.findOneBy({id})
  }

  update(id: number, updateNewsDTO: UpdateNewsDTO) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return this.newsRepo.delete(id)
  }

  private async uploadPhoto(
    news:News,
    photo: Express.Multer.File,
  ): Promise<News> {
    try {
      const ext: string = photo.originalname.split('.').pop();
      const uploadedImage: ManagedUpload.SendData =
      await this.s3Service.uploadFile(
        photo,
        `news-${news.id}.${ext}`,
        );
        news.photo = {
          eTag: uploadedImage.ETag,
          key: uploadedImage.Key,
          url: uploadedImage.Location,
        };
        
        await this.newsRepo.save(news);
        console.log('uploading photo');
        return news;
    } catch (error) {
      throw error;
    }
  }
}
