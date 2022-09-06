# Resume-site

Simple personal portfolio website built with [Hugo](https://gohugo.io/) & [Tailwind CSS](https://tailwindcss.com/).

It contains a digital version of my CV (Résumé) and some of the personal projects I've worked on, while helping me keep track of my journey into the field of software.

## Prerequisites

You should have [Node.js](https://nodejs.org/en/) and [Hugo](https://gohugo.io/getting-started/installing/#quick-install) installed.

I also use [yarn](https://yarnpkg.com/) to manage the Node packages.

## Setup

```bash
# Clone repo locally
gh repo clone dduta065/resume-site

# Install node packages
yarn install

# Start the hugo server
yarn start

# Open http://localhost:1313/
```

## Deployment

Run `yarn build` to get hugo to generate the files.  
Run `yarn serve` to serve the generated files locally.

### Notes

- Being a static site generator, Hugo can be deployed very easily by just using a web server to serve the generated files in the `/public/` directory.
- To deploy in a [Jamstack](https://jamstack.org/generators/hugo/) way, I use Amazon **S3** in combination with Amazon **CloudFront**.
- This ensures maximum performance by caching the static pages and gives me the best cost savings, while using the AWS network and CloudFront's points of presence.

## Infrastructure

The AWS infrastructure is fully-automated via [CDK](https://aws.amazon.com/cdk/).

To view the CDK code and find out more, please see [infra/readme.md](/infra/README.md).
