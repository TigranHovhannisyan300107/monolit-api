import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from 'src/modules/api-key/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'] as string;

    if (!apiKey) throw new UnauthorizedException("API key doesn't exist");

    const user = await this.apiKeysService.getUser(apiKey);
    if (!user) throw new UnauthorizedException('Invalid API key');

    request.user = user;
    return true;
  }
}
