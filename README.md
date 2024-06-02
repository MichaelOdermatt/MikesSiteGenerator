# Mike's Site Generator

![MikesSiteGen](https://github.com/MichaelOdermatt/MikesSiteGenerator/assets/43145047/84174ad0-a701-479e-9977-496605da2367)

 
Inspired by [this](https://arne.me/articles/write-your-own-ssg) article.

## How does it work?

- Store all the markdown files you intend to convert in the `markdown` folder in the main directory.
- Run the index.js script. Or, using the script in `package.json`, run `npm run exec`.
- Find generated HTML files, and any included CSS and JS files in the `_site` folder.

## What does it do?

It'll take all the markdown files in `/markdown`, render them into a basic HTML template, then output the generated files into the `/_site` folder.

All the markdown parsing is done by [Marked](https://github.com/markedjs/marked).

The markdown files also have support for a [Front Matter](https://jekyllrb.com/docs/front-matter/)-inspired metadata block. The details of the metadata block are listed below.

### Page Title
You can define a page's title in the metadata. Just use the key `title` followed by whatever you wish to title the page.
```
---
title: {Page Title}
---
```

### CSS
Add all your CSS stylesheets to the `/css` folder in the main directory. To link a stylesheet to a page, you use the metadata block. Use the key `stylesheet` followed by the names of the stylesheets you wish to link to that page. If linking multiple stylesheets, separate the names with a comma.

_Make sure to ommit the `.css` at the end of the stylesheets names._
```
---
title: {Page Title}
stylesheet: {Stylesheet1}, {Stylesheet2}
---
```

### JS
Similarly to adding CSS stylesheets to a markdown file, to add JS scripts, you put all your scripts into the `/scripts` folder in the main directory. To link a script to a page, use the key `scripts` followed by the names of the scripts you wish to link to that page. If linking multiple scripts, separate the names with a comma.

_Make sure to ommit the `.js` at the end of the scripts names._
```
---
title: {Page Title}
stylesheet: {Stylesheet1}, {Stylesheet2}
scripts: {Script1}, {Script2}
---
```
