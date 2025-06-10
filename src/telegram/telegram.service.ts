import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private readonly chatId: string;

  constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      throw new Error('Telegram credentials not configured!');
    }

    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  async sendMessage(text: string): Promise<void> {
    try {
      await this.bot.sendMessage(this.chatId, text, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('Telegram send error:', error.message);
    }
  }
}
