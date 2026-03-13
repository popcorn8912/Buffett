# Stock Trading Insights Web App Design

## 1. Overview

This document describes the design of a web application that helps retail traders generate short-term stock trading insights with the support of Large Language Models (LLMs) such as ChatGPT and Gemini.

The product goal is not to let the LLM "guess stocks" directly. Instead, the system should combine:

- structured market data
- deterministic technical analysis logic
- risk controls and prompt guardrails
- LLM-based explanation and scenario analysis

This separation is important because short-term trading decisions require consistent numeric logic, while LLMs are best used for interpretation, summarization, and contextual reasoning.

## 2. Product Goal

Build a web app that allows a user to:

- search a stock ticker
- view recent price action and technical indicators
- receive short-term trading insights
- identify possible support and resistance levels
- estimate candidate entry, stop-loss, and take-profit zones
- ask follow-up questions in natural language
- compare outputs from multiple LLM providers such as OpenAI and Gemini

The app should help users reason about trades, not automatically execute trades.

## 3. Core Use Cases

### 3.1 Ticker Analysis

A user enters a ticker such as `AAPL`, `NVDA`, or `TSLA` and requests a short-term trading analysis. The system returns:

- trend summary
- support levels
- resistance levels
- possible entry range
- stop-loss suggestion
- take-profit targets
- risk/reward commentary
- confidence notes and caveats

### 3.2 Follow-Up Conversational Analysis

A user asks questions such as:

- "Is this stock near a breakout level?"
- "What is a safer buy price if I want lower risk?"
- "What support level matters most on the 1D chart?"
- "If price drops 3%, what should I watch next?"

The app should answer using both computed indicators and LLM reasoning.

### 3.3 Multi-Provider LLM Comparison

A user can choose:

- OpenAI only
- Gemini only
- both providers

This allows side-by-side comparison of explanations and recommendations.

### 3.4 Watchlist Insight Generation

A user uploads or maintains a watchlist and requests the app to rank names by:

- breakout potential
- pullback opportunity
- volatility risk
- trend strength

## 4. Scope

### In Scope

- stock-focused short-term trading insights
- support/resistance detection
- technical indicator calculation
- LLM-generated narrative analysis
- conversational follow-up questions
- chart visualization
- basic watchlist management
- multi-provider LLM abstraction
- user authentication
- analysis history

### Out of Scope for V1

- live brokerage integration
- auto-trading or order placement
- options strategy engine
- portfolio optimization
- social trading features
- advanced backtesting platform
- regulatory-grade investment suitability checks

## 5. Key Requirements

### 5.1 Functional Requirements

1. The user can search by ticker symbol.
2. The system can retrieve recent OHLCV market data.
3. The system can compute technical indicators such as:
   - SMA / EMA
   - RSI
   - MACD
   - ATR
   - VWAP if intraday data is available
   - volume spikes
4. The system can estimate support and resistance using deterministic logic.
5. The system can generate candidate trade setups such as:
   - pullback buy
   - breakout buy
   - reversal watch
6. The system can call one or more LLM providers and produce explanation text.
7. The user can ask follow-up questions about the analysis.
8. The app stores previous analyses for later review.
9. The system shows risk disclaimers and states that outputs are educational, not financial advice.

### 5.2 Non-Functional Requirements

- responsive UI for desktop and mobile
- secure API key management
- low-latency analysis flow
- provider abstraction for switching LLM vendors
- traceability of how numeric levels were derived
- observability for prompt, response, and error monitoring
- scalable architecture for more tickers and users

## 6. Recommended Tech Stack

### Frontend

- Angular
- TypeScript
- Angular Material or NG-ZORRO for fast UI assembly
- RxJS for async data streams
- ECharts, Highcharts, or TradingView Lightweight Charts for candlestick charts
- Tailwind CSS optional for layout and rapid styling

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- Spring AI or custom provider adapters for LLM integration
- WebClient for calling market data and LLM APIs

### Database

- PostgreSQL for application data
- Redis optional for caching recent market data and analysis results

### Infrastructure

- Docker
- Docker Compose for local development
- AWS / GCP / Azure for deployment
- GitHub Actions for CI/CD

### External Integrations

- OpenAI API
- Gemini API
- Market data provider such as Alpha Vantage, Polygon, Twelve Data, Finnhub, or Yahoo Finance proxy service

## 7. Architecture Principles

### 7.1 Separate Numeric Logic from LLM Logic

Support, resistance, candidate buy zones, stop-loss ranges, and technical indicators should be computed by backend services, not invented by the LLM.

The LLM should receive structured analysis input such as:

- ticker
- timeframe
- latest close
- trend state
- support/resistance levels
- volatility metrics
- volume behavior
- generated setup candidates

The LLM then converts these inputs into:

- human-readable explanation
- scenario reasoning
- trading caveats
- question answering

### 7.2 Provider Abstraction

The backend should expose a common `LLMProvider` interface so the application can switch between ChatGPT and Gemini without changing business logic.

Example abstraction:

- `generateAnalysis(prompt, context)`
- `answerFollowUp(question, analysisContext)`
- `compareProviders(request)`

### 7.3 Explainable Outputs

Every insight shown to the user should reference data sources or formulas where possible. For example:

- "Support 1 = 182.40 because this level aligned with the last 3 swing lows"
- "Stop-loss = 179.80 based on ATR buffer below support"

This is critical for trust and debugging.

## 8. High-Level System Design

### 8.1 Frontend Modules

- Authentication Module
- Dashboard Module
- Ticker Search Module
- Chart and Indicator Module
- Analysis Result Module
- Chat / Follow-Up Module
- Watchlist Module
- Settings Module

### 8.2 Backend Modules

- Auth Service
- Market Data Service
- Technical Analysis Service
- Trade Setup Engine
- LLM Orchestration Service
- Prompt Template Service
- Analysis Persistence Service
- Watchlist Service
- Audit / Logging Service

### 8.3 Core Request Flow

1. User selects ticker and timeframe.
2. Frontend calls backend analysis endpoint.
3. Backend fetches market data from provider.
4. Technical Analysis Service computes indicators.
5. Trade Setup Engine derives support, resistance, entry zone, stop-loss, and targets.
6. LLM Orchestration Service builds a structured prompt.
7. Selected LLM provider returns narrative analysis.
8. Backend merges numeric results with LLM response.
9. Frontend renders chart, metrics, and explanation.

## 9. Market Data Design

Short-term stock analysis is only useful if the app has reliable data. This is one of the most important design decisions.

### Data Needed

- OHLCV candles
- intraday data for short-term analysis
- daily candles for context
- volume
- optional pre-market / after-hours data
- optional news sentiment

### Recommended Approach

For V1:

- start with one market data provider
- support `1D`, `1W`, `1M`, and intraday intervals such as `5m`, `15m`, `1h`
- cache recent responses

### Important Constraint

If the data is delayed, the app must explicitly label the analysis as delayed. Short-term trading insights based on stale data can be misleading.

## 10. Technical Analysis Engine

The backend should implement deterministic algorithms for short-term trading signals.

### 10.1 Indicator Layer

Compute:

- SMA(20), SMA(50), EMA(9), EMA(21)
- RSI(14)
- MACD(12,26,9)
- ATR(14)
- average volume
- breakout volume ratio

### 10.2 Support and Resistance Logic

Possible methods:

- swing high / swing low detection
- local extrema clustering
- pivot points
- VWAP interaction
- volume profile zones in later versions

Recommended V1 approach:

- detect recent swing highs and lows
- cluster nearby levels within a configurable percentage band
- rank levels by touch count, recency, and volume reaction

### 10.3 Candidate Trade Setup Logic

For each ticker, produce structured setups such as:

#### Pullback Buy

- trend is bullish
- price is above medium-term moving average
- current price is near support or EMA zone
- RSI is not overbought

#### Breakout Buy

- price is approaching or breaking resistance
- volume expansion exists
- false breakout risk is estimated

#### Reversal Watch

- price has sold off into support
- RSI indicates oversold or recovering momentum
- confirmation is still required

### 10.4 Risk Calculation

Each setup should include:

- entry zone
- invalidation level
- stop-loss
- target 1
- target 2
- risk/reward ratio

These numbers should be generated by the backend before passing context to the LLM.

## 11. LLM Integration Design

### 11.1 Role of the LLM

The LLM should:

- explain the computed setup in plain English
- compare bullish and bearish scenarios
- answer follow-up questions
- summarize risks
- convert raw indicator data into actionable narrative

The LLM should not:

- fabricate prices not grounded in backend context
- claim certainty
- act as an execution engine

### 11.2 Prompt Strategy

Use structured prompt templates with:

- system instruction
- application policy and risk guardrails
- structured market context
- computed levels and setups
- explicit response schema

Example response schema:

- overall bias
- key support levels
- key resistance levels
- suggested entry range
- stop-loss idea
- profit target ideas
- main risks
- confidence notes

### 11.3 Multi-Provider Strategy

Implement provider adapters:

- `OpenAiProvider`
- `GeminiProvider`

Each adapter should normalize:

- request format
- timeout handling
- token usage
- response parsing
- safety filtering

### 11.4 Hallucination Controls

- pass only structured numeric context from backend
- require JSON or schema-constrained output when possible
- reject outputs with unsupported values
- log provider mismatches
- show "insufficient data" instead of forcing an answer

## 12. API Design

### Example REST Endpoints

- `POST /api/auth/login`
- `GET /api/stocks/{ticker}/summary`
- `POST /api/analysis/run`
- `POST /api/analysis/{analysisId}/follow-up`
- `GET /api/analysis/history`
- `GET /api/watchlists`
- `POST /api/watchlists`
- `POST /api/llm/compare`

### Example Analysis Request

```json
{
  "ticker": "NVDA",
  "timeframe": "1D",
  "provider": "OPENAI",
  "strategyType": "SHORT_TERM"
}
```

### Example Analysis Response

```json
{
  "ticker": "NVDA",
  "timeframe": "1D",
  "latestPrice": 0,
  "supports": [],
  "resistances": [],
  "setups": [],
  "llmNarrative": "",
  "riskDisclaimer": "This content is for educational use only and is not investment advice."
}
```

## 13. Frontend UX Design

### Main Screens

#### Dashboard

- market overview
- user watchlist
- recent analyses

#### Ticker Analysis Page

- ticker search box
- timeframe selector
- provider selector
- candlestick chart
- support/resistance overlays
- indicator summary cards
- setup recommendation cards
- LLM explanation panel

#### Follow-Up Chat Panel

- ask natural language questions
- maintain context from latest analysis
- show provider name and timestamp

### UX Notes

- numeric levels should be visually separated from narrative text
- confidence and risk warnings should be obvious
- delayed data labels must be visible
- the app should avoid a "buy this now" tone

## 14. Security and Compliance Considerations

### Security

- store API keys in environment variables or a secrets manager
- use JWT or session-based authentication
- rate-limit expensive analysis endpoints
- audit provider calls and user actions

### Compliance / Risk

- display non-advisory disclaimer
- avoid language that implies guaranteed returns
- log generated recommendations for review
- clearly show data timestamp
- require manual user judgment

This is especially important because the product touches financial decision support.

## 15. Observability

The system should capture:

- API latency
- LLM provider latency
- market data provider latency
- prompt failures
- malformed model responses
- analysis success rate
- user interaction history

Suggested tools:

- Spring Boot Actuator
- Micrometer
- Prometheus
- Grafana
- Sentry optional for frontend error tracking

## 16. Suggested Project Structure

### Frontend

```text
frontend/
  src/
    app/
      core/
      shared/
      features/
        auth/
        dashboard/
        analysis/
        watchlist/
        settings/
```

### Backend

```text
backend/
  src/main/java/com/example/tradinginsights/
    config/
    auth/
    marketdata/
    technical/
    setup/
    llm/
    analysis/
    watchlist/
    common/
```

## 17. Implementation Plan

### Phase 1: Foundation

- initialize Angular frontend
- initialize Spring Boot backend
- set up PostgreSQL
- implement authentication
- configure environment and secret management

### Phase 2: Market Data and Analysis Engine

- integrate one market data provider
- build candle retrieval APIs
- implement technical indicators
- implement support/resistance engine
- implement trade setup engine

### Phase 3: LLM Orchestration

- create provider abstraction
- integrate OpenAI
- integrate Gemini
- build prompt templates
- add structured response validation

### Phase 4: Frontend Experience

- build dashboard
- build chart page
- render support/resistance overlays
- build analysis cards
- add chat-style follow-up panel

### Phase 5: Reliability and Governance

- add caching
- add observability
- add prompt logging
- add audit trail
- improve guardrails and disclaimer UX

## 18. MVP Recommendation

For the first working version, keep the product narrow:

- single market data provider
- US stocks only
- 1D and 15m timeframes
- one primary strategy type: short-term swing trading
- OpenAI first, Gemini second
- no brokerage execution
- no portfolio analytics

This will reduce complexity and make validation easier.

## 19. Major Risks

### Technical Risks

- unreliable or delayed market data
- LLM hallucination around price levels
- inconsistent results across providers
- latency if multiple APIs are called sequentially

### Product Risks

- users over-trusting AI-generated outputs
- weak explanation of why a level matters
- poor UX if data freshness is unclear

### Mitigations

- deterministic numeric engine
- strong prompt constraints
- explicit timestamps and caveats
- output validation
- conservative wording

## 20. Recommended Next Steps

1. Confirm the initial market data provider.
2. Confirm whether the first release focuses on swing trading, intraday trading, or both.
3. Define the exact formulas for support/resistance ranking and candidate entry zone generation.
4. Create backend API contracts before UI implementation.
5. Scaffold `frontend/` and `backend/` projects.
6. Build one full end-to-end analysis flow for a single ticker.

## 21. Final Recommendation

The best architecture for this app is:

- Angular + TypeScript frontend for a structured and maintainable UI
- Spring Boot + Java backend for strong service architecture and integrations
- deterministic technical analysis engine for price-level calculations
- LLM orchestration layer for explanation and conversational reasoning
- strict guardrails to prevent unsupported financial claims

This approach is practical, scalable, and much safer than relying on the LLM alone for short-term trading insights.
