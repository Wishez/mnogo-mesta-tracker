import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ParserService } from './parser/parser.service';
import { StorageService } from './storage/storage.service';
import { TelegramService } from './telegram/telegram.service';
import { TaskService } from './task/task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ParserService, StorageService, TelegramService, TaskService],
})
export class AppModule {}
