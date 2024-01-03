import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { GetVideoDto, GetVideoStatusDto } from './video.dto';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async get(@Query() getVideoDto: GetVideoDto) {
    return this.videoService.getAndStoreVideo(getVideoDto);
  }

  @Get('status')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getStatus(@Query() getVideoStatusDto: GetVideoStatusDto) {
    return this.videoService.getVideoStatus(getVideoStatusDto);
  }
}
