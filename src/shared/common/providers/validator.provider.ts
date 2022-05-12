export class ValidatorProvider {
  static readonly imageMimeTypes: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

  public static isImage(mimeType: string): boolean {
    return this.imageMimeTypes.includes(mimeType);
  }

  public static isImages(mimeTypes: string[]): boolean {
    return mimeTypes.some((mimeType) => this.imageMimeTypes.includes(mimeType));
  }
}
