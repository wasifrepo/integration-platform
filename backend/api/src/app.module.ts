import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationsModule } from './integrations/integrations.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'integration_db',
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    IntegrationsModule,
    EventsModule,
  ],
})
export class AppModule {}
