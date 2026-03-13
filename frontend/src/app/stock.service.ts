import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StockResponse } from './stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/stocks';

  getStock(ticker: string) {
    return this.http.get<StockResponse>(`${this.apiBaseUrl}/${ticker}`);
  }
}
