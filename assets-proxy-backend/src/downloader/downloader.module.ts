import { Module } from '@nestjs/common';
import { DownloaderService } from './downloader.service';
import { DownloaderController } from './downloader.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../video/video.entity';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), S3Module],
  controllers: [DownloaderController],
  providers: [DownloaderService],
  exports: [DownloaderService],
})
export class DownloaderModule {}
