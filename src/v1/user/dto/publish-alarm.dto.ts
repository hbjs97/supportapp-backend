import { StringField, UUIDField } from 'src/shared/common';

export class PublishAlarmDto {
  @StringField()
  readonly title!: string;

  @StringField()
  readonly content!: string;

  @UUIDField({ isArray: true, each: true })
  readonly receiveUserIds!: string[];
}
