---
title: Boolean Naming Conventions
date: "2019-08-22T21:37:54.417Z"
template: "post"
draft: false
slug: "/posts/boolean-naming-conventions/"
category: "General Programming"
tags:
  - "General Programming"
description: "Start your boolean name with an auxiliary verb."
---

There are a bunch of boolean variables in this function:
```js
function stockDrop(us, china) {
	if (us.tariffIncreased || china.tariffIncreased) {
		china.stockDrop = us.stockDrop = true;
		panel["china"].showGreenLines = true;
		panel["us"].showRedLines = true;
	}
	if (donaldTrumpSaysIStillLoveXi) {
		china.stockDrop = false;
	}
}
```
Do you think the variables' names are good?

I don't think so. So I came up with 2 rules to rename these variables. Let me show you the results before I elaborate the rules and why I use them:
```js
function handleStockDrop(us, china) {
	if (us.hasTariffIncreased || china.hasTariffIncreased) {
		china.willHaveStockDrop = us.willHaveStockDrop = true;
		panel["china"].shouldShowGreenLines = true;
		panel["us"].shouldShowRedLines = true;
	}
	if (donaldTrump.isStillLovingXi) {
		china.willHaveStockDrop = false;
	}
}
```

If you don't think it's better. Probably you can just ignore this article.

## Conventions
1. For any boolean variable or function who returns a boolean value, the variable/function name starts with an [auxiliary verb](https://en.wikipedia.org/wiki/Auxiliary_verb#List_of_auxiliaries_in_English)  
2. Try to avoid using an auxiliary verb to start the name of any non-boolean variable or function who doesn't return a boolean value.
3. Auxiliary verb suggestion:  Choose based on the current stage / state of what's described in the name: 
	- `hasTrumpTwittered`
	- `isTrumpYelling`
	- `shouldTrumpBuildWall`
	- `isTrumpTrustWorthy`.

## Benefits
#### 1. We can know it is boolean or non-boolean function/variable by the name.
In JavaScript, the data type is not indicated. You might forget the data type written by yourself a long time ago, not to say other developers who want to use the function / variable. Code reviewers have a harder time of inferring the type, since they don't have IDE to track down the definition.

#### 2. Grouped together
The auxiliary verbs that you use may be very limited. Common used ones are `is`, `has`, `should` in my project. So every time I type `if (`, "OK I need to type boolean variables next." This is the first thing comes into my mind. Then I only need to consider the state of this variable / function, my IDE's IntelliSense can list all boolean members for me after I type `is`.
#### 3. Close to natural language
If replace all special characters to some English words, it becomes a very readable pseudo code: 
```js
function handleStockDrop(us, china)
	if (us hasTariffIncreased or china hasTariffIncreased) {
		china will have Stock Drop? = us will have Stock Drop? yes;
		panel of china should Show Green Lines? yes;
		panel of us should Show Red Lines? yes;
	}
	if (donald Trump is Still Loving Xi) {
		china will Have Stock Drop? no;
	}
}
```
I think writing code is like writing an article. Fluency is important. So it's better to include some English grammar to make it more readable. Auxiliary verbs do a great job.

There is a derivative benefit: When I type `isDonaldTrumpStillLovingXi`, I realize that it's probably better to make  `donaldTrump` an object. It improves my object oriented design.

#### 4. More details in the name
We know the state of the thing or the stage of the event of the current variable or after the function finishes. So we can infer whether the function / variable is reasonable in the context without looking into the function / variable's definition.

## Drawback
Long. The name is too long.

In my project, `should` is used quite frequently. It will be hard to read if it's hard to abbreviate or omit some words in the name. (e.g. `shouldTrumpFireFedChairmanIn2019Sep`)

If the logic is long, it will be more pain:
```
if (!shouldTrumpFireFedChairmanIn2019Sep || !shouldTrumpFireFedChairmanIn2019Oct) {
```
If your code don't have these bothersome long names. Try my boolean naming convention.