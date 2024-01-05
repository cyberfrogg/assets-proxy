import { Injectable } from '@nestjs/common';
import { VideoService } from '../video/video.service';

@Injectable()
export class StatusService {
  constructor(private readonly videoService: VideoService) {}

  async componentStatuses() {
    return 'OK';
  }

  async ping() {
    return 'OK';
  }

  async dynamicStatus() {
    const pendingVideosCount =
      await this.videoService.getVideosCountOfStatus('pending');
    const onlineVideosCount =
      await this.videoService.getVideosCountOfStatus('online');
    return {
      pendingVideosCount,
      onlineVideosCount,
    };
  }
}
