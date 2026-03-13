# Backend

Simple Spring Boot backend that returns stock summary data and a price line for a ticker.

## Requirements

- Java 17+
- Maven 3.9+

## Run

Use a project-local Maven repository so dependencies stay inside this repo:

```bash
cd backend
mvn -Dmaven.repo.local=../.m2/repository spring-boot:run
```

## Verify

```bash
curl http://127.0.0.1:8080/api/stocks/NVDA
```

## Endpoint

- `GET /api/stocks/{ticker}`

Example response fields:

- `ticker`
- `companyName`
- `exchange`
- `currency`
- `currentPrice`
- `changeAmount`
- `changePercent`
- `prices`
