---
title: "Chem app"
author: "Darius Duta"
date: "2022-11-09"
tags: ["project"]
description: Chemistry learning app
dataFile: chemapp
draft: false

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

This app is meant to help high school students in their final two years of study prepare for the admission exam of the University of Medicine and Pharmacy Bucharest.

During the admission exam, candidates are expected to answer 100 questions, of which 40 can be about organic chemistry, in two and a half hours. Based on their performance, some of the candidates will go on to study medicine for the next six years; a part of them will have to pay a yearly tax, while a minority of students will even receive a monthly merit bursary.

<!--more-->

{{< github link="https://github.com/users/dduta065/projects/3" title="Source code" >}}

{{< tech_stack >}}

## Context

My mother has been teaching biochemistry at the university and has been working with college students wanting to become medics for the past 30 years. She has always wanted to simplify the information and make it as logical as possible while also benefitting from digitalisation in a country where the government is not actively looking to integrate technology in the public education system.

Wanting to change the status quo, she allied with a colleague of her and they asked me if it was possible to build a simple web app where they could create their own lessons in digital format. The goal is for their students to always have the information with them by using a phone or a laptop to access the app anytime.

## Requirements

After a few conversations with mum and her colleague, the requirements were simple to establish; the solution had to be:

- **Self-managed** --- the teachers should be able to manage all the students and assigns them into different _tutoring groups_.  
These groups then receive access to the different lessons, based on their actual progress in the tutoring sessions.
- **Semi-private** --- without an account, nothing can be seen from the exterior — the website should not be indexed by Google or other search engines.
- **Mobile-first** --- almost all students are between 17 and 19 years old;  
Having straightforward access to the learning material at all times from just their smartphones is key to their success at the admission exam.
- **Simple to maintain** --- the app should allow teachers to author their content and lessons, and ocassionally make use of images and PDF files. Throughout the academic year, my involvement in maintaining the app should also be minimal.

## Tech stack

- Some aspects I was especially interested in of the stack were over-engineered, while others are very minimal.
- Providing a solution to this problem but also experimenting a bit more with technologies I'm interested in.
  - see how GraphQL works in more detail and implement it myself from A to Z once to better contrast it with the familiar RESTful model.
  - use NestJS for the back-end, in combination with TypeScript, instead of plain JS.
  - build a blog using Notion’s API and Databases, after having heard that their databases API is enjoyable and some devs have even built fully-fledged apps using Notion as their CMS.

### Backend

- CMS --- Notion
  - provides a simple, user-friendly way to author content, just like Markdown, but much more visual and guided
- Back-end
  - NestJS
  - GraphQL
  - Logs are being sent to CloudWatch
  - The backend code is unit tested, and there are a couple of higher level E2E tests performed on the API.
- Data storage
  - MySQL --- I chose to use a relational DBMS because I was curious to see how an ORM in the JS/TS ecosystem compares with other projects such as .NET's Entity Framework or Laravel's Eloquent ORM.
    - [TypeORM](https://typeorm.io/) makes for a very enjoyable development experience, and is quite powerful in combination with its CLI and the native TypeScript support for data types (via annotations).
    - A NoSQL document database such as AWS DynamoDB or MongoDB would've been a better fit, since Notion's SDK returns JSON and that could've simplified the block aggregation process.
  - Redis --- stores user session tokens and is also used by Bull to facilitate the asynchronous job queue.

### Frontend

- Front-end
  - NextJS
    - processes the content from the back-end and renders it to HTML from JSON
    - good performance overall because of SSR
  - Features
    - light/dark mode
    - english/romanian i18n

### DevOps

- DevOps
  - app packaged in a Docker image, uploaded to ECR
  - ECS + EC2
  - GitHub Actions used to deploy to ECS as well
  - CDK used to provision the infra
  - two environments: dev (`dev.cduta5.com`, usually deployed only when needed, to avoid costs) & prod (`cduta5.com`)
  - environments mapped to different AWS accounts as per AWS best practices, using AWS Organizations

## Challenges

### Notion Database Synchronisation

- Notion API <-> MySQL sync
  - block children
  - parent block `lastUpdatedAt` does not take updates to children blocks into consideration

### Running on ARM64

There are more and more consumer-grade computers that run on ARM these days; Apple have started the trend by ditching their Intel partnership after having developed their own in-house chips based on the ARM architecture.  
In October 2022 Microsoft have also announced [Project Volterra](https://blogs.windows.com/windowsdeveloper/2022/10/24/available-today-windows-dev-kit-2023-aka-project-volterra/), the Windows Dev Kit that's based on ARM and is meant to encourage devs to port their Windows applications to ARM64.

On the cloud, ARM is not a novelty anymore; AWS has already introduced the 3rd generation of their Graviton ARM processors, promising even better compute performance and cost savings at the same time.

I wanted to see whether I could somehow port the app and all its dependencies to ARM and make use of the new `t4g` series of EC2 instances. Fortunately, docker has added support for [multi-arch images](https://www.docker.com/blog/multi-arch-images/) with its `buildx` tool in 2019. After a few fiddly npm packages and choosing the right base image, I was able to deploy the containers on `t4g` servers.

The biggest disadvantage is that the build time rose from under a minute to around 8 minutes when the CI/CD pipeline builds it now, since `buildx` has to convert every instruction from x64 to ARM64 under the cover, but that's to be expected.

## Possible improvements

- Better secrets management overall by integrating SSM Parameter Store (or Secrets Manager) for keys and tokens.
- Generating the pages with NextJS ([NextJS Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)) every 15 minutes instead of on every request.
  - Doing this should save some resources since most of that computation is based on older data that's updated every 15 minutes
- Hosting the images and PDFs on own S3 buckets instead of relying on Notion
  - Notion's API provides a pre-signed URL that's only valid for 1 hour; this validity period cannot currently be altered or specified at all.

## Conclusions

The app has already been in production for 3 months and, so far, the feedback has been positive; the students like the minimalism of the website, since the main area of focus is the content itself, not what facilitates it.

Being able to use ECS with EC2 reserved instances means the whole solution is around £10 per month per environment for the 2 EC2 instances and the other AWS services used (such as DNS, CDN, network traffic, logs, backups, etc...).

Currently, the app serves around 100 students which log in at different times of the day from various user agents (indicating the students are using their smartphones to access the site at any time they like, just as intended).

Hopefully this initiative will help more people get into medicine, as the Romanian national health system needs skilled doctors now more than ever.
