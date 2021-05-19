---
title: 「CCO 2018 Day1」Fun Palace
categories:
  - 题解
tags:
  - DP
date: 2021-05-19 15:22:21
---

[题目链接](https://loj.ac/p/3516)

## 题意

给定长度为 $n$ 的链。  
第 $i$ 条边连接 $i$ 与 $i+1$ 号点，若 $i$ 号点有至少 $a_i$ 个人或 $i+1$ 号点有至少 $b_i$ 个人操作时则打开（此时未操作的人可以通过）。  
在保证可到达第 $1$ 个点的人数不超过 $e$ 的前提下，最大化总人数。

<!-- more -->

## 思路

对于链里的人来说，最优策略为向后“收纳”部分人，然后集中在 $1$ 号点。

注意到对于第 $i$ 条边，如果它左右两边有至少 $a_i+b_i$ 人，则这些人可以随意穿过。

考虑 DP，设 $f_{i,j}$ 为考虑前 $i$ 个点，保证可到达第 $1$ 个点的人数不超过 $e$、第 $i$ 个点可随意移动的人数为 $j$ 时，可安放的最大人数。

转移时考虑此时 $j$ 与 $a_i$、$a_i+b_i$ 的关系。

时间复杂度 $\mathcal O(n\cdot\max\{e,a_i,b_i\})$。

## 代码

```cpp
#include<cstdio>
#include<algorithm>
using namespace std;
const int N=1000,P=1e4,inf=0x3f3f3f3f;
int n,e,p,a[N+1],b[N+1];
int f[N+1][P*2+1];
int res;
int main()
{
    scanf("%d%d",&n,&e);
    for(int i=1;i<n;++i) {
        scanf("%d%d",&a[i],&b[i]);
    }
    p=e;
    for(int i=1;i<n;++i) {
        p=max(p,a[i]+b[i]);
    }
    for(int i=1;i<=n;++i) {
        fill(f[i],f[i]+p+1,-inf);
    }
    for(int i=0;i<e;++i) {
        f[1][i]=i;
    }
    for(int i=1;i<n;++i) {
        int maxf=0;
        for(int j=0;j<=p;++j) {
            if(j<a[i]) { // 左边无法移动至右边
                if(j+b[i]<=p) {
                    f[i+1][j+b[i]]=max(f[i+1][j+b[i]],f[i][j]+b[i]);
                }
                maxf=max(maxf,f[i][j]);
            }
            if((j>=a[i])&&(j<a[i]+b[i])) { // 左边只能向右边移动 j-a[i] 人
                f[i+1][j-a[i]]=max(f[i+1][j-a[i]],f[i][j]);
            }
            if(j>=a[i]+b[i]) { // 两边可随意移动
                f[i+1][j]=max(f[i+1][j],f[i][j]);
            }
        }
        for(int j=0;j<b[i];++j) {
            f[i+1][j]=max(f[i+1][j],maxf+j);
        }
    }
    for(int i=0;i<=p;++i) {
        res=max(res,f[n][i]);
    }
    printf("%d\n",res);
    return 0;
}
```