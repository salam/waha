import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { parseBool } from '../../helpers';
import { WAHAEngine } from '../../structures/enums.dto';

@Injectable()
export class EngineConfigService {
  constructor(protected configService: ConfigService) {}

  getDefaultEngineName(): WAHAEngine {
    return WAHAEngine.NOWEB;
  }

  get shouldPrintQR(): boolean {
    const value = this.configService.get('WAHA_PRINT_QR', true);
    return parseBool(value);
  }
}
