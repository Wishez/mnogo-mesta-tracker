import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  private trackedCells = new Set<string>();

  addCells(cells: string[]): void {
    cells.forEach((cell) => this.trackedCells.add(cell));
  }

  removeCells(cells: string[]): void {
    cells.forEach((cell) => this.trackedCells.delete(cell));
  }

  getTrackedCells(): string[] {
    return Array.from(this.trackedCells);
  }

  getNewCells(currentCells: string[]): string[] {
    return currentCells.filter((cell) => !this.trackedCells.has(cell));
  }

  getRemovedCells(currentCells: string[]): string[] {
    return this.getTrackedCells().filter(
      (cell) => !currentCells.includes(cell),
    );
  }
}
