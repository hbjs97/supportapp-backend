import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import AWS, { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import mime from 'mime-types';
import { GeneratorProvider, IFile, IS3File } from 'src/shared/common';
import { ConfigService } from './config.service';

@Injectable()
export class S3Service {
  public s3Instance: AWS.S3;

  constructor(private configService: ConfigService) {
    const s3InstanceOptions: S3.Types.ClientConfiguration = {
      accessKeyId: this.configService.get('aws.accessKeyId'),
      secretAccessKey: this.configService.get('aws.secretAccessKey'),
      region: this.configService.get('aws.region'),
      signatureVersion: 'v4',
    };
    this.s3Instance = new AWS.S3(s3InstanceOptions);
  }

  async uploadImage(file: IFile): Promise<IS3File> {
    const fileName = GeneratorProvider.fileName(<string>mime.extension(file.mimetype));
    const key = `images/${fileName}`;
    await this.uploadToS3Bucket({ Bucket: this.configService.get('aws.s3.bucketName'), Body: file.buffer, ACL: 'public-read', Key: key });
    return { ...file, location: `${this.configService.get('aws.s3.domain')}/${key}`, key };
  }

  async uploadImages(files: IFile[]): Promise<IS3File[]> {
    return await Promise.all(files.map(async (file: IFile) => await this.uploadImage(file)));
  }

  private async uploadToS3Bucket(params: PutObjectRequest): Promise<void> {
    await this.s3Instance
      .putObject(params)
      .promise()
      .catch((error) => {
        throw new HttpException('s3 file upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}
