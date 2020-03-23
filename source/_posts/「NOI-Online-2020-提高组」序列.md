---
title: 「NOI Online 2020 提高组」序列
categories:
  - 题解
tags:
  - 并查集
  - 建图
date: 2020-03-08 18:36:52
---

[题目链接](https://www.luogu.com.cn/problem/P6185)

## 写在前面

比赛时只想到操作 2 的做法，于是只能写个暴力 60pts+ 只有操作 2 的 20pts 滚粗走人了。

考试结束跟学长一交流，瞬间感觉自己够傻，谨以此篇题解作为纪念。

## 题意

给定长度为 $n$ 的序列 $a,b$ 和 $m$ 种操作。

每次操作给出 $opt,u,v$，意义如下：

- 当 $opt=1$ 时，可使 $a_u\gets a_u-1,a_v\gets a_v-1$ 或 $a_u\gets a_u+1,a_v\gets a_v+1$；
- 当 $opt=2$ 时，可使 $a_u\gets a_u+1,a_v\gets a_v-1$ 或 $a_u\gets a_u-1,a_v\gets a_v+1$。

每种操作均可实现任意次，问能否把序列 $a$ 转为序列 $b$。

<!-- more -->

## 思路

这题实际上是道图论题（题目中的 $u,v$ 就在提示）。

先将 $a_i$ 减去 $b_i$ ，题目即为询问 $\forall\ 1\leq i\leq n,a_i=0$ 是否可行。

对于操作 2，显然 $u,v$ 两点的总和不变，将它们用并查集合并（缩点）。

显然只要某个联通块 $S$，只要 $\sum_{i\in S}a_i=0$，则它一定可以只通过操作 2 使得 $S$ 内所有点 $a$ 值都为 $0$。

对于每个点，我们再用操作 1 把它们连接起来（边权为 $1$），形成一张图。

答案即为用操作 1 能否将一个个点的 $a$ 值都清零。

- 当图中存在自环，则这个点的值可以任意增加 $2i(i\in\mathbb Z)$；
- 当有任意两点距离为偶数，则这两个点实际上可以再次合并；

> 如下图 $A,C$ 两点，我们可以让 $A,B$ 同时加 $1$、$B,C$ 同时减 $1$ 的方法使 $A,C$ 达到操作 2 的效果。

![eg](eg.png)

- 处理完之后，整张图就只剩下相邻的点对和奇偶环。
- 对于相邻的点对，我们尽量使其中一点 $a$ 值为 $0$，如果另外一点值无法做到清零，则答案即为不可行。
- 对于奇环，环上任意两点都可以通过偶数条路径到达，所以它其实也可以看成一个点（而且可以自身加减 2）；
- 对于偶环，我们可以用点对的处理方式处理。

所以每扫到一个联通块，如果它是奇环，则只要它的总和是偶数即可转化成全 $0$ 状态，否则要求它的所有点能通过相邻边同时加减而得到全 $0$ 状态。

## 实现

只要有一个联通块不能清零，则答案为 `NO`，否则为 `YES`。

## 代码

```cpp
#include<cstdio>
#include<cctype>
#include<cstring>
#include<algorithm>
using namespace std;
const int N=1e5;
int t,n,m,cnt,fa[N+1],tot,fir[N+1],dep[N+1];
long long val[N+1];
bool ans;
struct operation {
    int x,y;
}o[N+1];
struct edge {
    int to,nex;
}e[(N<<1)+1];
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
void init()
{
    cnt=tot=0,ans=1;
    memset(fa,0,sizeof(fa));
    memset(fir,0,sizeof(fir));
    memset(dep,0,sizeof(dep));
    return;
}
int find(int x)
{
    return fa[x]?fa[x]=find(fa[x]):x;
}
inline void add(int u,int v)
{
    e[++tot]=edge{v,fir[u]};
    fir[u]=tot;
    return;
}
bool dfs(int u)
{
    bool ret=0;
    for(int i=fir[u],v;v=e[i].to,i;i=e[i].nex) {
        if(!dep[v]) {
            dep[v]=dep[u]+1;
            ret|=dfs(v);
            val[u]-=val[v],val[v]=0;
        } else {
            ret|=((dep[u]-dep[v])^1)&1;
        }
    }
    return ret;
}
int main()
{
    t=read();
    while(t--) {
        init();
        n=read(),m=read();
        for(int i=1;i<=n;++i) {
            val[i]=read();
        }
        for(int i=1;i<=n;++i) {
            val[i]-=read();
        }
        for(int opt,x,y;m;--m) {
            opt=read(),x=read(),y=read();
            if(opt==1) {
                o[++cnt]=operation{x,y};
            } else {
                x=find(x),y=find(y);
                if(x==y) {
                    continue;
                }
                fa[y]=x,val[x]+=val[y];
            }
        }
        for(int i=1;i<=cnt;++i) {
            o[i].x=find(o[i].x),o[i].y=find(o[i].y);
            add(o[i].x,o[i].y),add(o[i].y,o[i].x);
        }
        for(int i=1;i<=n;++i) {
            if(fa[i]||dep[i]) {
                continue;
            }
            dep[i]=1;
            ans&=!(dfs(i)?val[i]&1:val[i]);
        }
        puts(ans?"YES":"NO");
    }
    return 0;
}
```
