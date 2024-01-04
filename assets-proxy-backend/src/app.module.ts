import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './status/status.module';
import { VideoModule } from './video/video.module';
import { dataSourceOptions } from '../db/dataSource';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloaderModule } from './downloader/downloader.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    StatusModule,
    VideoModule,
    S3Module,
    DownloaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
