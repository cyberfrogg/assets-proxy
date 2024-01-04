import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '../video/video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DownloaderService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  private isWorkerWorking = false;

  async triggerDownloaderWorker() {
    if (this.isWorkerWorking) return;

    console.log('Triggered Downloader Worker');
    this.isWorkerWorking = true;

    const video = await this.videoRepository.findOneBy({
      taskStatus: 'pending',
    });

    const mediaType = this.defineMediaType(video.url);
    console.log(mediaType);

    this.isWorkerWorking = false;
  }

  defineMediaType(urlString: string) {
    try {
      const url = new URL(urlString);
      const splittedHostname = url.hostname.split('.');
      const domain = splittedHostname[splittedHostname.length - 2];

      switch (domain) {
        case 'youtube':
          return 'youtube';
        case 'youtu':
          return 'youtube';
        case 'tiktok':
          return 'tiktok';
        default:
          return 'external';
      }
    } catch (e) {
      return 'external';
    }
  }
}
