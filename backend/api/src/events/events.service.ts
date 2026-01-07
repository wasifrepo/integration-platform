import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiveEventDto } from './dto/receive-event.dto';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
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

    const event = this.repo.create({
      externalEventId: dto.externalEventId,
      source: dto.source,
      payload: dto.payload,
      status: 'PENDING',
    });

    const saved = await this.repo.save(event);

    // async boundary placeholder (Lambda later)
    void this.processEventAsync(saved.id);

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

  private async processEventAsync(eventId: string) {
    const event = await this.repo.findOne({ where: { id: eventId } });
    if (!event) return;

    try {
      event.status = 'PROCESSING';
      await this.repo.save(event);

      await new Promise((res) => setTimeout(res, 800));

      if (event.payload?.fail === true)
        throw new Error('Simulated processing failure');

      event.status = 'COMPLETED';
      await this.repo.save(event);
    } catch {
      await this.repo.update({ id: eventId }, { status: 'FAILED' });
    }
  }
}
