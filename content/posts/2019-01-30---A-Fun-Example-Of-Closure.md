---
title: A Fun Example of Closure
date: "2019-01-30T20:35:23.212Z"
template: "post"
draft: false
slug: "/posts/a-fun-example-of-closure/"
category: "JavaScript"
tags:
  - "Closure"
  - "JavaScript"
description: "When I look at JavaScript's Closure concept, there is an joke jumping into my mind:"
---

> A _closure_ is the combination of a function and the lexical environment within which that function was declared. 
>
> -- <cite>From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)</cite>

When I look at JavaScript's Closure concept, there is an joke jumping into my mind:
```js
var lebron = ( function() {
    var gamesPlayed = 0;
    function playGame( surroundedByShooters ) {
        if ( surroundedByShooters ) {
            console.log( 'Win' );
        }
        else {
            console.log( 'Lose' );
        }
    }

    return {
        playWithShootersOrNot: function( surroundedByShooters ) {
            playGame( surroundedByShooters );
            gamesPlayed += 1;
            console.log( 'Games played: ' + gamesPlayed );
        },
    };
} () );

lebron.playWithShootersOrNot( true );     // Win, Games played: 1
lebron.playWithShootersOrNot( false );    // Lose, Games played: 2
```

The `( function() {...} () )` part is an [**IIFE**](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) (Immediately Invoked Function Expression). After it's given to variable `lebron`, the variables and functions within the IIFE cannot be accessed from outside it. 

But it returns an object. The only two things in this object is a function `playWithShootersOrNot` and  `__proto__`. So `playWithShootersOrNot` function is accessible in `lebron` object.

When we execute `lebron.playWithShootersOrNot()`, the function `playWithShootersOrNot`'s lexical scope has a Closure which contains `playGame` function and `gamesPlayed` variable. 

OK. So it means that: You probably don't know there is a function called `playGame`, or don't know how many games played by `lebron` (They are not accessible after `lebron` is assigned). But it's like a curse: When you call `playWithShootersOrNot`, it will visit `playGame` and display 'Win' or 'Lose' based on it. Number of games is increasing, the curse is still existing. Closure won't be cleared after `playWithShootersOrNot` is called.