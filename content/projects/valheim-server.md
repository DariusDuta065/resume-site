---
title: "Valheim game server"
author: "Darius Duta"
date: "2022-09-25"
tags: ["project"]
description: Fully automated game server running on AWS
dataFile: valheimserver

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

[Valheim](https://store.steampowered.com/app/892970/Valheim/) is an indie survival game inspired by the Viking Age, developed by a team of five developers in Sweden called [Iron Gate studio](https://irongatestudio.se/).

{{< github link="https://github.com/dduta065/valheim-aws" title="Source code" >}}

{{< tech_stack >}}

{{< figure src="images/valheim-server/valheim_screenshot.webp" title="Valheim is about survival & creativity" alt="Valheim is about survival & creativity" align="center" >}}

## Requirements

Valheim is a co-op game that is meant to be played with a couple of friends. For that to happen, the game requires a game server that loads the world and to which the players connect.

The game can do this automatically and host the server on your computer; however, the binaries of the game server are also provided, in case you want to run it yourself on a remote machine.

The problem is that hosting the game locally meant that whenever the host wanted to stop playing, the whole server would stop and kick everyone else out.

The solution requires a dedicated server in a data centre that can run uninterrupted; this would eliminate the need for a particular player to host the game and the dependency of everyone else on that person.

<!-- The game server requires the x86 architecture, so the latest EC2 instances that use the [Graviton](https://aws.amazon.com/ec2/graviton/) processors cannot be used. At a minimum, the server also requires at least 4 GBs of memory. To meet these requirements, I chose to use `t3a.medium` instances. -->

Manually doing this is easy, but leaving the game server to run 24/7 can quickly become expensive.

The main reasons to automate are:

- Cost savings --- limitting the time the game server runs reduces the AWS bill
- Exploring AWS further --- using interesting tech such as the ASG Lifecycle Hooks

In terms of requirements, the solution must:

- be able to start & stop as quickly as possible for the best playing experience
- automatically stop the game server at night to prevent accidental costs
- use `t3a.medium` instances, since x86_64 arch is required by SteamCMD & the game server requires 4 GBs of memory
- use Ubuntu as the underlying operating system, as recommended by LinuxGSM

## LinuxGSM

[Linux Game Server Managers](https://linuxgsm.com/) is a command-line tool that helps to start game servers and manage them. It provides a consistent API and supports many [different games](https://linuxgsm.com/servers/) (currently around 126).

A server managed using LinuxGSM can quickly be re-purposed to host an entirely different game just by changing some of the arguments passed to `linuxgsm`.  
<!-- Even then, LinuxGSM will take care of all the different dependencies required by the game server and get the server up and running. -->

I always use LinuxGSM to host a game server as efficiently as possible and I found it to be a great [open-source project](https://github.com/GameServerManagers/LinuxGSM).

## Manual configuration

Before starting to automate the game server instance, I had to find out what the minimum script to get the server working was.  
The following commands are all that's needed to fetch the latest savefiles from S3 and start the game server after:

```bash
# Download latest backed-up files from S3
aws s3 cp s3://valheim-aws/ ./s3_files/ --recursive

# Install the game server
wget -O linuxgsm.sh https://linuxgsm.sh
chmod +x linuxgsm.sh
bash linuxgsm.sh vhserver

./vhserver auto-install

# Restore latest backup
cd ~/s3_files/
tar -xf latest.tar.gz

cd backup/
mv vhserver.cfg ~/lgsm/config-lgsm/vhserver/
mkdir -p ~/.config/unity3d/IronGate/Valheim/
mv Valheim/ ~/.config/unity3d/IronGate/

./vhserver start # Start the game server
```

Placing these commands in the `user data` is enough to get the EC2 instance to automatically get the latest save files from S3 and start the game server.

## Automation

The real challenge in automating the previous script is making sure that whenever the game server starts, the game resumes from where it was left during the last gaming session.

For that to work, the instance must store the savefiles somewhere (= S3) in-between two gaming sessions, when no instance would be running. Thus, the EC2 instance performs the following tasks:

- when the instance is being **created** --- the EC2 instance fetches the latest savefiles from S3 and then starts the game server
- when the instance is being **terminated** --- the EC2 instance uploads the savefiles & other necessary files to S3, overwriting the previous *latest* savefiles

Running a script that configures an EC2 instance when it is first created can be done in many ways; on this occasion, I am using `cfn-init` to download & run a bash script that would do the actual configuration for my simple use case. The bash script is very similar to the one from [Manual Configuration](#manual-configuration), but excludes the game server installation phase.

An Auto Scaling Group is used to control whether the instance is on or off by adjusting its *desired capacity* (either 0 or 1); its *minimum capacity* is 0 and the *maximum capacity* is 1.

Modifying the ASG's `desired_capacity` is a nice technique to control the game server, but using the AWS CLI to do this is not ideal.
  <!-- - there needs to be a publicly-accessible API, so that any player can start the game server whenever they wish to play the game -->

### Controlling the server

To make it easy to control when the game server runs, a Lambda function exposes a minimal HTTP API that provides the *start*, *stop*, and *status* functions:

- the `start` command --- sets the ASG's `desired_capacity` to `1`
- the `stop` command --- sets the ASG's `desired_capacity` to `0`
- the `status` command --- used to see whether the server is running or not
  - also returns its IP address so the players know where to connect to

The Lambda exposes a [function URL](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html), which is a much simpler way to allow HTTP access to a function, especially when compared to provisioning an API Gateway just for one function.

{{< figure src="images/valheim-server/valheim_diagram_1.svg" title="The user calls the Lambda to start/stop the game server" align="center" >}}

### Improving start-up times

The original plan was to install the game server every time the instance was started, but doing that would take around 7 minutes for the game server to properly start so that the players could join. That's a long time to wait, especially when you wish to start playing as soon as possible.

The only way to avoid installing the game server every time is to use pre-baked AMIs. To keep things automated, I tried to use EC2 Image Builder, but it turned out to be incredibly slow for the few shell commands I needed to run (took around 40 minutes to produce an AMI).
<!-- Another disadvantage to using the EC2 Image Builder is that Amazon does not provide Level 2 CDK Constructs and I would have to use Level 1 `Cfn` constructs, diminishing CDK's power a bit. -->

Diverting away from the AWS ecosystem was the key to this issue --- [HashiCorp's Packer](https://www.packer.io/), along with its Amazon plugin, is much more faster and feels more reliable; Packer needs only 5 minutes to generate the same AMI that EC2 Image Builder took 40 minutes for. The [code](https://github.com/dduta065/valheim-aws/blob/master/packer/valheim-aws.pkr.hcl) is also very easy to understand.

After changing the CDK code to use the Packer-generated AMI, the effective time until players could join the server was reduced from 7 minutes to just under **2** minutes.

### Stopping the server

When terminating the game server, the main goal is saving the progress between two gaming sessions by uploading the savefiles to S3 before terminating the instance.

Because the game server is controlled by the *desired_capacity* of the ASG, using [EC2 Auto Scaling lifecycle hooks](https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html) makes a lot of sense; the lifecycle hooks are fully integrated with ASGs and enable developers to execute commands on any instance that's part of the auto scaling group whenever a scale-in or scale-out event occurs.

This process is reliable since it is serverless & fully-managed by AWS; the hooks send *autoscaling* events to EventBridge whenever they happen; afterwards, they wait for a pre-configured timeout period or a `complete-lifecycle-action` API call, whichever happens first; only then the EC2 instance is fully terminated.

EventBridge integrates with many other AWS services. For this use case, SSM Run Command is the most-efficient way to execute a few bash commands on the EC2 instance that's being terminated. The shell commands upload the files to S3 and then signal the completion of the lifecycle hook.

The following diagram shows an overview of the stopping process:

{{< figure src="images/valheim-server/valheim_diagram_2.svg" title="Overview of how game progress is saved between sessions" alt="Overview of how game progress is saved between sessions" align="center" >}}

### Preventing accidental costs

Accidentally leaving the server running negates one of the many benefits of automation: cost savings.  
Fortunately, because of the Lambda function that controls the ASG's desired capacity, stopping it every night is effortless.

An EventBridge Scheduled Rule that invokes the Lambda every night at 3 AM with the `stop` command is enough to prevent any surprise on my AWS bill at the end of the month.

## Conclusion

This was a very fun weekend project for me; I really liked the flexibility the EC2 Auto Scaling Lifecycle Actions give us and the kind of solutions that can be built just by making use of these lifecycles.

The main motivation behind this mini-project was cost performance — running a `t3a.medium` instance 24/7 would cost around £30 per month. Assuming that in total I will only need the server to run for 40 hours per month, the total bill for everything would be just under **£2**.

The game server starts very quickly (because of the pre-baked AMIs built by Packer) and players can usually start joining the game within 2 minutes; the performance is great (my latency is around 9ms from Manchester to `eu-west-2`).

Accidental costs are also prevented since EventBridge automatically stops the server every night in case it was mistakenly left running.

<!-- One advantage of this is that it can be repurposed easily — instead of it being a game server, it could be a dev environment that gets provisioned every morning and is automatically destroyed after the work day ends. -->

<!-- I believe this is a good solution that is very performant, since it runs on AWS hardware, and also cost efficient. -->

By far the most enjoyable aspect of this project is the fact that one HTTP request is enough to start the game server and it allows players to continue their game seamlessly from where they left off the last time they played :tada:.
