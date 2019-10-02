---
title: Sometimes You Need Navigation Service Instead Of Router (Angular)
date: "2019-02-14T16:22:41.456Z"
template: "post"
draft: false
slug: "/posts/navigation-service-instead-of-router/"
category: "Angular"
tags:
  - "Angular"
  - "JavaScript"
  - "Router"
description: "When your browser extension or any other front end app needs to add a regular expression field, your back end teammate gave you api response like this:"
---

Recently I have been working on refactoring a vanilla javascript project using the framework Angular 6. During the time I organizing page logic, I found that there are some factors blocking me from using [Router](https://angular.io/guide/router) to do page navigation:

1. Unchangeable URL (deterministic):
Now I am writing a browser extension popup. A Routing Module already exists in the project to redirect the extension page to background or popup. This routing module is not only responsible for my popup, also for others. It means that I cannot add a Routing Module in my popup module. 
`RouterModule.forChild` is also not a solution. Because you still need to modify the existing routing module to adapt it.

2. Complex component relationship (non-deterministic):
Let's say if you have 3 components A, B and C. But you have 3 pages, which needs to load A&B, A&C, B&C (Sorry we have to do this. because the state of popup is depend on the tab that user is viewing, we cannot control it...), Parent-child relationship doesn't apply to these 3 components . So it's a headache to design which component does what.

After discussion, we decided to use a navigation service. Here is this service `nav.service.ts`: 
```typescript
import { Injectable } from  '@angular/core';
import { Observable, BehaviorSubject } from  'rxjs';
import { Constants } from  './constants';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private _navIndex: BehaviorSubject<number> = new BehaviorSubject<number>(Constants.DEFAULT_VIEW_INDEX);
  navIndex: Observable<number> = this._navIndex.asObservable();

constructor() { }

private emit(navIndex: number): void {
  this._navIndex.next(navIndex);
}

showPageA(): void {
  this.emit(1);
}

showPageB(): void {
  this.emit(2);
}

showPageC(): void {
  this.emit(3);
}
```
`navIndex` is used to represent page index. Page A, B and C has index 1, 2 and 3 respectively. Here I use RxJS to enable other components to subscribe the change of `navIndex`. (RxJS really makes variable more powerful!)

Seal the deal. We only need a `navIndex` field in any component's class that needs navigation, add `NavService` as a parameter in its constructor, and subscribe the index change in `ngOnInit`. Here is an example component:
```typescript
export class Ex1Component implements OnInit {

  navIndex = null;

  constructor(
    private navSvc: NavService
  ) { }

  ngOnInit() {
    this.navSvc.navIndex.subscribe(navIndex => {
      this.navIndex = navIndex;
    });
  }
}
```
In this component's html file, an attribute `*ngIf="navIndex == 2"` can easily set what to display.

With this navigation service, the page logic becomes flat, and separated from component logic. This separation not only solve the 2 issues above, also has these 2 benefits:

1. Flexible for change: One day your PM says: 'I want to move this part from Page A to Page B, because everyone... just hates it'. You said: 'np, one moment'. Then you just need to submit a pull request of changing `*ngIf`.

2. Group pages together: You can set the index format to... whatever you want. For example, my index is number. So I make all logged-in pages' index to be greater than a value. Then I only need to compare the number to know whether the page is in logged-in group. Furthermore, you can use some Math trick to divide into more groups (Use binary number and categorize based on digit)

There are also some apparent drawbacks: You need to use a lot of `ngIf`. You need to add `NavService` into every component that needs it. The page logic is different from component logic. It makes your app hard to understand.

So if you have similar issues, give a try to use navigation service instead of router. If you don't have URL restriction and components have clear parent-child relationship. Just stick with router.