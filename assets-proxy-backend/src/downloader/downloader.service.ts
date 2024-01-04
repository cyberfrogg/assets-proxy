import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '../video/video.entity';
import { Repository } from 'typeorm';
import { TiktokDL } from '@lucas_monroe/tiktok-api-dl';
import axios from 'axios';

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

    switch (mediaType) {
      case 'youtube':
        throw new BadRequestException('youtube not supported');
      case 'tiktok':
        await this.downloadTiktokVideo(video);
        break;
      default:
        throw new BadRequestException('external not supported');
    }

    this.isWorkerWorking = false;
  }

  async downloadTiktokVideo(video: Video) {
    try {
      const result = await TiktokDL(video.url);
      if (result.status !== 'success') {
        console.error(
          `DL Failed to download tiktok video ${video.id}`,
          result.message,
        );
        await this.markVideoAsFailed(video.id);
        return;
      }

      for (let i = 0; i < result.result.video.length; i++) {
        try {
          const videoUrl = result.result.video[0];
          const videoBuffer = await this.downloadVideoToBuffer(videoUrl);
          break;
        } catch (ed) {}
      }

      throw new Error(
        `Failed to download results from ${result.result.video.length} tiktok cdn mirrors`,
      );
    } catch (e) {
      console.error(`Failed to download tiktok video ${video.id}`, e);
      await this.markVideoAsFailed(video.id);
    }
  }

  async markVideoAsFailed(videoId: string) {
    await this.videoRepository.update(
      { id: videoId },
      { taskStatus: 'failed' },
    );
  }

  async downloadVideoToBuffer(videoUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
      });

      if (response && response.data) {
        const buffer: Buffer = Buffer.from(response.data, 'binary');
        return buffer;
      } else {
        throw new Error('Empty response or data');
      }
    } catch (error) {
      throw new Error(`Error downloading video: ${error.message}`);
    }
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
