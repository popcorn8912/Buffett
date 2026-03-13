package com.buffett.backend.stock;

import java.util.List;

public record StockResponse(
        String ticker,
        String companyName,
        String exchange,
        String currency,
        double currentPrice,
        double changeAmount,
        double changePercent,
        List<PricePoint> prices
) {
}
