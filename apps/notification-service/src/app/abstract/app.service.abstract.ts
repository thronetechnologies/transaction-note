import { EmailOptions } from '@shared-lib/lib/interfaces/interfaces';

export abstract class AppServiceAbstract {
  abstract sendUserLoginMessage(emailOptions: EmailOptions);
}
