import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppName } from '@waha/apps/app_sdk/apps/name';

export class App<T = any> {
  @IsString()
  id: string;

  @IsString()
  session: string;

  // App name (aka type)
  @IsEnum(AppName)
  app: AppName;

  @ApiProperty({
    description:
      'Enable or disable this app without deleting it. If omitted, treated as enabled (true).',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;

  @ValidateNested()
  @Type(() => Object)
  config: T;
}
