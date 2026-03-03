import { AppsService } from '@waha/apps/app_sdk/services/IAppsService';
import { AppsDisabledService } from '@waha/apps/app_sdk/services/AppsDisabledService';
import { AppsController } from '@waha/apps/app_sdk/api/apps.controller';

export const AppsDisabled = {
  providers: [
    {
      provide: AppsService,
      useClass: AppsDisabledService,
    },
  ],
  imports: [],
  controllers: [AppsController],
};
