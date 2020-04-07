---
title: 「CF708E」Student's Camp
categories:
  - 题解
tags:
  - DP
  - 组合数学
  - 概率
date: 2020-02-29 15:21:52
---

[题目链接](https://codeforces.ml/contest/708/problem/E)

## 题意

一个 $(n+2)\times m$ 的矩形由 $1\times1$ 的小矩形构成。

每天第 $2-(n+1)$ 行最左和最右的矩形都有 $\frac ab$ 的概率消失。

问 $t$ 天后大矩形四联通的概率。

对 $10^9+7$ 取模。

<!-- more -->

## 思路

令 $p=\frac ab$。

考虑 DP 求解。

预处理出 $t$ 天后每行左 / 右恰好 $i$ 个矩形消失的概率，设为 $c_i$。

易得：$c_i=C_t^i\cdot p^i\cdot(1-p)^{t-i}$。

设 $f_{i,l,r}$ 为第 $i$ 行只剩矩形 $l-r$ 时前 $i$ 行仍联通的概率。

$lf_{i,r}$ 为第 $i$ 行最右边的矩形为 $r$ 时前 $i$ 行仍联通的概率，$rf_{i,l}$ 同理。

$ls_{i,r}$ 为第 $i$ 行最右边的矩形为 $1-r$ 时前 $i$ 行仍联通的概率，$rs_{i,l}$ 同理。

$sum_i$ 为前 $i$ 行联通的总概率（其实就是 $ls_{i,m}$）。

转移方程如下：

$$
\begin{aligned}
f_{i,l,r}&=(sum_{i-1}-ls_{i-1,l-1}-rs_{i-1,r+1})\cdot c_{l-1}\cdot c_{m-r}\\
lf_{i,r}&=\sum_{l=1}^rf_{i,l,r},\ rf_{i,r}=\sum_{r=l}^mf_{i,l,r}\\
ls_{i,r}&=\sum_{j=1}^rlf_{i,j},\ rs_{i,l}=\sum_{j=l}^mrf_{i,j}
\end{aligned}
$$

然而这种做法时间复杂度是 $O(nm^2)$ 的，不能通过。

其实 $ls,rs$ 本质上是相同的，即 $ls_{i,j}=rs_{i,m-j+1}$。

所以 $f_{i,l,r}=(ls_{i-1,m}+ls_{i-1,l-1}+ls_{i-1,m-r})\cdot c_{l-1}\cdot c_{m-r}$。

继续推导：

$$
\begin{aligned}
lf_{i,r}&=\sum_{l=1}^r(ls_{i-1,m}+ls_{i-1,l-1}+ls_{i-1,m-r})\cdot c_{l-1}\cdot c_{m-r}\\
&=(\sum_{l=1}^r((ls_{i-1,m}-ls_{i-1,l-1})\cdot c_{l-1})-ls_{i-1,m-r}\cdot\sum_{l=1}^rc_{l-1})\cdot c_{m-r}
\end{aligned}
$$

维护前缀和，可在 $O(1)$ 时间复杂度内求出 $lf_{i,r}$。

答案为 $ls_{n,m}$。

## 实现

代码中变量名与公式中有偏差。

- `sc[i]` 为 $\sum_{j=0}^{i}c_j$。
- `f[i][j]` 为 $lf_{i,j}$。
- `s[i][j]` 为 $ls_{i,j}$。
- `ss[i][j]` 为 $\sum_{k=1}^j((ls_{i-1,m}-ls_{i-1,k-1})\cdot c_{k-1})$。

## 代码

```cpp
#include<cstdio>
using namespace std;
const int N=1500,K=1e5,mod=1e9+7;
int n,m,a,b,k,p;
long long fac[K+1],inv[K+1],c[N+1],sc[N+1],f[N+1][N+1],s[N+1][N+1],ss[N+1];
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
    fac[0]=1;
    for(int i=1;i<=k;++i) {
        fac[i]=fac[i-1]*i%mod;
    }
    inv[k]=pow(fac[k],mod-2);
    for(int i=k;i;--i) {
        inv[i-1]=inv[i]*i%mod;
    }
    return;
}
inline long long C(int n,int m)
{
    return fac[n]*inv[m]%mod*inv[n-m]%mod;
}
int main()
{
    scanf("%d%d%d%d%d",&n,&m,&a,&b,&k);
    p=a*pow(b,mod-2)%mod;
    init();
    for(int i=0;(i<=m)&&(i<=k);++i) {
        c[i]=C(k,i)*pow(p,i)%mod*pow(1-p,k-i)%mod;
    }
    sc[0]=c[0];
    f[0][m]=s[0][m]=1;
    for(int i=1;i<m;++i) {
        sc[i]=(sc[i-1]+c[i])%mod;
    }
    for(int i=1;i<=n;++i) {
        for(int j=1;j<=m;++j) {
            ss[j]=(ss[j-1]+(s[i-1][m]-s[i-1][j-1])*c[j-1])%mod;
            f[i][j]=(ss[j]-s[i-1][m-j]*sc[j-1])%mod*c[m-j]%mod;
            s[i][j]=(s[i][j-1]+f[i][j])%mod;
        }
    }
    printf("%lld\n",(s[n][m]+mod)%mod);
    return 0;
}
```
