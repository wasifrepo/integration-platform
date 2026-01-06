import { Module } from '@nestjs/common';
import { IntegrationsModule } from './integrations/integrations.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [IntegrationsModule, EventsModule],
})
export class AppModule {}
