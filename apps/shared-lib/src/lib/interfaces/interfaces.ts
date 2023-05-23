/* eslint-disable @typescript-eslint/ban-types */
import {
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
} from '@nestjs/common';

export enum GetAuthResponseStatus {
  AUTHORIZED = 'authorized',
  FAILED_AUTHORIZATION = 'Failed authorization',
  USED = 'used',
  CORRUPTED = 'corrupted',
  UNRECOGNIZED = 'unrecognized',
}

export interface AuthRequestInerface {
  auth_token: string;
  request_id: string;
}

export interface GetAuthResponse {
  status: GetAuthResponseStatus;
  error?: string;
  message?: string;
}

export interface JwtTokenInterface {
  token: string;
}

export interface AuthTokenInterface {
  auth_token: string;
}

export interface AuthTokenErrorInterface {
  error: string;
  statusCode: number;
}

export interface UserDetailsInterface {
  statusCode: number;
  status: string;
}

export interface UserDetails extends BasicUserSignupCredential {
  _id: string;
  acct_number?: number;
  date: Date;
}

export interface Password {
  password: string;
}

export interface BasicUserSignupCredential {
  firstname: string;
  lastname: string;
  email: string;
}

export interface UserSignupCredential
  extends Password,
    BasicUserSignupCredential {}

export interface SignupResponseInterface {
  user: UserDetails;
  token: string;
}

export interface UserDetailsReturnInterface
  extends UserDetailsInterface,
    JwtTokenInterface {
  user: UserDetails;
}

export interface UserDetailsErrorInterface extends UserDetailsInterface {
  error: string;
}

export interface TransportOptions {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  attachments?: { filename: string; path: string }[];
  context: { [key: string]: unknown };
}
