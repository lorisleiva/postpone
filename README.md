# Postpone 🦥
Small TypeScript library making it easier to handle complex asynchronous tasks.

## Installation

```shell
npm install postpone
```

## Usage

```ts
import { Postpone } from "postpone";

Postpone.make(async () => "Hello")
  .tap(v => console.log(v))
  .pipe(v => `${v} world`)
  .tap(v => console.log(v))
  .pipe(v => [v, v, v])
  .tap(v => console.log(v))
  .map(() => Math.round(Math.random() * 100))
  .tap(v => console.log(v))
  .run(); // <- The promise is only executed at this point.

// Console outputs:
// "Hello"
// "Hello world"
// ["Hello world", "Hello world", "Hello world"]
// [12, 94, 23]
```
