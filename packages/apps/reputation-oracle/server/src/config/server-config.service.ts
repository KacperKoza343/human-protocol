import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfigService {
  constructor(private configService: ConfigService) {}

  get gitHash(): string {
    return this.configService.get<string>('GIT_HASH', '');
  }

  /**
   * The hostname or IP address on which the server will run.
   * Default: 'localhost'
   */
  get host(): string {
    return this.configService.get<string>('HOST', 'localhost');
  }

  /**
   * The port number on which the server will listen for incoming connections.
   * Default: 5003
   */
  get port(): number {
    return +this.configService.get<number>('PORT', 5003);
  }

  /**
   * The URL of the frontend application that the server will communicate with.
   * Default: 'http://localhost:3001'
   */
  get feURL(): string {
    return this.configService.get<string>('FE_URL', 'http://localhost:3001');
  }

  /**
   * The secret key used for session encryption and validation.
   * Default: 'session_key'
   */
  get sessionSecret(): string {
    return this.configService.get<string>('SESSION_SECRET', 'session_key');
  }

  /**
   * The maximum number of retry attempts for certain operations.
   * Default: 5
   */
  get maxRetryCount(): number {
    return +this.configService.get<number>('MAX_RETRY_COUNT', 5);
  }

  /**
   * The minimum validity period (in ms) for a qualification.
   * Default: 1 day (24 * 60 * 60 * 1000 ms)
   */
  get qualificationMinValidity(): number {
    return (
      +this.configService.get('QUALIFICATION_MIN_VALIDITY', 1) *
      24 *
      60 *
      60 *
      1000
    );
  }
}
