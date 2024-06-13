import { Body, Controller, Post } from '@nestjs/common';
import { ApiKeysService } from './api-key.service';
import { ApiKeyDto } from './dto/api-key.dto';

@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  async createApiKey(@Body() body: ApiKeyDto): Promise<string> {
    return await this.apiKeysService.createApiKey(body.userId);
  }
}
