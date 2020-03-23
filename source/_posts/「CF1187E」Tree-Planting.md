---
title: 「CF1187E」Tree Planting
categories:
  - 题解
tags:
  - 换根DP
date: 2020-02-20 08:24:19
---

[题目链接](http://codeforces.com/contest/1187/problem/E)

## 题意

给定一棵 $n$ 个点的树，初始全是白点。

要求你做 $n$ 步操作，每一次选定一个与一个黑点有连边的白点，将它染成黑点，然后获得该白点被染色前所在的白色联通块大小的权值（第一次操作可以任意选点）。

求可获得的最大权值。

<!--more-->

## 思路

确定完第一个点，可获得的权值就已经确定。

记 $f_i$ 为先染 $1$ 时，$i$ 的子树对答案的贡献。

易得到递推式：

$$
f_i=siz_i+\sum_{j\in son_i}f_j
$$

记 $res_i$ 为先染 $i$ 时整棵树可获得的权值，对整棵树进行换根 DP。

如图，假设我们要将根从 $x$ 换到 $y$，如何转移？

![eg](eg.png)

$$
\begin{aligned}
res_x&=n+\sum_{i\in son_x}f_i\\
res_y&=n+(n-siz_y)+\sum_{i\in son_x\mid i\not=y}f_i+\sum_{j\in son_y}f_j\\
&=n+(n-siz_y)+\sum_{i\in son_x\mid i\not=y}f_i+(f_y-siz_y)\\
&=(n+\sum_{i\in son_x}f_i)-siz_y+(n-siz_y)\\
&=res_x+n-2\cdot siz_y
\end{aligned}
$$
即可实现 $O(1)$ 转移。

## 实现

分两次 $dfs$，第一次求出 $f$，第二次求出 $res$。

## 代码

```cpp
#include<cstdio>
using namespace std;
int n,tot,fir[200001],fa[200001],siz[200001];
long long f[200001],res[200001],ans;
struct edge {
    int to;
    int nex;
}e[399999];
inline long long max(long long x,long long y)
{
    return x>=y?x:y;
}
inline void add(int u,int v)
{
    e[++tot]=edge{v,fir[u]};
    fir[u]=tot;
    return;
}
void dfs(int u)
{
    siz[u]=1;
    for(int i=fir[u],v;v=e[i].to,i;i=e[i].nex) {
        if(v==fa[u]) {
            continue;
        }
        fa[v]=u;
        dfs(v);
        siz[u]+=siz[v],f[u]+=f[v];
    }
    f[u]+=siz[u];
    return;
}
void solve(int u)
{
    if(u!=1) {
        res[u]=res[fa[u]]+n-(siz[u]<<1);
        ans=max(ans,res[u]);
    }
    for(int i=fir[u],v;v=e[i].to,i;i=e[i].nex) {
        if(v!=fa[u]) {
            solve(v);
        }
    }
    return;
}
int main()
{
    scanf("%d",&n);
    for(int i=1,u,v;i<n;++i) {
        scanf("%d%d",&u,&v);
        add(u,v),add(v,u);
    }
    dfs(1);
    ans=res[1]=f[1];
    solve(1);
    printf("%lld\n",ans);
    return 0;
}

```
