import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from './video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloaderModule } from '../downloader/downloader.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), DownloaderModule],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
