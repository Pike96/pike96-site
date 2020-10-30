---
title: Different Space Characters in HTML
date: "2020-10-19T12:33:42.354Z"
template: "post"
draft: false
slug: "/posts/different-space-characters-in-html/"
category: "HTML"
tags:
  - "HTML"
  - "Whitespace"
description: "Look at the iPhone Compare page, there's a whitespace inconsistency bug that's a bit annoying"
---
The new iPhone 12 series is out. Have you compared it to the iPhone 11 series to see what are the upgrades? You might think you've got every single point on the compare page. You must haven't noticed this one: 

![iPhone 11 and 12 Compare Page in apples.com](/media/iphone-compare-whitespace-bug.png)

The space between the phrase "spatial awareness" is different in iPhone 11 and 12. The two `<p>` container elements' sizes and styles are the same. So the whitespace is the culprit.

We can imagine that the new front-end developer just copied and pasted the whole field without checking the exact match between the contents. And there's no testing did find this problem. The consequence is that the user might think: "Oh these two fields are different. Is this an upgrade? No! They are the same words!" Well, we've got new proof of Apple is paying less attention to user experience...

Look into this difference. We can see the difference is in the space character (or whitespace character if you prefer to call this way) between the two words "spatial" and "awareness". So I wrote this blog to discuss some types of space characters that we use in HTML.

## 1. [Regular Space](https://en.wikipedia.org/wiki/Space_(punctuation))

It's the most common space that we see. You probably never saw the HTML entity of this space character. It's `&#32;` in decimal or `&#x20;` in hex, which represents the [ASCII code 32 in the table](https://www.techonthenet.com/ascii/chart.php). You didn't see it because very few people use it. It's the same character as you press the space button when typing a string. When you search for `&#32;` in Google, the search results are the same. Notice that the links of your search results are different because Google escapes a regular space as a plus sign `+`. But the search results page link for `&#32;` is escaped into `%26%2332%3B` because you did type 5 characters instead of one space character.

To validate they are the same, I compared them as HTML markups `innerHTML`. And of course the formatted `textContent` is the same also:

```js
> element1.innerHTML = "space&#32;test"
> element2.innerHTML = "space&nbsp;test"
> temp1.innerHTML === temp2.innerHTML
< false
> temp1.textContent === temp2.textContent
< false
```

## 2. [Non-breaking Space](https://en.wikipedia.org/wiki/Non-breaking_space)

We can see that Apple used to think that the phrase "spatial awareness" should not be broken into two parts when displaying in the iPhone 11 section. So they use a [non-breaking space](https://en.wikipedia.org/wiki/Non-breaking_space) between the two words. It prevents an automatic line break at its position. 

This character that we usually use is `&nbsp;`. It also has decimal representation `&#160;` and hex `&#xA0;`. But they don't convey the meaning of this character so we don't use them in most cases.

It just looks the same as the regular space on a web page if there is no line break issue. But when you compare them as HTML markups (`innerHTML`) or formatted `textContent`, they are different.

```js
> element1.innerHTML = "space&#32;test"
> element2.innerHTML = "space&nbsp;test"
> temp1.innerHTML === temp2.innerHTML
< false
> temp1.textContent === temp2.textContent
< false
```

In this iPhone compare page, we have a typical use case for this space character. Apple wants to draw our attention to this technology without breaking it into two parts. Well done Apple! But what a pity that you missed it in iPhone 12 series!

## 3. [Other Special Space Characters](https://en.wikipedia.org/wiki/Whitespace_character)

You can see [a full table of these white spaces](https://en.wikipedia.org/wiki/Whitespace_character#Definition_and_ambiguity). I was surprised when I first knew that there are so many different space characters. They are different in width, whether causes a line break and so on. I don't know much about when to use them. But it seems that using them in normal use will cause inconvenience and inconsistency.


## Conclusion

Don't trust your eyes when you see whitespaces. If it looks weird to you, make sure to inspect them to check the HTML code of it.
