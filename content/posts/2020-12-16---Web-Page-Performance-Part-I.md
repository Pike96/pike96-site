---
title: Must-Knows About Web Page Performance (Part I Why And Rendering Optimization)
date: "2020-12-16T15:42:24.136Z"
template: "post"
draft: false
slug: "/posts/web-page-performance-part-i/"
category: "Web Page Performance"
tags:
  - "Web Page Performance"
  - "JavaScript"
description: "You need to improve yoru web page performance for better user experience and SEO. Let's breakdown the rendering process to see what's going on."
---

This article will only cover topics about rendering for web page performance. It gives you a start on how to look at the For detailed strategies, check this long article: [Front-End Performance Checklist 2021 — Smashing Magazine](https://www.smashingmagazine.com/2021/01/front-end-performance-2021-free-pdf-checklist/). You can use it as a dictionary to look up.

## Why We Need Better Page Performance

1.  **Improve User Retention & Conversion Rate**: Users are more impatient than you think. As the front end evolves, our web pages become more and more complex, and at the same time the web speed suffers. But users expect to use your site to accomplish something faster. If you provide a feature to the user, they will take it for granted that they will use it smoothly to achieve a certain goal. So they won't evaluate your site on the basis of whether the feature is completed or not. Instead, they will focus on the process of using it. (Reading: [Amazon Found Every 100ms of Latency Cost them 1% in Sales - GigaSpaces](https://www.gigaspaces.com/blog/amazon-found-every-100ms-of-latency-cost-them-1-in-sales))

2. **Search Engines Care!** Despite all the scandals we hear about Google, they are really serving their users in this matter: Google, and other search engines, use website performance as an important metric to determine rankings in Search Engine Results Pages (SERP). It's hard to quantify the impact of these metrics on rankings, but Google has been increasingly reminding developers about them in recent years, so their impact cannot be underestimated. Google provides a great article about [Web Vitals](https://web.dev/vitals/) and Core Web Vitals. Belows are the images from the article which briefly describe the 3 Core Web Vitals from Google:
![Largest Contentful Paint](/media/lcp.svg)
![First Input Delay](/media/fid.svg)
![Cumulative Layout Shift](/media/cls.svg)

## [RAIL model](https://web.dev/rail/)

In addition to Google's own Web Vitals metrics, the RAIL model is commonly used when judging whether a web page has a "good enough" peformance. You can simply use it to determine if your website is in an urgent need of optimization.

- Response: process events in under 50ms

- Animation: produce a frame in 10 ms (60 fps)

- Idle: maximize idle time

- Load: deliver content and become interactive in under 5 seconds

## [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path?hl=zh-cn)

Here is the flow chart of Critical Rendering Path.

![Critical Rendering Path](/media/critical-rendering-path.svg)

This is the path used by the browser when loading the page. But after that, when we change something on the page, not all steps need to be performed. Layout and Paint are the two steps with the most cost, and the ones we want to avoid as possbile. So we have another 2 terms corresponding to them: Reflow, action that triggers the layout step & Repaint, action that triggers the paint step.

### Reflow & Repaint
Generally, how can we not trigger the reflow or repaint? Layout step only cares about the elements' position and size. If we don't change it, we won't trigger reflow, Changes like background color and shadow size. These changes will only trigger the Repaint process. Some operations can use GPU to speed up, they don't trigger either reflow or repaint, only composite step will be performed. Adjusting `transform` and `opacity` css properties are such kind of operations.

In terms of the things we can do, we should avoid reflow. There are lots of articles to help you minimize reflows: [Web Performance: Minimising DOM Reflow / Layout Shift](https://betterprogramming.pub/web-performance-dom-reflow-76ac7c4d2d4f)

### Layout Thrashing
It means there are too many reflows in a short amount of time. Usually happens when you read & change the DOM or elements' styles in JavaScript. You can avoid by:

- Add/Remove class in JS. Let CSS handle the styles
- If we have to operate on DOM or elements' styles. Try to minimize the actions that triggers reflow, you can:
    - Cache the value when accessing the properties that trigger reflow
    - Combine change actions into one. Detach from document flow and attach it after all operations are done.
    - Use `requestAnimationFrame` inside a high-frequency event to utilize browsers rAF to make the animations smooth. Just put the logic inside rAF's callback.
