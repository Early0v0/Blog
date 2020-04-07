---
title: 「POI2007」查询 Queries
categories:
  - 题解
tags:
  - 莫比乌斯反演
date: 2020-04-07 15:24:42
---

[题目链接](https://loj.ac/problem/2652)

## 题意

求 $\sum_{x=1}^n\sum_{y=1}^m[\gcd(x,y)=d]$。

多组数据。

<!-- more -->

## 思路

新学的莫比乌斯反演，~~拿这题练练手~~。

设 $f(x)=\sum_{i=1}^n\sum_{j=1}^m[\gcd(i,j)=x]$，$g(x)=\sum_{i=1}^n\sum_{j=1}^m[x\mid\gcd(i,j)]$。

显然 $g(x)=\sum_{x\mid i}^{\min(n,m)}f(i)$。

由莫比乌斯反演得：$f(x)=\sum_{x\mid i}^{\min(n,m)}\mu(i)\cdot g(\frac ix)$。

$$
\begin{aligned}g(x)&=\sum_{i=1}^n\sum_{j=1}^m[x\mid\gcd(i,j)]\\&=\sum_{i=1}^{\lfloor\frac nx\rfloor}\sum_{j=1}^{\lfloor\frac mx\rfloor}[1\mid\gcd(i,j)]\\&=\lfloor\frac nx\rfloor\cdot\lfloor\frac mx\rfloor\end{aligned}
$$

答案即为 $f(d)$。

$$
\begin{aligned}
f(d)&=\sum_{d\mid i}^{\min(n,m)}\mu(\frac id)\cdot g(i)\\
&=\sum_{i=1}^{\min(n,m)}\mu(i)\cdot g(id)\\
&=\sum_{i=1}^{\min(n,m)}\mu(i)\cdot\lfloor\frac n{id}\rfloor\cdot\lfloor\frac m{id}\rfloor
\end{aligned}
$$

## 实现

整除分块即可。

时间复杂度 $O(q\sqrt{\max(n,m)})$。

## 代码

```cpp
#include<cstdio>
using namespace std;
const int N=5e4;
int q,n,m,d,cnt,pri[N+1],mu[N+1],smu[N+1];
bool npri[N+1];
long long ans;
template<class T>inline T min(T x,T y)
{
    return x<=y?x:y;
}
void init()
{
    mu[1]=smu[1]=1;
    for(int i=2;i<=N;++i) {
        if(!npri[i]) {
            pri[++cnt]=i;
            mu[i]=-1;
        }
        for(int j=1,tem;(j<=cnt)&&((tem=i*pri[j])<=N);++j) {
            npri[tem]=true;
            if(i%pri[j]==0) {
                break;
            }
            mu[tem]=-mu[i];
        }
        smu[i]=smu[i-1]+mu[i];
    }
    return;
}
int main()
{
    init();
    scanf("%d",&q);
    while(q--) {
        scanf("%d%d%d",&n,&m,&d);
        ans=0;
        for(int l=1,r;(l<=n)&&(l<=m);l=r+1) {
            r=min(n/(n/l),m/(m/l));
            ans+=1ll*(n/l/d)*(m/l/d)*(smu[r]-smu[l-1]);
        }
        printf("%lld\n",ans);
    }
    return 0;
}
```
