---
title: Errors after MongoDB Replica Set Restart
date: "2020-02-02T16:51:31.254Z"
template: "post"
draft: false
slug: "/posts/mongodb-replica-set-failure/"
category: "DevOps"
tags:
  - "DevOps"
  - "MongoDB"
description: "I adjusted the machine types of 3 MongoDB instances, but authorization lost and no PRIMARY member error happen to my replica set..."
---

## Problem
I have 3 instances running MongoDB as a replica set: `mongo-1`, `mongo-2` and `mongo-3`, One is PRIMARY member and other 2 are SECONDARY. I adjusted the machine types of these three instances so they restarts at the same time. However, my main Java application keeps restarting after around 40 seconds.

When I looked into the docker logs of the Java app, two entries drew my attention:
```
Unauthorized: not authorized on admin to execute command
 { replSetHeartbeat: "rs",
 ...
```
```
No server chosen by WritableServerSelector
...
Waiting for 30000 ms before timing out
```
Then I ssh in to the MongoDB instances and went into `mongo` shell, `mongo-1` has the prompt `rs:SECONDARY>` and the other two are `rs:OTHER`. And inside the mongo shell, any `rs.xxx()` command gives me `Unauthorized` error.

So what breaks down is clear:

- The authorized user doesn't have enough permission to do replica set operations like sending a heartbeat any more.
- When shutting down all SECONDARY and PRIMARY member instances, there are no PRIMARY member in the replica set. The replica set becomes unavailable because there is no writable member, while my Java app needs one.

## Solution
1. Stop the `mongod` you want to set to PRIMARY. Stop the container if using `docker run`. Remove the container if using `docker-compose`.
2. Remove all authorization and replica set settings in:
	- arguments (if starting using command): `--auth`, `--keyFile`. `--replSet`
	- or settings (if starting use .conf file): 
```
security:
    keyFile: <string>
    authorization: <string>
    oplogSizeMB: <int>
replication:
    replSetName: <string>
```
3.  Start the `mongod` directly or by docker. You should see the empty prompt `>` and warnings of not in replica set and using root user.
4. Grant root role to the current user on `admin` database:
```
db.grantRolesToUser( "<username>", [ { role: "root", db: "admin"} ] )
```
5. Exit the mongo shell and add authorization and replica set settings back. Log into the mongo shell again using the user you want to use.
6. The prompt is still `rs:SECONDARY>` now. Make it PRIMARY by these two commands:
```
rs:SECONDARY> cfg = { _id: "rs", members: [ { _id: 0, host: "123.23.111.3:27017" } ] }
rs:SECONDARY> rs.reconfig( cfg, { force:true } )
```
7. Now check `rs.status()`, it should be fine now. My Java app is running again immediately after this step.
8. (Optional) Remove the root access you gave to the user by `db.revokeRolesFromUser()`

## References

Set to PRIMARY part of the solution: [http://doc.okbase.net/2426299/archive/180088.html](http://doc.okbase.net/2426299/archive/180088.html)
