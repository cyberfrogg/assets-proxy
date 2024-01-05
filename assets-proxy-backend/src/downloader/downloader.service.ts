import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '../video/video.entity';
import { Repository } from 'typeorm';
import { TiktokDL } from '@lucas_monroe/tiktok-api-dl';
import axios from 'axios';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class DownloaderService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly s3Service: S3Service,
  ) {}

  private isWorkerWorking = false;

  async triggerDownloaderWorker() {
    if (this.isWorkerWorking) {
      console.log('Worker is already working. Skipping');
      return;
    }

    this.isWorkerWorking = true;

    const video = await this.videoRepository.findOneBy({
      taskStatus: 'pending',
    });

    if (!video) {
      this.isWorkerWorking = false;
      console.log('No pending videos found.');
      return;
    }

    console.log('Downloader worker triggered...');

    const mediaType = this.defineMediaType(video.url);

    switch (mediaType) {
      case 'youtube':
        console.error('external is not supported right now');
        await this.markVideoAsFailed(video.id);
        break;
      case 'tiktok':
        await this.downloadTiktokVideo(video);
        break;
      default:
        console.error('external is not supported right now');
        await this.markVideoAsFailed(video.id);
        break;
    }

    console.log('Downloader worker complete');
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
          const downloadUrl = await this.uploadToS3(video, videoBuffer);
          await this.markVideoAsComplete(video.id, downloadUrl);
          return;
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

  async markVideoAsComplete(videoId: string, downloadUrl: string) {
    await this.videoRepository.update(
      { id: videoId },
      {
        taskStatus: 'complete',
        downloadUrl,
      },
    );
  }

  async uploadToS3(video: Video, buffer: Buffer) {
    return await this.s3Service.uploadBuffer(video.id + '.mp4', buffer);
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
