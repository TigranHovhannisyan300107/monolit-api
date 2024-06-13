import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PGDatabaseConnections } from 'src/database/postgres/enums';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey, PGDatabaseConnections.FIRST_PART)
    private readonly apiKeyRepository: Repository<ApiKey>,
    private readonly logger: Logger,
  ) {}

  async getUser(apiKey: string): Promise<string | void> {
    this.logger.log(`Start checking api key: ${apiKey}`, ApiKeysService.name);
    const keyRecord = await this.apiKeyRepository.findOneBy({
      key: apiKey,
    });

    if (!keyRecord)
      return this.logger.log(
        `API key not found: ${apiKey}`,
        ApiKeysService.name,
      );

    this.logger.log(
      `Found API key: ${apiKey} - Found user: ${keyRecord.user}`,
      ApiKeysService.name,
    );
    return keyRecord.user;
  }

  async createApiKey(user: string): Promise<string> {
    const apiKey = new ApiKey();
    apiKey.user = user;

    await this.apiKeyRepository.save(apiKey);

    return apiKey.key;
  }
}
