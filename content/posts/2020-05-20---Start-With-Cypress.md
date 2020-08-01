---
title: Start with Cypress for your Frontend Project Testing
date: "2020-05-20T22:01:53.314Z"
template: "post"
draft: false
slug: "/posts/start-with-cypress/"
category: "JavaScript"
tags:
  - "Test"
  - "Cypress"
  - "JavaScript"
description: "Consider using Cypress when you create a new frontend project or your project doesn't have any test code before. It's simple and powerful."
---

When you searching for a test framework to add to your front-end project, you probably end up with lots of results:

Jest, Jasmine, Mocha, AVA, Tape, Selenium, Protractor, WebdriverIO, Nightwatch, Appium, TestCafe, Puppeteer, PhantomJS, CodeceptJS, ...
...
...

At this point of time (mid 2020), I find a great answer for huge chunks of code that doesn't have test code, after trying out some of them. My answer is [Cypress.io](https://www.cypress.io/).

## Easy to use
- **Installation**:
The installation is simple, you only have to add the package into your project. If you use test frameworks based on a webdriver like Selenium, you'll have some extra work to do to [download the right webdriver file](https://www.selenium.dev/downloads/) for your browser, and you have to worry about the version match between you webdriver and your browser. Cypress has everything built-in, no need to worry about these things. It will automatically find all compatible browsers on your machine.

- **Interaction**
After installed it, you can open its test runner, a simple electron app. It looks like this:

![Cypress Test Runner](/media/cypress-test-runner.jpg)

Source: https://docs.cypress.io/guides/core-concepts/test-runner.html

Whenever you create or change a test file, the test runner can hot-reload it in a very short time. This UI is beautiful also, isn't it?
## Functionalities

In blogs that compares different test frameworks, almost all of them like the Cypress idea. But most of them said that it lacks some functionalities that other frameworks have. After I did some research, it's no longer the case. Let me list what Cypress can do as a test framework:

- A configurable test launcher,
- Able to have test structure for [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development),
- [Assertion functions](https://docs.cypress.io/guides/references/assertions.html),
- Interactive testing progress, results and error handlers (in [Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html)),
- [Stub and Spy](https://docs.cypress.io/guides/guides/stubs-spies-and-clocks.html),
- Snapshot testing (using [cypress-plugin-snapshots](https://www.npmjs.com/package/cypress-plugin-snapshots) plugin),
- Code coverage report (using [code-coverage](https://github.com/cypress-io/code-coverage) plugin),
- E2E Browser controlling, and
- Visual regression testing (using [cypress-visual-regression](https://www.npmjs.com/package/cypress-visual-regression) plugin).

These covers almost all what you want a test framework to do. For simple functionalities, you don't even need a extra plugin.

## Practices of adding it to your huge codebase


In my use case, I have a huge codebase with multiple JavaScript files and many independent pages. There was no any unit test or E2E test code in this repository. Here are some tips if you have similar situation as me:

- **Start writing unit tests for utility functions**
Cypress is also a great tool to write unit tests for your functions. It has concise grammar for you to write it, just like [Mocha](https://mochajs.org/). Adding test for utility functions can help you avoid those fundamental errors. Those ones are hard to trace back when you try to find the bug when the app is running.
- **Write E2E tests for those unreadable code**
If some pieces of the code has lots of deprecated parts, or isn't encapsulated well, it's a headache to write test for it. E2E tests are useful in this case. You can focus on the results of the code part and pay less attention to how it's done.
- **Try to use TDD  when developing new functions**
When you have a large codebase without test code and it runs well, usually it means the developers worked on it are very good at Behavior-Driven Development (BDD). By writing some tests using Cypress, you can try the Test-Driven Development (TDD) style. It will save you a lot of time for paying technical debts. It will be easier to balance these two styles of development when you writing new functions.

## Reference:
[https://docs.cypress.io/guides/](https://docs.cypress.io/guides/)
[https://juejin.im/post/6844903970222112776](https://juejin.im/post/6844903970222112776)
https://www.browserstack.com/guide/tdd-vs-bdd-vs-atdd

