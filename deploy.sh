#!/bin/sh

DIST=$(aws cloudfront list-distributions --query 'DistributionList.Items[? Aliases.Items[0] == `dariusduta.dev`].Id | [0]' | tr -d '\"')

echo "Building.."
yarn build > /dev/null 2>&1
echo "Uploading files to S3.."
yarn upload > /dev/null 2>&1

echo "Purging CloudFront cache.."
aws cloudfront create-invalidation --distribution-id $DIST --paths '/*' > /dev/null 2>&1
echo "Done..."
