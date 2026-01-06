import { Injectable } from '@nestjs/common';
import { ReceiveEventDto } from './dto/receive-event.dto';

type EventStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

type EventRecord = {
  id: string;
  externalEventId: string;
  source: string;
  payload: Record<string, any>;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class EventsService {
  private events: EventRecord[] = [];

  receive(dto: ReceiveEventDto) {
    // Idempotency: third-party webhooks can be delivered multiple times
    const existing = this.events.find((e) => e.externalEventId === dto.externalEventId);
    if (existing) {
      return { received: true, duplicate: true, eventId: existing.id, status: existing.status };
    }

    const now = new Date().toISOString();
    const event: EventRecord = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
      externalEventId: dto.externalEventId,
      source: dto.source,
      payload: dto.payload,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    this.events.push(event);

    // Mock async processing boundary (later becomes Lambda)
    void this.processEventAsync(event.id);

    return { received: true, duplicate: false, eventId: event.id, status: event.status };
  }

  findAll() {
    return this.events;
  }

  findById(id: string) {
    return this.events.find((e) => e.id === id) ?? null;
  }

  private async processEventAsync(eventId: string) {
    const event = this.events.find((e) => e.id === eventId);
    if (!event) return;

    try {
      event.status = 'PROCESSING';
      event.updatedAt = new Date().toISOString();

      // Simulate processing delay (represents downstream calls, transforms, DB writes, etc.)
      await new Promise((res) => setTimeout(res, 800));

      // Example mock rule: if payload contains fail=true, mark FAILED
      if (event.payload?.fail === true) {
        throw new Error('Simulated processing failure');
      }

      event.status = 'COMPLETED';
      event.updatedAt = new Date().toISOString();
    } catch {
      event.status = 'FAILED';
      event.updatedAt = new Date().toISOString();
    }
  }
}
