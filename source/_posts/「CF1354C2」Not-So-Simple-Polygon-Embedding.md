---
title: 「CF1354C2」Not So Simple Polygon Embedding
categories:
  - 题解
tags:
  - 几何
date: 2020-05-19 16:03:13
---

[题目链接](https://codeforces.com/contest/1354/problem/C2)

## 写在前面

比赛时思路对了，代码挂了（

我真是个人才。

## 题意

给定 $n(n\in\{2k+1\mid k\in\mathbb N^*\})$，求能包括正 $2n$ 边形的正方形的最小边长。

<!-- more -->

## 思路

先求出这个多边形的直径，为 $\large\frac1{\sin\frac{180^\circ}{2n}}$。

然后我们看看两个例子。

### 正六边形

![正六边形](正六边形.png)

容易看出，$\angle OAX=\angle AYO+\angle AOY=45^\circ+30^\circ=75^\circ$。

$\angle AOY$ 是怎么得出的呢，它是 $\large\frac{\frac{360^\circ}6}2$，即 $\frac{180^\circ}{2n}$。

正方形边长即为 $DH=AD\cdot\sin\angle OAX$。

### 正十边形

![正十边形](正十边形.png)

同理：

$$
\begin{aligned}
\angle OAX&=\angle AYO+\angle AOY=45^\circ+36^\circ=81^\circ\\
\angle AOY&=\frac{2\cdot\frac{360^\circ}{10}}2=\frac{2\cdot180^\circ}{2n}\\
FH&=AF\cdot\sin\angle OAX
\end{aligned}
$$

### 正 2n 边形

它的最小包括正方形的边长为：

$$
\frac1{\sin\frac{180^\circ}{2n}}\cdot\sin(\frac{\lfloor\frac n2\rfloor\cdot180^\circ}{2n}+45^\circ)
$$

## 实现

C++ `cmath` 库中的三角函数是弧度制的，所以答案为 $\large\frac{\sin(\frac{\lfloor\frac n2\rfloor\cdot\pi}{2n}+\frac\pi4)}{\sin\frac\pi{2n}}$。

## 代码

```cpp
#include<cstdio>
#include<cmath>
using namespace std;
const double pi=acos(-1);
int t,n;
int main()
{
    scanf("%d",&t);
    while(t--) {
        scanf("%d",&n);
        printf("%.8lf\n",sin(pi*(n/2)/n/2+pi/4)/sin(pi/n/2));
    }
    return 0;
}
```
