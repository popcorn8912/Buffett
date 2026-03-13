package com.buffett.backend.stock;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class StockService {

    private static final Map<String, StockResponse> MOCK_STOCKS = Map.of(
            "AAPL", new StockResponse(
                    "AAPL",
                    "Apple Inc.",
                    "NASDAQ",
                    "USD",
                    211.43,
                    2.18,
                    1.04,
                    List.of(
                            new PricePoint("2026-03-04", 198.12),
                            new PricePoint("2026-03-05", 199.84),
                            new PricePoint("2026-03-06", 201.05),
                            new PricePoint("2026-03-09", 203.74),
                            new PricePoint("2026-03-10", 205.96),
                            new PricePoint("2026-03-11", 207.62),
                            new PricePoint("2026-03-12", 209.25),
                            new PricePoint("2026-03-13", 211.43)
                    )
            ),
            "NVDA", new StockResponse(
                    "NVDA",
                    "NVIDIA Corporation",
                    "NASDAQ",
                    "USD",
                    925.18,
                    12.51,
                    1.37,
                    List.of(
                            new PricePoint("2026-03-04", 871.24),
                            new PricePoint("2026-03-05", 878.09),
                            new PricePoint("2026-03-06", 882.46),
                            new PricePoint("2026-03-09", 895.73),
                            new PricePoint("2026-03-10", 901.11),
                            new PricePoint("2026-03-11", 910.88),
                            new PricePoint("2026-03-12", 912.67),
                            new PricePoint("2026-03-13", 925.18)
                    )
            ),
            "TSLA", new StockResponse(
                    "TSLA",
                    "Tesla, Inc.",
                    "NASDAQ",
                    "USD",
                    184.57,
                    -3.42,
                    -1.82,
                    List.of(
                            new PricePoint("2026-03-04", 193.15),
                            new PricePoint("2026-03-05", 191.80),
                            new PricePoint("2026-03-06", 190.44),
                            new PricePoint("2026-03-09", 188.97),
                            new PricePoint("2026-03-10", 187.93),
                            new PricePoint("2026-03-11", 189.26),
                            new PricePoint("2026-03-12", 187.99),
                            new PricePoint("2026-03-13", 184.57)
                    )
            )
    );

    public StockResponse getStock(String ticker) {
        String normalizedTicker = ticker.toUpperCase(Locale.ROOT);
        return MOCK_STOCKS.getOrDefault(normalizedTicker, createFallbackStock(normalizedTicker));
    }

    private StockResponse createFallbackStock(String ticker) {
        return new StockResponse(
                ticker,
                ticker + " Holdings",
                "NASDAQ",
                "USD",
                100.25,
                0.75,
                0.75,
                List.of(
                        new PricePoint("2026-03-04", 96.15),
                        new PricePoint("2026-03-05", 96.92),
                        new PricePoint("2026-03-06", 97.84),
                        new PricePoint("2026-03-09", 98.11),
                        new PricePoint("2026-03-10", 99.20),
                        new PricePoint("2026-03-11", 99.58),
                        new PricePoint("2026-03-12", 99.50),
                        new PricePoint("2026-03-13", 100.25)
                )
        );
    }
}
