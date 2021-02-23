---
title: 「AGC041D」Problem Scores
categories:
  - 题解
tags:
  - 计数
  - 完全背包
date: 2021-02-23 15:21:32
---

[题目链接](https://atcoder.jp/contests/agc041/tasks/agc041_d)

## 题意

求长度为 $n$、满足以下条件的整数序列 $A$ 的个数：

- $\forall i\in[1,n),A_i\leq A_{i+1}$；
- $\forall k\in[1,n)$，任意 $k$ 个 $A$ 中的数之和都严格小于任意 $k+1$ 个 $A$ 中的数之和。

<!-- more -->

## 思路

易知第二个条件只要对于 $k=\lfloor\frac {n-1}2\rfloor$ 满足即可。

设序列 $A$ 的差分数组为 $d$，其中 $d_0=1$。

根据题目要求易得：

- $\forall i\in[1,n],d_i\geq0$；
- $\sum_{i=1}^{k+1}A_i>\sum_{i=n-k+1}^nA_i$；
- $\sum_{i=0}^nd_i=A_n\leq n$，即 $\sum_{i=1}^nd_i<n$。

由第二个限制得：

$$
\begin{aligned}
A_1&>\sum_{i=1}^k(A_{n-k+i}-A_{i+1})\\
d_1+1&>\sum_{i=3}^{n-k}(i-2)\cdot d_i+\sum_{i=n-k+1}^n(n-i+1)\cdot d_i\\
d_1&\geq\sum_{i=3}^{n-k}(i-2)\cdot d_i+\sum_{i=n-k+1}^n(n-i+1)\cdot d_i
\end{aligned}
$$

把第三个限制的 $d_1$ 提出得：

$$
d_1<n-\sum_{i=2}^nd_i
$$

此时我们便得出了 $d_1$ 的取值范围（与个数）：

$$
\begin{aligned}
|\{d_1\}|&=\left(n-\sum_{i=2}^nd_i\right)-\left(\sum_{i=3}^{n-k}(i-2)\cdot d_i+\sum_{i=n-k+1}^n(n-i+1)\cdot d_i\right)\\
&=n-\left(d_2+\sum_{i=3}^{n-k}(i-1)\cdot d_i+\sum_{i=n-k+1}^n(n-i+2)\cdot d_i\right)
\end{aligned}
$$

问题转为，对于每种 $d_2,d_3,\dots,d_n$，求和 $|\{d_1\}|$。

令 $w_i$ 为 $d_i$ 的系数，即 $w=\{0,1,2,3,\dots,n-k-1,k+1,k,\dots,2\}$。

以 $w$ 为重量，$2\sim n$ 的物体数量无限，做一次完全背包，最后计算出的 $f_i$ 即为括号内总和为 $i$ 的 $d_2,d_3,\dots,d_n$ 个数。

## 代码

```cpp
#include<cstdio>
using namespace std;
const int N=5000;
int n,k,p;
int w[N+1];
int f[N];
int res;
int main()
{
    scanf("%d%d",&n,&p);
    k=(n-1)/2;
    w[2]=1;
    for(int i=3;i<=n-k;++i) {
        w[i]=i-1;
    }
    for(int i=n-k+1;i<=n;++i) {
        w[i]=n-i+2;
    }
    f[0]=1;
    for(int i=2;i<=n;++i) {
        for(int j=0;j+w[i]<n;++j) {
            f[j+w[i]]=(f[j+w[i]]+f[j])%p;
        }
    }
    for(int i=0;i<n;++i) {
        res=(res+1ll*(n-i)*f[i])%p;
    }
    printf("%d\n",res);
    return 0;
}
```
