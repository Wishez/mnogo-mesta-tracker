import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ParserService } from '../parser/parser.service';
import { StorageService } from '../storage/storage.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  private isFirstRun = true;

  constructor(
    private readonly parserService: ParserService,
    private readonly storageService: StorageService,
    private readonly telegramService: TelegramService,
  ) {}

  @Cron('0 * * * *') // Каждый час в 0 минут
  async handleCron() {
    try {
      this.logger.log('Starting cell monitoring...');

      const currentCells = await this.parserService.parseCells();
      this.logger.debug(`Нашёл ${currentCells.length} ячеек`);

      // Первый запуск - добавляем все ячейки без уведомления
      if (this.isFirstRun) {
        this.storageService.addCells(currentCells);
        this.isFirstRun = false;
        await this.telegramService.sendMessage(
          `<b>Начал мониторить!</b>\n Отслеживаю ячейки ${currentCells.length}шт`,
        );
        await this.sendInfoAboutNewCells(currentCells);
        return;
      }

      const newCells = this.storageService.getNewCells(currentCells);
      const removedCells = this.storageService.getRemovedCells(currentCells);

      if (newCells.length > 0) {
        await this.sendInfoAboutNewCells(newCells);
      }

      if (removedCells.length > 0) {
        await this.sendInfoAboutVanishedCells(removedCells);
      }

      if (newCells.length === 0 && removedCells.length === 0) {
        this.logger.log('No changes detected');
      }
    } catch (error) {
      this.logger.error(`Monitoring error: ${error.message}`);
      await this.telegramService.sendMessage(
        `<b>⚠️ Monitoring error:</b>\n${error.message}`,
      );
    }
  }

  private async sendInfoAboutNewCells(cells: string[]) {
    const message = `<b>🔥 Доступные новые ячейки:</b>\n${cells.join('\n')}`;
    await this.telegramService.sendMessage(message);
    this.storageService.addCells(cells);
  }

  private async sendInfoAboutVanishedCells(cells: string[]) {
    const message = `<b>❌ Ячейки больше не доступны:</b>\n${cells.join('\n')}`;
    await this.telegramService.sendMessage(message);
    this.storageService.removeCells(cells);
  }
}
