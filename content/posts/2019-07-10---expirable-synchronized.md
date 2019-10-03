---
title: expirable-synchronized (A JS decorator to safely make function atomic)
date: "2019-07-10T22:03:41.241Z"
template: "post"
draft: false
slug: "/posts/expirable-synchronized/"
category: "JavaScript"
tags:
  - "Decorator"
  - "JavaScript"
  - "Promise"
description: "I wrote a decorator to solve the concurrency problem of promises and published to npm. Waiting for you to take a look and try!"
---

It's an npm package that I wrote: [https://www.npmjs.com/package/expirable-synchronized](https://www.npmjs.com/package/expirable-synchronized). Lots of details has been already included in README. So here I just want to tell you the story of the development... 

## The problem to solve
When I developing browser extension, there is a bug when adding a event listener for the [`onBeforeWebRequest`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest) event:

(`onBeforeWebRequest` event is triggered every time before a web request happens in the browser)

We do several things within this event listener, including read a value and update it. Both read & update actions are asynchronous. This event may be triggered 10 times within 1 second. So in most of the time, the order of reads & updates in every function call is:
1. 1st Read
2. 2nd Read
3. 3rd Read
4. 1st Update
5. 4th Read
6. 2nd Update
7. ...

While what we expected is:
1. 1st Read
2. 1st Update
3. 2nd Read
4. 2nd Update
5. 3rd Read
6. 3rd Update
7. ...

Wait, this looks like the common concurrency problem in Java! 

In Java, the concurrency problem is caused by multiple threads. But here in JavaScript, the concurrency problem is caused by multiple function calls. Since JavaScript is single-threaded, probably it's not good to use the word 'concurrency'. An `async` function call with some `await`s is literally a set of [microtasks](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) in JavasScript. So we need to reorder these microtasks in this way:

### Objectives
1. Make sure the jobs within one function happen in order
2. Make sure the function calls happen in order

According to these information of the problem, I write the [Use Case part in README](https://github.com/Pike96/expirable-synchronized#use-case):
> When you want to use it & Other solutions if you don't really need it:
> -   The function has asynchronous jobs and the order matters. (Otherwise, you don't need to do anything.)
> -   The function is not called by your program, or it's hard to manage the function caller. A typical example is event listener. (Otherwise, you should improve your code where the function caller is in.)
> -   You need the expiration. (Otherwise, consider using RxJS's  [asyncScheduler](https://rxjs-dev.firebaseapp.com/api/index/const/asyncScheduler), schedule in a subscription.)
> -   If RxJS is too big for your project to include. (Otherwise, RxJS is your answer.)

You might notice that there is a RxJS solution that I tried. It was a success. But why I still wrote this npm package?

## A Successful Solution

After I figured out the problem, I googled for solutions. Since I am building an Angular app, I find that **RxJS** is a very powerful library that can manage the data and events. [`asyncScheduler`](https://rxjs-dev.firebaseapp.com/api/index/const/asyncScheduler) in RxJS can schedule task as if you used `setTimeout(task, duration)`, put the tasks on the JavaScript event loop queue. So if we schedule the same task for multiple times, only one task can run async jobs. The following tasks are waiting in the event loop queue, until the current task has done all of its jobs.

So here is how I implemented for this solution on the `onBeforeWebRequest` problem:
```typescript
// Producer
_onBeforeWebRequest = new Subject<chrome.webRequest.WebRequestDetails>();  
onBeforeWebRequest = this._onBeforeWebRequest.asObservable();

// Consumer
let beforeWebRequest = (details: chrome.webRequest.WebRequestDetails) => {  
  this._onBeforeWebRequest.next(details);  
};
chrome.webRequest.onBeforeRequest.addListener(beforeWebRequest,
  { urls: ['<all_urls>'], types: ['main_frame'] }
);

// Subscription
onBeforeWebRequest.subscribe((details: chrome.webRequest.WebRequestDetails) => {
  asyncScheduler.schedule(async () => {
    await this.onBeforeWebRequest(details);
  });
});
```
It runs perfectly. But my manager pointed out a problem: What if one job's promise is never resolved? We should add an expiration for every job. If one promise expires, don't block the following jobs. This makes me consider writing something by my own, which finally becomes this npm package.

## expirable-synchronized
First I came up with a solution without expiration. Unlike RxJS, I used a different strategy. The core part in my strategy is the **Promise Chain**. Everytime there is a new function call, put all jobs (promises) into the promise chain. When the chain only has promises from one function call, I don't need to care because there are already connected (promise will only start after the previous one resolved). But when the function is called when the promises in chain hasn't finished, I add it into the promise chain instead of directly running it. 

To manipulate the promise, I find that only a pointer is required, which points to the latest promise of a function call. When all jobs in promise chain has finished, just clear the pointer. I chose to store the pointer in the function caller. I am still looking for a better place to store it.
Here is the code of pointer & point clearance definition, promise connection and promise clearance: 
```typescript
// target[ pName ]: The pointer to build the promise chain  
const pName = prefix + funcName;  
const clearLastPromise = () => {  
  target[ pName ] = null;  
};

// Function execution promise  
const applyDecoratee = () => original.apply( this, args );  
const initPromise = new Promise( res => {  
  res( 'Sentinel/Dummy Promise' );  
} );  
if ( !target[ pName ] ) {  
  // If pointer is empty, run it  
  target[ pName ] = initPromise;  
}  
target[ pName ] = target[ pName ]  
 .then( applyDecoratee )  
 .catch( applyDecoratee );

// Clear the pointer after done  
target[ pName ] = target[ pName ]  
 .then( clearLastPromise )  
 .catch( clearLastPromise );  
return target[ pName ];
```
Then I spent a long time on how to add the expiration to a promise. Finally I find the solution is not to add something to a promise. The idea is to create a timeout promise and let it race with function execution promise. Only the winner can be added to the promise chain:
```typescript
// Timeout promise  
let timeoutId;  
const timeoutPromise = new Promise( ( resolve, reject ) => { 
  // timeoutId is for clearTimeout function
  timeoutId = setTimeout( () => {  
  reject( `Synchronized function timed out in ${life} ms.` );  
 }, life );  
} );

// Race 2 promises. Only winner will be in the promise chain  
target[ pName ] = Promise.race( [ target[ pName ], timeoutPromise ] )  
 .then( () => {  
  clearTimeout( timeoutId );  
 } ) .catch( () => {  
  clearTimeout( timeoutId );  
 } );
```

Since I am writing in TypeScript , it's very natural for me to think about using [decorator](https://github.com/tc39/proposal-decorators). Since Java has the `@synchronized` annotation, I named my decorator to `@expirableSynchronized`. 

I cannot find other way to intercept a function other than decorator. But since both stage-0 decorator and promise start to be supported in ES6, it's fine.

## An Easier Mode
The solution that I came up with acts like a fair lock on the function. All the jobs and tasks are executed in the order of coming in. But sometimes what we need is just run it once, and don't let following function call disturb the first function call. So I wrote an easier mode with expiration.

The idea is pretty simple: 
- Create a lock for the function call in the caller.
- Set it to true when the function starts and set it false when it ends.
- The whole thing will only run when it's false.
- If the current one expires, release the lock to false

```typescript
// Lock this function  
target[ lock ] = true;

// Function execution promise  
...

// Timeout promise
...

// Race 2 promises. Only winner will be in the promise chain  
promise = Promise.race( [ promise, timeoutPromise ] )  
 .then( () => {  
  // Release the lock  
  target[ lock ] = false;  
  clearTimeout( timeoutId );  
 } ) .catch( () => {  
  // Release the lock  
  target[ lock ] = false;  
  clearTimeout( timeoutId );  
 } );
```

## After I developed this great decorator...
Sadly but true, the bug in my project was trivial. So it's not wise to take the risk of adding such a big and new stuff into the project. So it's not in my company's product, and this is why I published to npm. I will be very happy to see anyone test my decorator and use it. I will be even happier to see an issue posted on the repository. I don't even mind if it's an angry comment...