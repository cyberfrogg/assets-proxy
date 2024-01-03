import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './status/status.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [StatusModule, VideoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
