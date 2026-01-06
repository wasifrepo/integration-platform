import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  findAll() {
    return this.integrationsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.integrationsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateIntegrationDto) {
    return this.integrationsService.create(dto);
  }
}
