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
