import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiveEventDto } from './dto/receive-event.dto';
import { Event } from './event.entity';
import { EventProcessorService } from './event-processor/event-processor.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
    private readonly processor: EventProcessorService,
  ) {}

  async receive(dto: ReceiveEventDto) {
    const existing = await this.repo.findOne({
      where: { externalEventId: dto.externalEventId },
    });
    if (existing) {
      return {
        received: true,
        duplicate: true,
        eventId: existing.id,
        status: existing.status,
      };
    }

    const saved = await this.repo.save(
      this.repo.create({
        externalEventId: dto.externalEventId,
        source: dto.source,
        payload: dto.payload,
        status: 'PENDING',
      }),
    );

    // Async boundary: later this becomes Lambda
    void this.processor.process(saved.id);

    return {
      received: true,
      duplicate: false,
      eventId: saved.id,
      status: saved.status,
    };
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
