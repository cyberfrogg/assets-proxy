import { Injectable } from '@nestjs/common';
import { GetVideoDto } from './video.dto';

@Injectable()
export class VideoService {
  constructor() {}

  async getAndStoreVideo(getVideoDto: GetVideoDto) {
    return getVideoDto;
  }
}
