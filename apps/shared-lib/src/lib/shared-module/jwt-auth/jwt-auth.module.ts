import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from './jwt-auth.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({ imports: [ConfigModule], ...jwtConfig }),
  ],
  exports: [JwtModule, PassportModule],
})
export class JwtAuthModule {}
