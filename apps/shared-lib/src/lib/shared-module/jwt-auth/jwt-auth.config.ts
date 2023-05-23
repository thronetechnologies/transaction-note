import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: (config: ConfigService) => {
    return {
      secret: config.get('jwtSecret'),
      signOptions: { expiresIn: '1d' },
    };
  },
  inject: [ConfigService],
};
