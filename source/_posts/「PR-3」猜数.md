---
title: '「PR #3」猜数'
categories:
  - 题解
tags:
  - 交互
date: 2022-04-14 17:04:23
---

[题目链接](https://pjudge.ac/problem/21626)

## 题意

猜数游戏，每次返回的答案会异或上一个伪随机数生成器。

```cpp
const long long p=998244353; // p 是质数，p<=1e18
const int n; // n=3 或 n=4
long long seed; // 0<=seed<p
int gen()
{
    seed=seed*n%p;
    return seed%n;
}

```

<!-- more -->

## 思路

考虑先用一定次数的 `query(0)^2` 计算出 $\operatorname{seed}$，再用常规的二分思路解决猜数游戏。

发现 $\operatorname{seed}$ 如果没有对 $p$ 取模的话，`gen()` 的返回值一定是 $0$。  
取模相当于减去若干个 $p$，设第一次 `gen()` 的返回值为 $-v_1$，则 $v_1\equiv p\cdot\lfloor\frac{\operatorname{seed}\cdot n}p\rfloor\pmod n$。  
由于 $p\bot n$，所以 $v_1$ 与 $\lfloor\frac{\operatorname{seed}\cdot n}p\rfloor$ 在模 $n$ 意义下一一对应，记 $\lfloor\frac{\operatorname{seed}\cdot n}p\rfloor=w_1$。

考虑第二次 `gen()` 的返回值为 $-v_2$，类似地推出式子 $v_2\equiv p\cdot\lfloor\frac{\operatorname{seed}\cdot n^2-w_1p\cdot n}p\rfloor\pmod n$。  
归纳总结得到 $v_i\equiv p\cdot\lfloor\frac{\operatorname{seed}\cdot n^i-\sum_{j=1}^{i-1}w_jp\cdot n^{i-j}}p\rfloor\pmod n$，最后我们可以得到所有的 $w_i$。

当 $i$ 足够大时（设为 $l$），式子 $\lfloor\frac{\operatorname{seed}\cdot n^l-\sum_{i=1}^{l-1}w_ip\cdot n^{l-i}}p\rfloor\bmod n$ 会对每一个 $\operatorname{seed}$ 都有不同的取值，就可以通过 $\frac{\left(\sum_{i=1}^{l-1}w_ip\cdot n^{l-i}\right)-o(p)}{n^l}$（$o(p)$ 为小于 $p$ 的一个「误差」）来计算 $\operatorname{seed}$。

分析发现 $l=\log_np+1$ 即可消除误差的影响。

总询问次数为 $\log_np+1+\log_2x$，其实卡得不是很紧。

## 实现

注意不要把 $l$ 开得太大以免爆 `int128`。

## 代码

```cpp
#include"guess.h"
#include<iostream>
using namespace std;
const int N=4,L3=40,L4=32;
long long p;
int n;
long long seed;
void init(int subtaskID,int t)
{
    // do nothing.
    return;
}
long long calcSeed()
{
    int L=n==3?L3:L4;
    int id[N];
    for(int i=0,s=0;i<n;++i,s=(s+p)%n) {
        id[(n-s)%n]=i;
    }
    __int128_t w=0,d=1;
    for(int l=0;l<L;++l) {
        w=w*n+id[query(0)^2];
        d*=n;
    }
    long long s=(w*p/d+(w%d!=0))%p;
    for(int l=0;l<L;++l) {
        s=s*n%p;
    }
    return s;
}
int gen()
{
    seed=seed*n%p;
    return seed%n;
}
long long solve(long long _p,int _n)
{
    p=_p,n=_n,seed=calcSeed();
    for(long long l=1,r=1e18;l<=r;) {
        long long mid=(l+r)/2;
        switch(query(mid)^gen()) {
            case 0: {
                r=mid-1;
                break;
            }
            case 1: {
                return mid;
            }
            case 2: {
                l=mid+1;
                break;
            }
        }
    }
}
```