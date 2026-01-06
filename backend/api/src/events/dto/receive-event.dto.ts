import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class ReceiveEventDto {
  @IsString()
  @IsNotEmpty()
  externalEventId: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsObject()
  payload: Record<string, any>;
}
