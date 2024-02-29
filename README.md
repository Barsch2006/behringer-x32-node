# Behringer X32 OSC Implementation in Node.js

Typescript/Node.js implementation of the Behringer X32 OSC API. It is using the `osc-min` library for encoding and decoding OSC messages and was tested on Node.js `v20.10.x`.

## Usage Warning

This library is very limited in its current state. It only supports a few commands from the X32 OSC API. Since this state does not change, I will not publish it to a package manager. If you want to use it, you have to install it directly from github on your own risk.

## Installation

npm does not support git repositories as dependencies so you have to use yarn to install this package directly from github till I publish it to npm

```bash
yarn add https://github.com/Barsch2006/behringer-x32-node
```

Import in typescript

```typescript
import { X32 } from 'x32-node';
```

## Implementated Commands

| Implemantation | OSC Command |
| --- | --- |
| `X32Console.load`| `/load` |
| `X32Console.save`| `/save` |
| `X32Console.delete`| `/delete` |
| `X32Console.copy`| `/copy` |
| `X32Console.rename`| `/rename` |
| `X32Console.loadScene `| `/-action/goscene` |
| `X32Console.lock` <br> `X32Console.setLock` <br> `X32Console.unlock`| `/-stat/lock` |
| `X32Console.setSendsOnFader`| `/-stat/sendsonfader` |
| `X32Console.setLeftFaderBank` | `/-stat/chfaderbank` |
| `X32Console.setRightFaderBank` | `/-stat/grpfaderbank` |
| `X32Console.clearSolo` | `/-stat/clearsolo` |
| `X32Console.setTalkback` | `/config/talk/enable` <br> `/config/talk/A/dim` <br> `/config/talk/A/latch` <br> `/config/talk/A/level` <br> `/config/talk/B/dim` <br> `/config/talk/B/latch` <br> `/config/talk/B/level` |
