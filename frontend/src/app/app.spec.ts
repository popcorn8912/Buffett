import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { StockService } from './stock.service';

const stockServiceMock = {
  getStock: () =>
    of({
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      exchange: 'NASDAQ',
      currency: 'USD',
      currentPrice: 925.18,
      changeAmount: 12.51,
      changePercent: 1.37,
      prices: [
        { date: '2026-03-10', close: 901.11 },
        { date: '2026-03-11', close: 910.88 },
        { date: '2026-03-12', close: 912.67 },
        { date: '2026-03-13', close: 925.18 }
      ]
    })
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: StockService, useValue: stockServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Simple stock charting for your backend API.');
  });
});
