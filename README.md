# Mike's Site Generator
 
Build for my very narrow use case and inspired by [this](https://arne.me/articles/write-your-own-ssg) article.

## How does it work?

- Store all the markdown files you intend to convert in the `markdown` folder in the main directory.
- Run the index.js script.
- Find generated HTML files in the `_dist` folder.

## What does it do?

It'll take all the markdown files in `/markdown`, render them into a basic HTML template, then spit out the generated files into the `/_dist` folder.

All the markdown parsing is done by the script and so, is only intended to support very fundamental markdown syntax.

## What else am I interested in adding?

- Support for a few more markdown elements.
