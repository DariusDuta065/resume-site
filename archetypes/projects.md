---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}

author: "Darius Duta"
date: "2022-08-25"
tags: ["markdown", "text"]

math: true
showMeta: true
showToc: true
showBreadCrumbs: true
showReadingTime: true
showWordCount: true
showScrollToTop: true

showAuthor: false
showDate: true
draft: false
---

**Insert Lead paragraph here.**

## New Cool Posts

{{ range first 10 ( where .Site.RegularPages "Type" "cool" ) }}
* {{ .Title }}
{{ end }}
