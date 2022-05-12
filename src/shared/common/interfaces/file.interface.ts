export interface IFile {
  encoding: string;
  buffer: Buffer;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface IS3File extends IFile {
  location: string;
  key: string;
}
