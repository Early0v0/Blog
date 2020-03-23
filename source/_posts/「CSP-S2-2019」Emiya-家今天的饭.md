---
title: 「CSP-S2 2019」Emiya 家今天的饭
categories:
  - 题解
tags:
  - DP
  - 容斥
date: 2020-01-22 12:29:15
---

[题目链接](https://www.luogu.com.cn/problem/P5664)

## 题意

给出一个矩阵，每行只能选一个点，每列选的点数不能超过所有选的点总数的一半，不能都不选，给出每个点的选择方案数，求总方案数。

<!-- more -->

# 84pts

## 思路

考虑容斥，用总方案数减去有一列选的点数超过所有选的点总数的一半的方案数。

在一个方案中，至多有一列点数超过所选总点数的一半。考虑枚举这一列，进行 DP 求解。

## 实现

对于每列，设 $f_{i,j,k}$ 表示前 $i$ 行共选 $j$ 个点，当前列选 $k$ 个点的方案数。

转移方程如下：

$$
f_{i,j,k}=f_{i-1,j,k}+f_{i-1,j-1,k-1}\cdot a_{i,l}+f_{i,j-1,k}\cdot(sum_i-a_{i,l})
$$

其中 $l$ 为当前列，$sum_i$ 为第 $i$ 行方案数的总和。

不合法方案数即为 $\sum_{l=1}^m\sum\limits^{k>\frac12j}f_{n,j,k}$。

总方案数为 $\prod_{i=1}^n(sum_i+1)-1$。

## 代码

```cpp
#include<cstdio>
using namespace std;
const int mod=998244353;
int n,m,a[101][2001];
long long sum[101],f[101][101][101],ans=1;
int main()
{
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;++i) {
        for(int j=1;j<=m;++j) {
            scanf("%d",&a[i][j]);
            sum[i]+=a[i][j];
        }
        sum[i]%=mod,ans=ans*(sum[i]+1)%mod;
    }
    ans=(ans-1+mod)%mod;
    for(int i=0;i<=n;++i) {
        f[i][0][0]=1;
    }
    for(int l=1;l<=m;++l) {
        for(int i=1;i<=n;++i) {
            for(int j=1;j<=i;++j) {
                f[i][j][0]=(f[i-1][j][0]+f[i-1][j-1][0]*(sum[i]-a[i][l])%mod)%mod;
                for(int k=1;k<=j;++k) {
                    f[i][j][k]=(f[i-1][j][k]+f[i-1][j-1][k]*sum[i]%mod+(f[i-1][j-1][k-1]-f[i-1][j-1][k])*a[i][l]%mod)%mod;
                }
            }
        }
        for(int i=1;i<=n;++i) {
            for(int j=(i>>1)+1;j<=i;++j) {
                ans=(ans-f[n][i][j]+mod)%mod;
            }
        }
    }
    printf("%lld\n",ans);
    return 0;
}
```

# 100pts

## 思路

在 $f_{i,j,k}$ 的转移中，我们并不关心 $j,k$ 的具体数值，而只关心 $j,k$ 的大小关系，于是我们把 $j,k$ 压成一维，表示 $k-(j-k)$，即当前列比其它列多选了多少个。

新的转移方程：

$$
f_{i,j}=f_{i-1,j}+f_{i-1,j-1}\cdot a_{i,l}+f_{i-1,j+1}\cdot(sum_i-a_{i,l})
$$

复杂度降至 $O(n^2m)$，可以通过此题。

## 实现

下标 $j$ 可能出现负数，所以将所有 $j$ 增加 $n$，同时注意边界判定。

## 代码

```cpp
#include<cstdio>
using namespace std;
const int mod=998244353;
int n,m,a[101][2001];
long long sum[101],f[101][201],ans=1;
int main()
{
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;++i) {
        for(int j=1;j<=m;++j) {
            scanf("%d",&a[i][j]);
            sum[i]+=a[i][j];
        }
        sum[i]%=mod,ans=ans*(sum[i]+1)%mod;
    }
    ans=(ans-1+mod)%mod;
    f[0][n]=1;
    for(int i=1;i<=m;++i) {
        for(int j=1;j<=n;++j) {
            for(int k=n-j;k<=n+j;++k) {
                f[j][k]=(f[j-1][k]+(k?f[j-1][k-1]*a[j][i]%mod:0)+(k==(n<<1)?0:f[j-1][k+1]*(sum[j]-a[j][i])%mod))%mod;
            }
        }
        for(int j=n+1;j<=n<<1;++j) {
            ans=(ans-f[n][j]+mod)%mod;
        }
    }
    printf("%lld\n",ans);
    return 0;
}
```
