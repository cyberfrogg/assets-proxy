import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  constructor() {}

  async componentStatuses() {
    return 'OK';
  }

  async ping() {
    return 'OK';
  }
}
