import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';

type IntegrationStatus = 'ACTIVE' | 'DISABLED';

export type Integration = {
  id: string;
  name: string;
  provider: string;
  status: IntegrationStatus;
  createdAt: string;
};

@Injectable()
export class IntegrationsService {
  private integrations: Integration[] = [];

  findAll(): Integration[] {
    return this.integrations;
  }

  findById(id: string): Integration {
    const found = this.integrations.find((i) => i.id === id);
    if (!found) throw new NotFoundException('Integration not found');
    return found;
  }

  create(dto: CreateIntegrationDto): Integration {
    const integration: Integration = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`, // safe fallback
      name: dto.name,
      provider: dto.provider,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.integrations.push(integration);
    return integration;
  }
}
