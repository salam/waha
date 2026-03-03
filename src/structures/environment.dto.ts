import { ApiProperty } from '@nestjs/swagger';

export class WAHAEnvironment {
  @ApiProperty({
    example: 'YYYY.MM.BUILD',
  })
  version: string;

  @ApiProperty({
    example: 'NOWEB',
  })
  engine: string;

  @ApiProperty({
    example: 'CORE',
  })
  tier: string;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  browser: string | null;

  @ApiProperty({
    example: 'linux/x86',
  })
  platform: string;

  @ApiProperty({
    example: {
      id: 'worker-1',
    },
    nullable: true,
    description: 'Worker metadata for the running instance.',
  })
  worker: {
    id: string | null;
  };
}
