import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { Integration } from './integration.entity';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integration)
    private readonly repo: Repository<Integration>,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Integration not found');
    return found;
  }

  create(dto: CreateIntegrationDto) {
    const integration = this.repo.create({ ...dto, status: 'ACTIVE' });
    return this.repo.save(integration);
  }
}
