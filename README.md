# Mike's Site Generator

![MikesSiteGen](https://github.com/MichaelOdermatt/MikesSiteGenerator/assets/43145047/84174ad0-a701-479e-9977-496605da2367)

 
Inspired by [this](https://arne.me/articles/write-your-own-ssg) article.

## How does it work?

- Store all the markdown files you intend to convert in the `markdown` folder in the main directory.
- Run the index.js script.
- Find generated HTML files in the `_site` folder.

## What does it do?

It'll take all the markdown files in `/markdown`, render them into a basic HTML template, then output the generated files into the `/_site` folder.

All the markdown parsing is done by the script and thus, is only intended to support very fundamental markdown syntax.

Examples of all the features listed below can be found in the project's example pages.

### Page Title
To define the page's title I added support for a YAML front matter inspired block, which can be added to the top of the page. Here's what it looks like. Just use the key `title` followed by whatever you wish to title the page.
```
---
title: {Page Title}
---
```

### CSS
Add all your CSS stylesheets to the `/css` folder in the main directory. To link a stylesheet to a page, you use the same YAML-insipired block mentioned above. Use the key `stylesheet` followed by the names of the stylesheets you wish to link to that page. If linking multiple stylesheets, separate the names with a comma.

_Make sure to ommit the `.css` at the end of the stylesheet names._
```
---
title: {Page Title}
stylesheet: {Stylesheet1}, {Stylesheet2}
---
```

### Headers
Header parsing works exactly how you'd expect. To add a header just start a new line with any number of `#`'s. The number of `#`'s specifies the size of the header.  
```
# This will be wrapped in an <h1> tag
## This will be wrapped in an <h2> tag
### This will be wrapped in an <h3> tag
... etc
```

### Custom HTML Elements
The parsing will wrap any disconnected text blocks in `<p>` tags. There's also support for custom HTML elements in your markdown. If you decide to add one just make sure it's placed on a new line, separated from any non-HTML text blocks.

Good
```
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
<img src="{image address}"/>
Morbi vitae felis id sem placerat auctor.
```
Bad
```
Lorem ipsum dolor sit amet, consectetur adipiscing elit. <img src="{image address}"/>
Morbi vitae felis id sem placerat auctor.
```

### Line breaks
And lastly if you want to start a new paragraph just hit enter twice (two successive line breaks).

```
{paragraph 1} Lorem ipsum dolor sit amet, consectetur adipiscing elit.


{paragraph 2} Morbi vitae felis id sem placerat auctor.
```
