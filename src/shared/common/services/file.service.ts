import { Injectable } from '@nestjs/common';
import { IFile, IS3File } from 'src/shared/common';
import { S3Service } from 'src/shared/common/services';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class FileService {
  constructor(private s3Service: S3Service) {}

  public async uploadImage(file: IFile): Promise<IS3File> {
    return await this.s3Service.uploadImage(file);
  }

  @Transactional()
  public async uploadImages(files: Array<IFile>): Promise<IS3File[]> {
    return await this.s3Service.uploadImages(files);
  }
}
