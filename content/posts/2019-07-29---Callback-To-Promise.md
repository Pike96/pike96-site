---
title: Rewrite Your Callbacks to Promises
date: "2019-07-29T22:01:53.314Z"
template: "post"
draft: false
slug: "/posts/callback-to-promise/"
category: "JavaScript"
tags:
  - "Promise"
  - "JavaScript"
description: "Callbacks are disgusting flies in the delicious ES6 soup. Refactor them to use promises only."
---

In my Angular project with promises everywhere, we should avoid using callbacks. You may have many cutting-edge stuffs based on ES6 in your project, but callbacks are just like disgusting flies in the delicious soup. So you might want to refactor your code to use promises only.

## Simple rewrites: Use `setTimeout` / `setInterval` and `async` / `await`

For the function in your project, it's pretty easy to just return the promise. [`setTimeout` / `setInterval`](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals) is a very common case of callback function. While if you are using a framework, you should avoid using `setTimeout` / `setInterval`. Because you have component lifecycle, that's where you should differentiate the timing of your tasks. But my case is that I am working on the script injected to an unknown webpage. I cannot use framework. Anyway, here is the way to rewrite `setTimeout`:

```typescript
const delay = t => new Promise(resolve => setTimeout(resolve, t));
```

[`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) is the way that I recommend to consider if the logic contains multiple steps. Your program will become very concise if you use it. Let me show you how good it is when using the function `delay` with `await`:

```typescript
await delay(1000);  
while (checkIfReachedLimit(param1, param2)) {  
  doItOnce(param3); 
  await delay(500);  
}
```
This snippet is to do an action over and over again until reaching the limit. It's pretty concise, and, pretty safe too. `await` just divides your function into different switch cases after the code is compiled to ES5 standard, you don't need to worry about the scope issue, whether param 1, 2 and 3 are accessible or up-to-date. But if you use `setTimeout` directly, it becomes pretty complicated. If `setTimeout` is within the while loop, every time it will add an event to JavaScript event loop queue. Add you need to think about what is the status of the params... That's a headache!

## Not my job...?
I am working on browser extension. So lots of functions that I used, are provided by Chrome. In their API document, they only provide callback as a parameter. You probably experience the same story when using some other 3rd party libraries. So it's not my job... isn't it? We can still refactor those functions!

This is how to do it for `chrome.tabs.create`:

First, the signature of the function in [Chrome's API document](https://developer.chrome.com/extensions/tabs#method-create) is:
```
chrome.tabs.create(object createProperties, function callback)
```
Promise version: 
```typescript
openNewTab(url: string, active?: boolean): Promise<TabState> {
  return new Promise((res, rej) => {
    chrome.tabs.create({ url: url, active: active },
      (tab: chrome.tabs.Tab) => {
        var error = chrome.runtime.lastError;
        if (error) {
          console.error('Failed to create tab:', error);
            rej(error);
        }
        else {
          console.log(`Created tab with id ${tab.id}`; // Do your things
          res();
        }
      }
    );
  });
}
```
The idea is simple: Return a new promise. Reject it if having error, otherwise resolve it. The implementation is also simple: `await this.openNewTab('https://pike96.com', true);`. I believe this one-line implementation will make your code very concise. 

Here Chrome and other browsers' API has a special error handler. The error information is stored in `chrome.runtime.lastError`. So I need to get and print the error information before reject the promise.

After I use this method for `chrome.tabs.query`, `chrome.tabs.remove`, `chrome.alarms.clear`, I am not satisfied with this method also. The error handler seems verbose. That leads to one step further:

## Improvement: callbackDecorator
Talk is cheap, show you the code: 
```typescript
/**
 * This function converts all callbacks to promises and handle error
 * @param errorFuncName: The function name in error message.
                         e.g. browserApi.tabs.get
 * @param func: The function to execute. e.g. chrome.tabs.create
 * @param params: The parameter array to be passed in func
 * @param callback (optional):
     The rewritten callback function. It takes func's results as parameters.
 *   Can put any logic in it, then returns the item that needs to be resolved.
 */
public callbackDecorator = (
    errorFuncName: string,
    func: Function,
    params: any[],
    callback?: Function
) => {
  const paramsCopy = params; // To show parameters if having error
  return new Promise((res, rej) => {
    // callbackArgs: Parameters passed into callback function
    func(...params, (...callbackArgs) => {
      const error = chrome.runtime.lastError;
      if (error) {
        console.error(
          `Chrome API Error: ${errorFuncName}(${paramsCopy.join(', ')}):`,
          error.message);
        rej(error);
      }
      else if (callback) {
        res(callback(...callbackArgs));
      }
      else {
        res();
      }
    });
  });
};
```
Implementation:
```typescript
this.xxxService.callbackDecorator('tabs.create', chrome.tabs.create,  
  [{ url, active }], (tab: chrome.tabs.Tab) => 
    console.log(`Created tab with id ${tab.id}` // Do your things
);
```

A confusing pair of names in this function is `params` and `callbackArgs`:
- `params` is the parameters to be passed into `chrome.tabs.create`. `paramsCopy` is to avoid confusion.
- `callbackArgs` is the parameters of the callback function.

Here [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) is used for unknown parameters, and this is literally a lifesaver: The `callbackArgs` can have any number of parameters including 0. `callback` is still optional which is the same as the original function signature in [Chrome's API document](https://developer.chrome.com/extensions/tabs#method-create). To make it easier, I didn't set `params` as optional because `callback` must be optional. So if no parameter should be passed into the function. **`params` has to be `[]`**.

It is how I do it in my case. I want to encapsulate the error handler. You can encapsulate anything that happens before `rej()` or before `res()`. You can have callback in `rej()` also. Probably you will save much more lines of code in you project!

Note: I have another article [expirable-synchronized (A JS decorator to safely make function atomic)](/posts/expirable-synchronized/), I call both "decorator". You may notice that they looks very different. Because `@expirableSynchronized` is a decorator in annotation, while this `callbackDecorator` function is a decorator inline. I would rather call `@expirableSynchronized` "annotation" if the [documentation](https://github.com/tc39/proposal-decorators) doesn't call it "decorator".
