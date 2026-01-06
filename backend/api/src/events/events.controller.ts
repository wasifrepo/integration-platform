import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { ReceiveEventDto } from './dto/receive-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Webhook ingestion endpoint (frontend can also use it for testing)
  @Post('webhook')
  webhook(@Body() dto: ReceiveEventDto) {
    return this.eventsService.receive(dto);
  }

  @Get()
  list() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }
}
