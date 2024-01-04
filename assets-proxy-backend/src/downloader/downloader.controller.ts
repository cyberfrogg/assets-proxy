import { Controller } from '@nestjs/common';
import { DownloaderService } from './downloader.service';

@Controller('downloader')
export class DownloaderController {
  constructor(private downloaderService: DownloaderService) {}
}
