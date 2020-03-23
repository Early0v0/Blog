---
title: 「CF1204E」Natasha, Sasha and the Prefix Sums
categories:
  - 题解
tags:
  - 数形结合
  - 组合数学
date: 2020-02-19 16:59:47
---

[题目链接](http://codeforces.com/contest/1204/problem/E)

## 题意

定义长度为 $n$ 的序列 $a$ 的最大前缀和为 $\max(0,\max_{i=1}^n\sum_{j=1}^ia_j)$。

求对于由 $n$ 个 $1$，$m$ 个 $-1$ 组成的所有序列的「最大前缀和」之和是多少。

<!-- more -->

## 思路

设 $f_i$ 为最大前缀和为 $i$ 的序列数量，答案即为 $\sum_{i=0}^ni\cdot f_i$。

发现较难直接求 $f_i$，于是定义 $g_i=\sum_{j=i}^nf_i$，差分即可求出 $f_i$。

把每个 $1$ 看成位移向量 $(1,1)$，每个 $-1$ 看成 $(1,-1)$，则题目中要求的所有序列一一对应 $(0,0)$ 到 $(n+m,n-m)$ 的所有路径。

例如，序列 $\{1,-1,1,1,-1,-1,-1,1\}$ 对应的路径如下：（图转自 [Sooke\'s Blog](https://www.luogu.com.cn/blog/Sooke/solution-cf1204e)）

![eg1](eg1.png)

最大前缀和 $\geq i$，等价于路径与 $y=i$ 有交点。

下面分两种情况讨论：

1. 当路径起点和终点分别位于直线两侧，此时它一定与 $y=i$ 有交，所以 $g_i=C_n^{n+m}$；
2. 当路径起点和终点分别位于直线同侧，则将起点关于 $y=i$ 做对称至 $(0,2i)$，路径则一定与直线有交。（还是借 Sooke 大佬的图）

![eg2](eg2.png)

此时路径为从 $(0,2i)$ 至 $(n+m,n-m)$，位移为 $(n+m,n-m-2i)$。

设序列含 $x$ 个1，$y$ 个 $-1$。

$$
\begin{cases}
x+y&=n+m\\
x-y&=n-m-2i
\end{cases}
$$
解得 $\begin{cases}x&=n-i\\y&=m+i\end{cases}$，此时 $g_i=C_x^{x+y}=C_{n-i}^{n+m}$。

综上所述：

$$
g_i=
\begin{cases}
C_n^{n+m}\ (i\leq n-m)\\
C_{n-i}^{n+m}\ (i>n-m)
\end{cases}
$$

## 实现

预处理出 $(n+m)!$ 以及 $n+m$ 以内的所有数的逆元，$O(1)$ 查询组合数。

注意本题的模数为 $998244{\color{red}8}53$。

## 代码

```cpp
#include<cstdio>
using namespace std;
const int N=4000,mod=998244853;
int n,m,x,y;
long long fac[N+1],inv[N+1],g[N+1],ans;
long long pow(long long x,int times)
{
    long long res=1;
    for(;times;x=x*x%mod,times>>=1) {
        if(times&1) {
            res=res*x%mod;
        }
    }
    return res;
}
void init()
{
    fac[0]=inv[0]=1;
    for(int i=1;i<=N;++i) {
        fac[i]=fac[i-1]*i%mod;
        inv[i]=pow(fac[i],mod-2);
    }
    return;
}
inline long long C(int x,int y)
{
    return x>=y?fac[x]*inv[y]%mod*inv[x-y]%mod:0;
}
int main()
{
    init();
    scanf("%d%d",&n,&m);
    x=n+m,y=n-m;
    for(int i=0;i<=n;++i) {
        g[i]=i<=y?C(x,n):C(x,n-i);
    }
    for(int i=1;i<=n;++i) {
        ans=(ans+(g[i]-g[i+1])*i)%mod;
    }
    printf("%lld\n",(ans+mod)%mod);
    return 0;
}
```
