import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../event.entity';

@Injectable()
export class EventProcessorService {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
  ) {}

  async process(eventId: string) {
    const event = await this.repo.findOne({ where: { id: eventId } });
    if (!event) return;

    try {
      await this.repo.update({ id: eventId }, { status: 'PROCESSING' });

      // Simulate work: transform payload, call third-party API, write DB updates, etc.
      await new Promise((res) => setTimeout(res, 800));

      if (event.payload?.fail === true)
        throw new Error('Simulated processing failure');

      await this.repo.update({ id: eventId }, { status: 'COMPLETED' });
    } catch {
      await this.repo.update({ id: eventId }, { status: 'FAILED' });
    }
  }
}
