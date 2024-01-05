import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get('ping')
  async ping() {
    return this.statusService.ping();
  }

  @Get('components')
  async componentStatuses() {
    return this.statusService.componentStatuses();
  }

  @Get('dynamicStatus')
  async dynamicStatus() {
    return this.statusService.dynamicStatus();
  }
}
