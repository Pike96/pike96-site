---
title: Use WebSocket + SharedWorker + BroadcastChannel to send a message to all opened tabs
date: "2019-11-14T21:30:52.269Z"
template: "post"
draft: false
slug: "/posts/websocket-sharedworker-broadcastchannel/"
category: "JavaScript"
tags:
  - "JavaScript"
  - "WebSocket"
  - "SharedWorker"
  - "BroadcastChannel"
description: "If the user has opened multiple tabs when visiting your site, you can consider using WebSocket + SharedWorker + BroadcastChannel to broadcast your message to all opened tabs."
---

Your website probably have multiple tabs opened when user is browsing, especially if you have lots of `<a target="_blank">` markup in your pages. Sometimes you may want to push a notification to all user opened tabs, or change a part of of all opened page. You want user to see it immediately, not after a refresh or new visit, WebSocket + SharedWorker + BroadcastChannel might be your choice.

> **NOTICE:** This solution doesn't only support multi-tab situation. It works for all multiple  [`browsing context` ](https://developer.mozilla.org/en-US/docs/Glossary/browsing_context) situations. In this article I use `tab` for simplicity and readability concern.

Here is the flowchart of how this system works:

![WebSocket + SharedWorker + BroadcastChannel System Flowchart](/media/ws_sw_bc.png)

Let me break down the key parts of this diagram.

## WebSocket - long-lived connection
If you want to send information to user as soon as it's available, WebSocket may be your top choice. Instead of making requests from time to time, WebSocket helps you to create a long-lived connection between your server and the user. You can receive information from users and send information to users at any time. Here I only show you the frontend part of it: When you want to open the WebSocket, you only have to do this (will be in the SharedWorker file):
```js
const socket = new WebSocket(YOUR_WEBSOCKET_URL);
```
Then you can handle your logic by adding event listeners:
```js
/**  
 * Add WebSocket listeners.
 */  
function addWebSocketListeners() {  
  socket.addEventListener('open', handleSocketOpen);  
  socket.addEventListener('message', handleSocketMessage);  
  socket.addEventListener('close', handleSocketClose);  
}
```
## SharedWorker - host WebSocket for multiple tabs

Next thing to consider is that the user might have multiple tabs opened. All of these tabs are visiting your website. You want your long-lived connection to work for all these tabs at the same time. It's apparently not wise to open a WebSocket for every tab, because the connection load might be to huge for your server. To reduce the number of WebSocket connections opened, SharedWorker is a perfect place to host a single WebSocket that will handle messages from/to different tabs.

In your tab's JS file, start your SharedWorker port:

```js
function startSharedWorker() {
  if (typeof SharedWorker === 'function') {  
    yourWorker = new SharedWorker(YOUR_SHAREDWORKER_JS_FILE_PATH);  
    yourWorker.port.start();  
  }
}
```
Use `yourWorker.port.postMessage( data );` to send data to your SharedWorker instance.

Then in your SharedWorker js file, handle the connect request from your tab:
```js
function handleSharedWorkerConnect({ports: [port]}) {  
  port.addEventListener('message', handleMessage);  
  // Start is required when using addEventListener. Otherwise called implicitly by onmessage setter.
  port.start();  
}
```
OK. With the WebSocket part of code in your SharedWorker js file, you have setup a SharedWorker instance and connect your tabs to it.

## BroadcastChannel - forward messages to tabs

Now you might think you can send message from SharedWorker to all tabs by doing the same thing as receving messages from tabs: Use `yourWorker.port.postMessage(someData)` and add a `message` event listener in your tab's js context. The problem is that it will only notifies one tab who receives the message first. So we need a BroadcastChannel connection between SharedWorker instance and the tabs.

You have to do `new BroadcastChannel(CHANNEL_NAME)` in both SharedWorker js file and tab's js file.

In your SharedWorker file, you can do

```js
const yourChannel = new BroadcastChannel(CHANNEL_NAME);
```
along with `new WebSocket(YOUR_WEBSOCKET_URL)`. Then 
```js
yourChannel.postMessage( result );
```
to send a message to tabs.

In order for tabs to receive message, you should do:
```js
if (typeof BroadcastChannel === 'function') {
  yourChannel= new BroadcastChannel( 'general' );  
  yourChannel.addEventListener('message', handleMessageFromBroadcastChannel);
}
```
All set. Now you are able to push any notification to all opened types immediately.

## References
- [https://www.infoworld.com/article/2609720/9-killer-uses-for-websockets.html](https://www.infoworld.com/article/2609720/9-killer-uses-for-websockets.html)
- [https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)
- [https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)