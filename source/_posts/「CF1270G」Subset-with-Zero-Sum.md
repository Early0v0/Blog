---
title: 「CF1270G」Subset with Zero Sum
categories:
  - 题解
tags:
  - 图论
  - 环
date: 2020-02-25 08:40:32
---

[题目链接](https://codeforces.com/contest/1270/problem/G)

## 题意

给定一个长度为 $n$ 的序列 $a$，保证 $i-n\leq a_i\leq i-1$。

要求选出非空集合 $S$，使 $\sum_{i\in S}a_i=0$。

<!-- more -->

## 思路

由 $i-n\leq a_i\leq i-1$，得 $1\leq i-a_i\leq n$。

于是对于每个点 $i$，向 $i-a_i$ 连一条有向边。

图上的每个环都对应一个合法的点集 $S$。

为什么呢？

记 $i$ 向 $to_i$ 连了边，由定义得 $to_i=i-a_i$。

一旦 $S$ 形成了环，则 $\sum_{i\in S}i=\sum_{i\in S}to_i$。

即 $\sum_{i\in S}i=\sum_{i\in S}(i-a_i)$。

将等式右边展开得：$\sum_{i\in S}i=\sum_{i\in S}i-\sum_{i\in S}a_i$。

显而易见，$\sum_{i\in S}a_i=0$，符合题目要求。

## 实现

本来应该挺好实现的。

自己脑抽 `stack` 写成 `queue` WA 了 1 次。

数据组数 $t\leq1000000$，我每次清空 $vis$ 数组 TLE 了 3 次……

## 代码

```cpp
#include<cstdio>
#include<cstring>
using namespace std;
int t,n,to[1000001];
bool flag;
class stack {
private:
    int tp,s[1000001];
    bool ins[1000001];
public:
    void init()
    {
        tp=0;
        return;
    }
    inline void push(int x)
    {
        ins[s[++tp]=x]=1;
        return;
    }
    inline int top()
    {
        return s[tp];
    }
    inline void pop()
    {
        ins[s[tp--]]=0;
        return;
    }
    inline bool empty()
    {
        return !tp;
    }
    inline bool in(int x)
    {
        return ins[x];
    }
    void print(int x)
    {
        int fro=tp;
        while(s[fro]!=x) {
            --fro;
        }
        printf("%d\n",tp-fro+1);
        for(int i=fro;i<=tp;++i) {
            printf("%d ",s[i]);
        }
        putchar('\n');
        return;
    }
}s;
void init()
{
    flag=0;
    s.init();
    return;
}
void search(int x)
{
    if(s.in(x)) {
        flag=1;
        s.print(x);
        return;
    }
    s.push(x);
    search(to[x]);
    s.pop();
    return;
}
int main()
{
    scanf("%d",&t);
    while(t--) {
        init();
        scanf("%d",&n);
        for(int i=1,a;i<=n;++i) {
            scanf("%d",&a);
            to[i]=i-a;
        }
        for(int i=1;i<=n;++i) {
            search(i);
            if(flag) {
                break;
            }
        }
    }
    return 0;
}
```
