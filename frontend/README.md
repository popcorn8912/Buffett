# Frontend

Minimal Angular frontend for the Buffett demo.

## Requirements

- Node.js 20+
- npm 10+

## Run

Start the backend first:

```bash
cd /Users/cirun/Desktop/Buffett/backend
mvn -Dmaven.repo.local=../.m2/repository spring-boot:run
```

Then start the frontend:

```bash
cd /Users/cirun/Desktop/Buffett/frontend
npm start
```

Open:

```text
http://localhost:4200
```

## Build

```bash
cd /Users/cirun/Desktop/Buffett/frontend
CI=1 npm run build -- --no-progress
```

## Test

```bash
cd /Users/cirun/Desktop/Buffett/frontend
CI=1 npm test -- --watch=false --no-progress
```
