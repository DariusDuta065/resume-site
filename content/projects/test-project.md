---
title: "Test Project"
date: 2022-09-03T01:29:28+01:00

author: "Darius Duta"
date: "2022-08-25"
tags: ["project"]

math: true
showMeta: true
showToc: true
showBreadCrumbs: true
showReadingTime: true
showWordCount: true
showScrollToTop: true

showAuthor: false
showDate: true
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

<!--more-->

## New Cool Posts That Have Long Titles

Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Morbi non arcu risus quis varius quam quisque id diam.

```bash
QUERY='DistributionList.Items[? Aliases.Items[0] == `dariusduta.dev`].Id | [0]' 
DIST=$(aws cloudfront list-distributions --query $QUERY | tr -d '\"')

echo "Building.."
yarn build > /dev/null 2>&1
echo "Uploading files to S3.."
aws s3 cp \
  --recursive ./public s3://dariusduta.dev > /dev/null 2>&1
# --cache-control max-age=31536000

echo "Purging CloudFront cache.."
aws cloudfront create-invalidation \
  --distribution-id $DIST \
  --paths '/*' > /dev/null 2>&1
echo "Done..."
```

Pulvinar sapien et ligula ullamcorper malesuada proin libero nunc. Volutpat consequat mauris nunc congue nisi. At varius vel pharetra vel turpis nunc eget. Metus aliquam eleifend mi in nulla. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et. Aliquam ut porttitor leo a diam. Pellentesque eu tincidunt tortor aliquam nulla. Velit scelerisque in dictum non consectetur a. Interdum posuere lorem ipsum dolor. Diam ut venenatis tellus in metus vulputate eu scelerisque felis. Libero volutpat sed cras ornare arcu. Adipiscing commodo elit at imperdiet. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim.

Diam ut venenatis tellus in metus vulputate eu scelerisque felis. Scelerisque eleifend donec pretium vulputate sapien nec sagittis. Bibendum neque egestas congue quisque egestas. Tortor at risus viverra adipiscing at in. Sed cras ornare arcu dui vivamus arcu. Duis at consectetur lorem donec massa sapien faucibus et. Nullam ac tortor vitae purus faucibus ornare suspendisse. Adipiscing elit pellentesque habitant morbi tristique senectus. Elementum sagittis vitae et leo duis ut diam quam. Felis donec et odio pellentesque diam. Eu nisl nunc mi ipsum. Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida. Gravida arcu ac tortor dignissim convallis aenean et. Adipiscing enim eu turpis egestas pretium aenean pharetra magna ac. Turpis egestas sed tempus urna et pharetra pharetra. Amet dictum sit amet justo donec enim diam vulputate ut. Nullam ac tortor vitae purus faucibus ornare suspendisse.

{{< highlight bash "linenos=inline" >}}
QUERY='DistributionList.Items[? Aliases.Items[0] == `dariusduta.dev`].Id | [0]' 
DIST=$(aws cloudfront list-distributions --query $QUERY | tr -d '\"')

echo "Building.."
yarn build > /dev/null 2>&1
echo "Uploading files to S3.."
aws s3 cp \
  --recursive ./public s3://dariusduta.dev > /dev/null 2>&1

echo "Purging CloudFront cache.."
aws cloudfront create-invalidation \
  --distribution-id $DIST \
  --paths '/*' > /dev/null 2>&1
echo "Done..."
{{< / highlight >}}

Euismod in pellentesque massa placerat duis ultricies lacus. Eget felis eget nunc lobortis mattis aliquam faucibus purus. Et ligula ullamcorper malesuada proin. Sed arcu non odio euismod lacinia at. Pellentesque habitant morbi tristique senectus et netus et malesuada. Amet nisl suscipit adipiscing bibendum est ultricies. Ornare suspendisse sed nisi lacus sed viverra tellus in. Urna molestie at elementum eu. Lacinia quis vel eros donec ac. Posuere urna nec tincidunt praesent semper feugiat. Venenatis tellus in metus vulputate eu scelerisque. Facilisi nullam vehicula ipsum a arcu cursus vitae. Nunc vel risus commodo viverra maecenas accumsan lacus vel. Bibendum est ultricies integer quis auctor elit sed vulputate mi. Vitae tortor condimentum lacinia quis vel eros donec ac. Cras sed felis eget velit aliquet sagittis id. Ipsum consequat nisl vel pretium lectus quam id leo in. Pharetra diam sit amet nisl suscipit adipiscing. Vehicula ipsum a arcu cursus vitae congue mauris rhoncus.

Neque sodales ut etiam sit amet nisl purus in mollis. Tincidunt nunc pulvinar sapien et ligula. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam. Et molestie ac feugiat sed lectus vestibulum mattis. Blandit massa enim nec dui nunc. Suspendisse sed nisi lacus sed viverra. At tempor commodo ullamcorper a lacus vestibulum. Suspendisse interdum consectetur libero id faucibus. Semper risus in hendrerit gravida. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam.

Ac tortor vitae purus faucibus ornare. A scelerisque purus semper eget duis at tellus at urna. Nullam non nisi est sit amet. Elementum integer enim neque volutpat ac tincidunt vitae semper. Mi sit amet mauris commodo quis imperdiet massa tincidunt. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Tempor id eu nisl nunc mi ipsum faucibus. Nunc aliquet bibendum enim facilisis gravida neque convallis. Mattis molestie a iaculis at erat pellentesque. Arcu dictum varius duis at consectetur lorem donec massa sapien. Dapibus ultrices in iaculis nunc sed. In est ante in nibh mauris cursus. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Diam phasellus vestibulum lorem sed risus ultricies. Nec tincidunt praesent semper feugiat nibh. Quis vel eros donec ac. Imperdiet proin fermentum leo vel orci porta. Amet dictum sit amet justo donec enim diam vulputate ut.
