---
title: Backslash Hell in JavaScript String
date: "2019-05-13T21:30:52.269Z"
template: "post"
draft: false
slug: "/posts/backslash-hell-in-javascript-string/"
category: "JavaScript"
tags:
  - "JavaScript"
  - "Browser Extension"
description: "When your browser extension or any other front end app needs to add a regular expression field, your back end teammate gave you api response like this:"
socialImage: "/media/42-line-bible.jpg"
---

When your browser extension or any other front end app needs to add a regular expression field, your back end teammate gave you api response like this:
```json
{
	"...": "...",
	"pornHubSearchRegEx": "https?:\/\/www\.pornhub\.com\/video\/search\?search="
	"...": "...",
}
```
'It looks good. I will finish this ticket very soon,' you responded. Because you notice that all necessary backslashes are added. Then you put this string into a `pornHub` object, pass the object to `searchPorns`  function, assign the value to...(Imagine the app function by yourself)... Done. Let me test it:

Boom. Doesn't work. Debug it: Boom. All backslashes are gone.

### Why?
## 1. Equal to:
Let do run these 3 snippets first:
```js
> var pornRgx1 = "https?:\/\/www\.pornhub\.com\/video\/search\?search="
<* undefined
> console.log(pornRgx1)
<* https?://www.pornhub.com/video/search?search=
> "https://www.pornhub.com/video/search?search=ella+knox".search(pornRgx1)
<* -1
```
```js
> var pornRgx2 = "https?:\\/\\/www\\.pornhub\\.com\\/video\\/search\\?search="
<* undefined
> console.log(pornRgx2)
<* https?:\/\/www\.pornhub\.com\/video\/search\?search=
> "https://www.pornhub.com/video/search?search=ella+knox".search(pornRgx1)
<* 0
```
```js
> var pornRgx3 = "https?:\/\/www\.pornhub\.com"
<* undefined
> console.log(pornRgx3)
<* https?://www.pornhub.com
> "https://www.pornhub.com/video/search?search=ella+knox".search(pornRgx3)
<* 0
```
`pornRgx1` doesn't work, but `pornRgx2` and `pornRgx3` do.

The culprit is the equal-to. The equal-to behavior in first line of every snippit does [unescape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape) once. All the backslashes are gone when using `pornRgx1` and `pornRgx3`.  But why only `pornRgx3` works?

Let's look at all the special characters in `pornRgx1`:
- *The 1st question mark*:  It has no backslash, so it's doesn't change after the unescape. And it still works as lazy quantifier as what we want it to do in the beginning.
- *All forward slashes*: Although sites like [RegExr](https://regexr.com/) prompts a error 'Unescaped forward slash', modern browsers' javascript compiler can still correctly recognized it. So they are fine.
- *All dots*: It matches any character so it also works..... hmm... but not perfect. A link with `wwwwpornhub.com` may fail the check, but it's almost impossible to encounter in practice.
- ***The last question mark***: Same to the 1st question mark, it works as lazy quantifier. But it's not what we want it to do! Only `searchsearch` or `searcsearch` can match it.

Conclusion: If a link we want to check has to have a question mark (in most cases it's the start of a parameter), we must be careful about the backslashes. This problem will not surface until we have question mark (not lazy quantifier) in the link. Unfortunately, `pornRgx3` might be a more often case, which means your project's ex-developer may leave a farewell ~~gift~~ bug for you! Go check your code now my friend.

#### How to avoid?
Why I call it backslash hell? Because if you have 5 equal-to's in different places and you don't remove them, you will need 2^5 = 32 backslashes for the question mark at least, like this:
```
"https?://www.pornhub.com/video/search\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\?search="
```
If you add backslashes for all the characters that should have, you will see:
```
"https?:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/www\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\.pornhub\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\.com\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/video\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/search\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\?search="
```
I'll lose interest to porns.

So, try to avoid using any equal-to when the string has regex. If you think you have to, try to use `JSON.stringify(pornRgx2)` and `JSON.parse(pornStr2)`. This will turns your regex into a well-handled string. But it is still a problem for browser extension, which introduces the 2nd reason:

## 2. String sanitizer (probably extension only)
This is probably a browser extension only issue. If you try to do things like `chrome.tabs.executeScript` and pass your regex as part of the string, you gonna watch out. Because how the browser escape and unescape your string is a total blackbox. Luckily, Chrome handles it very well. No matter what api you use, in the execution environment, they just give you exactly the same string you passed into. You can add your own sanitizer to escape the string if the number of backslashes is not expected.

However, there is a different story for Firefox. `browser.tabs.executeScript` doesn't give you the same string in the execution environment. So you may write a sanitizer by yourself to add backslash before escaping. And you will find: No matter how you adjust, there is always missing/extra backslashes.... 

But `browser.tabs.sendMessage` does not have the same problem, since you can pass any object directly instead of escaping it into a string. Before you send the message, you can use `browser.tabs.executeScript` to add a listener, make the entire callback of the listener an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) if you don't want to pollute the tab's `window` object. The callback can have all the scripts you want to inject and take the parameters you passed in by `sendMessage`, which is below `injectScript`. You can directly use the regex no matter it lives in an object or as a standalone string. Just remember:  Avoid equals.
