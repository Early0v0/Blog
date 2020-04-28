---
title: 「BalkanOI 2018 Day1」Election
categories:
  - 题解
tags:
  - 贪心
  - 线段树
date: 2020-04-26 ‏‎20:24:27
---

[题目链接](https://loj.ac/problem/2710)

## 题意

给定一个长度为 $n$ 的、只由 `C` 和 `T` 组成的字符串 $s$，每次询问给定区间 $l,r$，表示字符串 $s^\prime=s_ls_{l+1}\dots s_r$，求至少删掉 $s^\prime$ 中的多少个字符才能保证：对于 $s^\prime$ 的任意一个前缀或后缀，其 `C` 的数量都不小于 `T` 的数量。

<!-- more -->

## 思路

把 `C` 看成 $1$，把 `T` 看成 $-1$，先计算出 $s$ 的后缀和 $sum$。

将询问离线，然后将左端点 $l$ 从右往左扫，每遇到 $-1$ 就将其加入栈中并删掉它（即将其改成 $0$），遇到 $1$ 就将栈顶弹出并使它恢复成 $-1$。

维护区间内 $sum$ 的最小值以及区间加入 $-1$ 的次数。

查询时先在线段树里查找目前在区间 $l-r$ 内的加 $-1$ 次数，此时已经保证 $s^\prime$ 的任意前缀 $\geq0$，接下来只要考虑后缀。

我们求出 $s^\prime$ 的最小后缀和，如果它 $<0$ 则答案需要加上它的相反数。

## 实现

用线段树维护 $sum$ 最小值和加入 $-1$ 的次数。

## 代码

```cpp
#include<cstdio>
#include<cctype>
#include<utility>
#include<vector>
using namespace std;
const int N=5e5,Q=5e5;
typedef pair<int,int> pii;
int n,q,sum[N+2],top,stk[N+1];
char s[N+2];
vector<pii>v[N+1];
struct tree {
    int minn,tim,tag;
}t[(N<<2)+1];
int res[Q+1];
#define lson num<<1
#define rson num<<1|1
inline void push_up_minn(int num)
{
    t[num].minn=min(t[lson].minn,t[rson].minn);
    return;
}
inline void push_up_tim(int num)
{
    t[num].tim=t[lson].tim+t[rson].tim;
    return;
}
inline void push_down(int num)
{
    if(!t[num].tag) {
        return;
    }
    t[lson].tag+=t[num].tag,t[lson].minn+=t[num].tag;
    t[rson].tag+=t[num].tag,t[rson].minn+=t[num].tag;
    t[num].tag=0;
    return;
}
void build(int num,int l,int r)
{
    if(l==r) {
        t[num]=tree{sum[l],0,0};
        return;
    }
    int mid=l+r>>1;
    build(lson,l,mid),build(rson,mid+1,r);
    push_up_minn(num);
    return;
}
void change_minn(int num,int l,int r,int fro,int to,int val)
{
    if((fro<=l)&&(to>=r)) {
        t[num].minn+=val,t[num].tag+=val;
        return;
    }
    push_down(num);
    int mid=l+r>>1;
    if(fro<=mid) {
        change_minn(lson,l,mid,fro,to,val);
    }
    if(to>mid) {
        change_minn(rson,mid+1,r,fro,to,val);
    }
    push_up_minn(num);
    return;
}
void change_tim(int num,int l,int r,int pos,int val)
{
    if(l==r) {
        t[num].tim+=val;
        return;
    }
    push_down(num);
    int mid=l+r>>1;
    if(pos<=mid) {
        change_tim(lson,l,mid,pos,val);
    } else {
        change_tim(rson,mid+1,r,pos,val);
    }
    push_up_tim(num);
    return;
}
inline pii merge(const pii x,const pii y)
{
    return make_pair(min(x.first,y.first),x.second+y.second);
}
pii query(int num,int l,int r,int fro,int to)
{
    if((fro<=l)&&(to>=r)) {
        return make_pair(t[num].minn,t[num].tim);
    }
    push_down(num);
    int mid=l+r>>1;
    pii ret{n,0};
    if(fro<=mid) {
        ret=merge(ret,query(lson,l,mid,fro,to));
    }
    if(to>mid) {
        ret=merge(ret,query(rson,mid+1,r,fro,to));
    }
    return ret;
}
#undef lson
#undef rson
int read()
{
    int res=0;
    char c=getchar();
    while(!isdigit(c)) {
        c=getchar();
    }
    while(isdigit(c)) {
        res=(res<<3)+(res<<1)+c-'0';
        c=getchar();
    }
    return res;
}
int main()
{
    n=read();
    scanf("%s",s+1);
    for(int i=n;i;--i) {
        sum[i]=sum[i+1]+(s[i]=='C'?1:-1);
    }
    q=read();
    for(int i=1,l,r;i<=q;++i) {
        l=read(),r=read();
        v[l].push_back(make_pair(i,r));
    }
    build(1,1,n);
    for(int i=n;i;--i) {
        if(s[i]=='C') {
            if(top) {
                change_minn(1,1,n,1,stk[top],-1),change_tim(1,1,n,stk[top],-1);
                --top;
            }
        } else {
            change_minn(1,1,n,1,i,1),change_tim(1,1,n,i,1);
            stk[++top]=i;
        }
        for(pii j:v[i]) {
            pii tem=query(1,1,n,i,j.second);
            res[j.first]=tem.second+max((sum[j.second+1]+top-tem.second)-tem.first,0);
        }
    }
    for(int i=1;i<=q;++i) {
        printf("%d\n",res[i]);
    }
    return 0;
}
```
