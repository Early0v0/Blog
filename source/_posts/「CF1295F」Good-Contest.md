---
title: 「CF1295F」Good Contest
categories:
  - 题解
tags:
  - DP
  - 离散化
date: 2021-03-13 11:11:49
---

[题目链接](https://codeforces.com/contest/1295/problem/F)

## 写在前面

又快到省选季了呢。

Early 认为他需要练习一些 DP 题。

## 题意

给定长度为 $n$ 的数组 $l,r$，表示 $a_i$ 在 $[l_i,r_i]$ 中随机生成。

求 $a$ 单调不增的概率。

<!-- more -->

## 思路

先考虑朴素的 DP：设 $f_{i,j}$ 为选择好前 $i$ 个数、第 $i$ 个数值为 $j$ 的方案数。

转移也很显然：$f_{i,j}=\sum_{k=j}^\infty f_{i-1,k}$。

但由于本题的值域直达 $998244353$，你发现你可能 $n=1$ 都过不去。

很自然地考虑离散化，为方便，我们把区间改成左闭右开。  
设第 $i$ 个区间为 $[d_i,d_{i+1})$。

现在，我们可以很方便地处理不同区间的转移，但是不同 $a_i$ 在同一区间之间的大小关系无法轻松判断。

于是考虑更改枚举方式，设 $f_{i,j}$ 为选择好前 $i$ 个数、第 $i$ 个数值在 $[d_j,d_{j+1})$ 中的方案数。

由于题目要求单调不增，所以转移 $f_{i,j}$ 时枚举**一段** $a_k,a_{k+1},\dots,a_i$，要求这一段值均在 $[l_j,r_j)$ 中。  
为了不重不漏，转移时要求有且只有这一段值在 $[d_j,d_{j+1})$ 中（即 $a_1,a_2,\dots,a_{k-1}$ 都必须 $\geq d_{j+1}$）。

转移也不难：

$$
f_{i,j}=\sum_{k=1}^i\left[\forall x\in[k,i],l_x\leq d_j\land r_x\geq d_{j+1}\right]\left(\sum_{x=j+1}^\infty f_{k-1,x}\right)\cdot C_{(d_{j+1}-d_j)+(i-k+1)-1}^{i-k+1}
$$

组合数的意义是由 $[d_j,d_{j+1})$ 中的数（可重复）组成的、长度为 $i-k+1$ 的有序数列的个数。

后缀和优化即可。

## 实现

暴力计算组合数是 $\mathcal O(n)$ 的，总复杂度为 $\mathcal O(n^4)$。

其实用这种方式也能求单调递减的概率，转移系数改成 $C_{d_{j+1}-d_j}^{i-k+1}$ 就可以了。

## 代码

```cpp
#include<cstdio>
#include<vector>
#include<algorithm>
using namespace std;
const int N=50,mod=998244353;
int n;
int l[N+1],r[N+1];
vector<int> dis;
int c;
int f[N+1][N*2],s[N+1][N*2];
int res;
int pow(int x,int t)
{
    int r=1;
    while(t) {
        if(t&1) {
            r=1ll*r*x%mod;
        }
        t>>=1,x=1ll*x*x%mod;
    }
    return r;
}
inline int inv(int x)
{
    return pow(x,mod-2);
}
int C(int n,int m)
{
    int r=1;
    for(int i=0;i<m;++i) {
        r=1ll*r*(n-i)%mod;
    }
    for(int i=1;i<=m;++i) {
        r=1ll*r*inv(i)%mod;
    }
    return r;
}
int main()
{
    scanf("%d",&n);
    for(int i=1;i<=n;++i) {
        scanf("%d%d",&l[i],&r[i]);
    }
    for(int i=1;i<=n;++i) {
        dis.push_back(l[i]),dis.push_back(++r[i]);
    }
    sort(dis.begin(),dis.end());
    dis.erase(unique(dis.begin(),dis.end()),dis.end());
    c=dis.size();
    for(int i=1;i<=n;++i) {
        l[i]=lower_bound(dis.begin(),dis.end(),l[i])-dis.begin();
        r[i]=lower_bound(dis.begin(),dis.end(),r[i])-dis.begin();
    }
    f[0][c-1]=1,fill_n(s[0],c,1);
    for(int i=1;i<=n;++i) {
        for(int j=l[i];j<r[i];++j) {
            for(int k=i;k;--k) {
                if((l[k]>j)||(r[k]<=j)) {
                    break;
                }
                f[i][j]=(f[i][j]+1ll*s[k-1][j+1]*C((dis[j+1]-dis[j])+(i-k+1)-1,i-k+1))%mod;
            }
        }
        s[i][c-1]=f[i][c-1];
        for(int j=c-1;j;--j) {
            s[i][j-1]=(s[i][j]+f[i][j-1])%mod;
        }
    }
    res=s[n][0];
    for(int i=1;i<=n;++i) {
        res=1ll*res*inv(dis[r[i]]-dis[l[i]])%mod;
    }
    printf("%d\n",res);
    return 0;
}
```
