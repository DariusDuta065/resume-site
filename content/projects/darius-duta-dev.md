---
title: "dariusduta.dev"
author: "Darius Duta"
date: "2022-08-25"
tags: ["project"]
description: My personal website
dataFile: dariusdutadev

math: true
showMeta: true
showToc: true
showBreadCrumbs: true
showReadingTime: true
showWordCount: true
showScrollToTop: true
showMetaInList: false

showAuthor: false
showDate: true
contentWidthClass: "max-w-4xl"
---

I wanted to create this website mainly to share more about myself online and the side projects I’ve been working on, while also helping me keep track of my progress throughout my career.  
Another objective of mine is to become a better writer and a better communicator, especially when having to communicate technical concepts in simple words.

<!--more-->

{{< github link="https://github.com/dduta065/resume-site" title="Source code" >}}

## Tech Stack

{{< tech_stack >}}

## Requirements

The requirements for this website were easy to establish, especially after looking at several other personal websites:

- Quick to build
- Great performance
- Uncomplicated maintenance
- Cheap to run
- Simple to automate & deploy

With the added benefit of teaching myself a new technology (Hugo), I was very keen to work on a small blog with very little JavaScript involved, and later on, automate every possible aspect of its deployment and operation.

### Why Hugo?

I chose [Hugo](https://gohugo.io) for this small project because I have already tried `go` and I found it very easy to grasp the fundamentals and differences from other languages — the way packages work, error handling, and the concurrency model based on message-passing with *goroutines* and *channels* for communication.

*Maintainability* is straightforward with Hugo; working with a couple of markdown files is enough to update or add new content to the website.

*Performance* is unbeatable when it comes to hosting a static website on the cloud today; all generated files are either HTML or other types of assets (images, web fonts, CSS, JS), and putting everything behind a CDN such as CloudFront makes everything load instantly regardless of the user’s location.

This also gives another advantage in terms of *cost performance and savings*. Hosting this Hugo static website costs almost nothing, because of the massive economies at scale of AWS and the consumption model. A Route53 hosted zone costs $6/year and the domain itself is $12/year.

With minimal effort put into configuring CloudFront’s caching behaviour, I was able to achieve the maximum score on Google’s Lighthouse test on both desktop & mobile categories.

{{< figure src="images/lighthouse_test_results.png" title="Lighthouse test results" align="center" >}}

Hugo is not a silver bullet for every application, but it was good enough for my needs at this time. Apps that need to serve user-generated dynamic content with transient data, or need to make API calls externally and serve beautiful dynamic views still lend themselves better to a SPA library or framework (like React or Angular).
