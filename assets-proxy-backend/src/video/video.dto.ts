import { IsString } from 'class-validator';

export class GetVideoDto {
  @IsString()
  url: string;

  @IsString()
  lifetime: '1 hour' | '1 day' | '1 week' | '1 month';
}

export class GetVideoStatusDto {
  @IsString()
  id: string;
}
