# My DVD Collection

[![EffVer Versioning](https://img.shields.io/badge/version_scheme-EffVer-0097a7)](https://jacobtomlinson.dev/effver)
![ts](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?logo=jest)](https://github.com/jestjs/jest)
![GitHub repo size](https://img.shields.io/github/repo-size/Boffinbox/MyDVDCollection?label=Repo%20size&logo=github&style=flat-square)
![total lines](https://tokei.rs/b1/github/Boffinbox/MyDVDCollection?category=lines)

**MyDVDCollection** is a place for digitally tracking your DVDs, Blu-Rays, CDs, Books, and more. Scan barcodes, store them to your collections, and check against them when out shopping to see if you already own a piece of physical media. Just scan the item, and MyDVDCollection will tell you if you own it!

# Tech

This project is built using a traditional [MERN tech stack](https://www.mongodb.com/resources/languages/mern-stack). Main packages used are in no particular order:

- [Joy UI](https://mui.com/joy-ui/getting-started/) for the client side styling
- Jest/SuperTest for the server unit testing
- [Tanstack Query, Router, and Virtual](https://tanstack.com/), for routing and state management
- [React Barcode Scanner](https://reactbarcodescanner.vercel.app/) to parse barcode images from webcam
- [Typegoose](https://typegoose.github.io/typegoose/) to help define Mongoose schema


# Motivation

A common problem I was running into when out [charity shopping](https://en.wikipedia.org/wiki/Charity_shop) was whether my disabled brother already owned a copy of a given media. He owns over a thousand unique items of children's media; at this point, he must have *nearly* every children's show that was on TV in the UK when he was growing up. Too frequently, I would scalp a bargain DVD, only to find he already owns it.

This website resolves this problem, by allowing users to scan for duplicates of barcodes. Whilst the intended target is DVDs, under the hood, this app can be used for *any* barcode cataloging, regardless of whether it's EAN, UPC, ISBN, etc.


# Contact

If you wish to contact me about my website, you can open an issue on this page, or contact me [through GitHub.](https://github.com/Boffinbox)