import { Module } from '@nestjs/common';
import { DownloaderService } from './downloader.service';
import { DownloaderController } from './downloader.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../video/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  controllers: [DownloaderController],
  providers: [DownloaderService],
  exports: [DownloaderService],
})
export class DownloaderModule {}
