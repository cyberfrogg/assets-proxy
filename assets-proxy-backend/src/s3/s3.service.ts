import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  private readonly prefix = 'videos/';

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION,
      endpoint: process.env.S3_URL,
    });
  }

  async uploadBuffer(name: string, buffer: Buffer) {
    const key = this.prefix + name;
    const params: S3.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
    };

    const response = await this.s3.upload(params).promise();
    return response.Location;
  }
}
