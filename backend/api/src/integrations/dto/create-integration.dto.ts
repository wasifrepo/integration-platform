import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateIntegrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['stripe', 'sendgrid', 'github'])
  provider: 'stripe' | 'sendgrid' | 'github';
}
