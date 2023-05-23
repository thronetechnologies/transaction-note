import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, ClientsModuleOptions } from '@nestjs/microservices';

@Module({})
export class TransportModule {
  static register(
    config: ClientsModuleOptions,
    isGlobal = false
  ): DynamicModule {
    return {
      global: isGlobal,
      module: TransportModule,
      imports: [ClientsModule.register(config)],
    };
  }
}
