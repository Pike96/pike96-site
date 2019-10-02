---
title: Boolean Algebra Helps Generate if Statements
date: "2019-03-06T15:51:22.651Z"
template: "post"
draft: false
slug: "/posts/boolean-algebra-helps-generate-if-statements/"
category: "General Programming"
tags:
  - "General Programming"
description: "Think about boolean algebra when you are struggling with writing if statements."
---

Although now I am a full-time Front-end engineer, I still have to introduce myself as an Electrical Engineering graduate, since my latest diploma's title is Master of Science Electrical Engineering. But I am so kind that I have given all my knowledge back to my professors. Recently I just picked up some lost memories when struggling with writing if statements.

The situation is that: I am a stupid guy. I feel like my mind has only one stack, and `static readonly brainStackSize = 5`. Because when I want to write some logic with more than 5 Boolean variables, I start to lose myself in the maze of: When A is true and B is false, we can say... Wait... It will be a different story if considering C... Wait... It will be another different story if considering D... To make it clear, let's start over. When A is true and B is false, we can say... Wait, I'm back.

In my project, I have 7 Boolean variables. I tried to combine any two or three into a new one to make it simpler, but no combination works. They are just independent. So I put all situations into a truth table. Theoretically, there will be 2 ^ 7 = 128 rows for my truth table. But luckily, not all of them are possible, and some rows can be grouped together with same results. So I successfully reduced the table to 48 rows. Hooray! Much easier!

I have three kind of results R, S and T. So the truth table looks like:

| Index | A | B | C | D | E | F | G | Results |
|--|--|--|--|--|--|--|--|--|
| 0/4/8/12=000XX00 | 0 | 0 | 0 | X | X | 0 | 0 | R |
| ...... |
| 47=0101111 | 0 | 1 | 0 | 1 | 1 | 1 | 1 | T |
| 98/102=1100X10 | 1 | 1 | 0 | 0 | X | 1 | 0 | S |
| 115/119=1110X11 | 1 | 1 | 1 | 0 | X | 1 | 1 | T |

At least I have got something to judge my logic, although I still don't have any idea of how to write it. But then I think: Can I generate the logic from this truth table?

After some research, the final solution is using something I learnt from my university's course Digital Design: Karnaugh map. I can generate 3 expressions for R, S and T by using Karnaugh map to do simplification. You can find various tools by googling 'online karnaugh map calculator'. I got these 2: 
- [Online Karnaugh Map Calculator](https://leventozturk.com/engineering/karnaugh/)
- [Karnaugh Map Solver](https://www.charlie-coleman.com/experiments/kmap/)

 Then just do some clicks on the truth table in the website. If the situation is impossible, set the value to '-' or 'X' instead of 0 or 1. Then you will get an expression like this:
```
R = B'CF' + CD'F' + B'CG + CD'G
```
Then you convert it to Product Of Sum form using [Boolean Expressions Calculator](https://www.dcode.fr/boolean-expressions-calculator):
```
R = (B' + D') * C * (F' + G)
```
If you think the expression is still not simplified enough, you can simplify further using [Laws of Boolean Algebra](https://www.electronics-tutorials.ws/boolean/bool_6.html). Product Of Sum form may not be the best because you want the least number of operators and variables appearance to make the if statements shorter.

Ok. Now you have got your if statement:
```js
if (C && (!B || !D) && (!F || G)) {
	results = R;
}
```
It looks so good!

## Pros and Cons
#### Pros: 
- You don't need to write test cases. Because correct truth table plus correct generating process can exactly means that all tests have been passed. You generated the code from test cases.
#### Cons: 
- Unreadable: Sometimes your `!F || G` doesn't really make sense. Other code reviewers may have a hard time on understand the logic. If yours are readable, you are lucky!
- Takes a long time to modify: If your PM says: "In this morning's meeting, we decided to change the behavior of our XXX to enhance user experience..." Then you need to:
	1. Update your truth table
	2. Generate Boolean expressions
	3. Simplify Boolean expressions

	Especially updating the truth table, it is really a time killer.

So if your code doesn't require a very good readability and your PM doesn't change the logic often. You can try this way. For me, I had to give up this solution because I hit both restrictions. So I had to write all test cases to make everyone in my team happy. Furthermore, another guy in my team is clever enough (`brainStackSize > 7 || brain.hasConfigurableStackSize || !brain.isUsingStackToStore`) to handle all 7 variables. But I don't regret. It's a funny try. At least it reminds me of knowledge learnt in some school days, which makes me feel younger...