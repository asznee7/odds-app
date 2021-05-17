# odds-app

## Getting started

You can run the app with Docker (preferred) or directly.

### Docker:

1. Create `.env` according to the example.
2. Start the app with:

```
docker compose up
```

### npm:

Requires node (at least v14) and mongodb (tested on the latest version) installed locally.

1. Create `.env` according to the example or pass environment variables by other means.
2. Install dependencies:

```
npm install
```

3. Start the app:

```
npm start
```

## Additional info

Once running, the current odds from cache are available at `http://localhost:8082/odds` with the following params: `matchId`, `bookmakerKey`, `marketKey` (optional, defaults to `h2h`).

Example:

```
curl 'http://localhost:8082/odds?matchId=0d7aa75146894df88ca2a39f6dd55ee7&bookmakerKey=unibet'
```
