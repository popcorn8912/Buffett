import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { StockResponse } from './stock.models';
import { StockService } from './stock.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly stockService = inject(StockService);

  protected ticker = 'NVDA';
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly stock = signal<StockResponse | null>(null);

  protected readonly chartPoints = computed(() => {
    const stock = this.stock();
    if (!stock || stock.prices.length === 0) {
      return [];
    }

    const width = 760;
    const height = 320;
    const paddingX = 36;
    const paddingY = 24;
    const closes = stock.prices.map((point) => point.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const range = max - min || 1;

    return stock.prices.map((point, index) => {
      const x = paddingX + (index * (width - paddingX * 2)) / Math.max(stock.prices.length - 1, 1);
      const y = height - paddingY - ((point.close - min) / range) * (height - paddingY * 2);
      return { ...point, x, y };
    });
  });

  protected readonly linePoints = computed(() =>
    this.chartPoints()
      .map((point) => `${point.x},${point.y}`)
      .join(' ')
  );

  protected readonly areaPoints = computed(() => {
    const points = this.chartPoints();
    if (points.length === 0) {
      return '';
    }

    const baseY = 296;
    const first = points[0];
    const last = points[points.length - 1];
    return `${first.x},${baseY} ${points.map((point) => `${point.x},${point.y}`).join(' ')} ${last.x},${baseY}`;
  });

  protected readonly gridLines = computed(() => [40, 110, 180, 250]);
  protected readonly minClose = computed(() => this.aggregateClose(Math.min));
  protected readonly maxClose = computed(() => this.aggregateClose(Math.max));
  protected readonly lastClose = computed(() => {
    const prices = this.stock()?.prices ?? [];
    return prices.length ? prices[prices.length - 1].close : 0;
  });

  constructor() {
    this.loadStock();
  }

  protected refresh() {
    this.loadStock();
  }

  private loadStock() {
    const ticker = this.ticker.trim().toUpperCase();
    if (!ticker) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.stockService
      .getStock(ticker)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (stock) => {
          this.ticker = stock.ticker;
          this.stock.set(stock);
        },
        error: () => {
          this.error.set('Unable to load stock data. Make sure the backend is running on http://localhost:8080.');
        }
      });
  }

  private aggregateClose(operation: (...values: number[]) => number) {
    const prices = this.stock()?.prices ?? [];
    return prices.length ? operation(...prices.map((price) => price.close)) : 0;
  }
}
