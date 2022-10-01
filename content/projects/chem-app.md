---
title: "Chem app"
author: "Darius Duta"
date: "2022-08-25"
tags: ["project"]
description: Chemistry learning app
dataFile: chemapp
draft: true

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
contentWidthClass: "w-full max-w-4xl"
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

<!--more-->

{{< github link="https://github.com/dduta065/resume-site" title="Source code" >}}

{{< tech_stack >}}

## Requirements

- Back-end
  - NestJS
    - used [bull](https://github.com/OptimalBits/bull) for a Redis-based queue system
  - Redis
    - store user session tokens
    - used by bull to facilitate the job queue
- Front-end
  - NextJS
    - processes the content from the back-end and renders it to HTML from JSON
    - good performance overall because of SSR
  - Features
    - light/dark mode
    - english/romanian i18n
- DevOps
  - app packaged in a Docker image, uploaded to ECR
  - ECS + EC2
  - GitHub Actions used to deploy to ECS as well
  - CDK used to provision the infra

## Challenges

- Notion API <-> MySQL sync
  - block children
  - parent block `lastUpdatedAt` does not take updates to children blocks into consideration
- AWS
  - Choosing `t4g` EC2 with ARM arch
  - ECS w EC2 model for deployment
- GitHub Actions: build & deploy container images to AWS ECR
  - Docker ARM build with `buildx`
