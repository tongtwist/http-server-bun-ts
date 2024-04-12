# http-server-bun-ts

Pure Typescript HTTP Server based on Bun TCP sockets, from scratch.

Zero libraries, zero dependencies, zero ChatGPT, 100% man made and DIY.

---

This is a rewrite in Typescript using the native Bun TCP API of my solution to the
["Build Your Own HTTP server" Challenge](https://app.codecrafters.io/courses/http-server/overview).

[![progress-banner](https://backend.codecrafters.io/progress/http-server/bfca46c3-f83f-4fc0-97d6-dc95608ab3a3)](https://app.codecrafters.io/users/codecrafters-bot?r=2qF)

[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) is the protocol that powers the web. In this challenge, you have to build a HTTP/1.1 server that is capable of serving multiple clients.

This server is build on top of native Bun 1.1 native API, avoiding its builtin HTTP Server (DIY or not?), meaning that it is a pure TCP server, and it can parse and serve concurrent [HTTP request syntax](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html) requests, and more.

## Just launch it by:

```sh
$ bun src/main.ts [--directory <staticFilesDirectory>]
OR
$ bun start [--directory <staticFilesDirectory>]
```

## Even Faster version:

Just bypass the Typescript transpilation by bundle sources into a unique compact javascript file:

```sh
$ bun run bundle
```

Then start this file:

```sh
$ bun app/main.js
```

## Portable executable binary

If you want to distribute this program as a standalone executable binary, thanks to Bun, you can do it by:

```sh
$ bun run build
```

You should now have an executable file named "http-server" at the root of your directory.
