import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ParserService {
  private readonly TARGET_URL =
    'https://mnogo-mesta.com/warehouses/13b5674c-edb0-11ed-936c-d00df3e03d97';

  async parseCells(): Promise<string[]> {
    try {
      const response = await axios.get(this.TARGET_URL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const cells: string[] = [];

      // Пример селектора (нужно адаптировать под реальную структуру страницы)
      $('[data-selected="false"], [data-selected="true"]').each(
        (_, element) => {
          const cell = $(element).text();
          if (cell) {
            cells.push(cell);
          }
        },
      );

      return cells;
    } catch (error) {
      throw new Error(`Parsing error: ${error.message}`);
    }
  }
}
