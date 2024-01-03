import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetVideoDto, GetVideoStatusDto } from './video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async getAndStoreVideo(getVideoDto: GetVideoDto) {
    if (getVideoDto.url === '')
      throw new BadRequestException('url is an empty string');

    const lifetimeOffset = this.getTimeOffsetFromLifetime(getVideoDto.lifetime);
    const dieAt = new Date(Date.now() + lifetimeOffset);

    const sameVideoWithUrl = await this.getVideoByUrl(getVideoDto.url);
    if (sameVideoWithUrl) {
      return sameVideoWithUrl;
    }

    await this.videoRepository.insert({
      url: getVideoDto.url,
      taskStatus: 'pending',
      dieAt: dieAt,
    });

    return await this.getVideoByUrl(getVideoDto.url);
  }

  async getVideoStatus(getVideoStatusDto: GetVideoStatusDto) {
    if (getVideoStatusDto.id === '')
      throw new BadRequestException('id is an empty string');

    const video = await this.getVideoById(getVideoStatusDto.id);
    if (!video)
      throw new NotFoundException(
        `Video with id ${getVideoStatusDto.id} not found`,
      );

    return { taskStatus: video.taskStatus };
  }

  async getVideoByUrl(url: string) {
    return this.videoRepository.findOneBy({ url });
  }

  async getVideoById(id: string) {
    return this.videoRepository.findOneBy({ id });
  }

  getTimeOffsetFromLifetime(
    lifetime: '1 hour' | '1 day' | '1 week' | '1 month',
  ): number {
    const hourInMs = 60 * 60 * 1000;
    const dayInMs = 24 * hourInMs;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs; // Approximating a month as 30 days

    switch (lifetime) {
      case '1 hour':
        return 1 * hourInMs;
      case '1 day':
        return 1 * dayInMs;
      case '1 week':
        return 1 * weekInMs;
      case '1 month':
        return 1 * monthInMs;
      default:
        throw new BadRequestException('Invalid lifetime was provided');
    }
  }
}
