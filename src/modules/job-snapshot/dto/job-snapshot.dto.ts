import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class JobCreatedDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  timestamp: string;
}

