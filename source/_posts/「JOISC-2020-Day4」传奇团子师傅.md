---
title: 「JOISC 2020 Day4」传奇团子师傅
categories:
  - 题解
tags:
  - 模拟退火
date: 2021-02-03 09:18:47
---

[题目链接](https://loj.ac/problem/3281)

## 题意

给出网格图，每格有一个团子。可以按「粉 - 白 - 绿」在八个方向串成一串团子。每个团子只能被串至多一次。最大化串出的团子串数。

<!-- more -->

## 思路

对网格图上每种可能串出的团子串建立点，每对冲突的团子串连边。  
问题转化为求最大的点集使得任意两点没有连边。

考虑模拟退火即可，注意降温系数不能太高。

## 代码

```cpp
#include<cstdio>
#include<vector>
#include<random>
#include<ctime>
#include<cmath>
#define For(i,l,r) for(int i=l;i<r;++i)
using namespace std;
const int N=500,D=8;
const int dx[D]={0,-1,-1,-1,0,1,1,1},dy[D]={1,1,0,-1,-1,-1,0,1};
const double T0=100,TD=0.9999999;
int n,m;
char mp[N][N];
int id[N][N][D];
int goal;
namespace random {
    mt19937 rnd(time(0));
    inline double rand01()
    {
        return (double)rnd()/0xffffffff;
    }
    inline int rand(int l,int r)
    {
        return l+rnd()%(r-l+1);
    }
}
namespace graph {
    int p;
    vector<int>e[N*N+1];
    struct plan {
        bool sel[N*N+1];
        int cnt;
        plan()
        {
            cnt=0,fill(sel,sel+N*N+1,false);
            return;
        }
    };
    inline int newPoint()
    {
        return ++p;
    }
    inline void addEdge(int u,int v)
    {
        e[u].push_back(v),e[v].push_back(u);
        return;
    }
    int calc(plan *pla,int u)
    {
        int ret=1;
        for(int v:e[u]) {
            if(pla->sel[v]) {
                --ret;
            }
        }
        return ret;
    }
    void select(plan &pla,int u)
    {
        pla.sel[u]=true,++pla.cnt;
        for(int v:e[u]) {
            if(pla.sel[v]) {
                pla.sel[v]=false,--pla.cnt;
            }
        }
        return;
    }
}
inline bool checkMp(int x,int y,char c)
{
    return (x>=0)&&(x<n)&&(y>=0)&&(y<m)&&(mp[x][y]==c);
}
void generateGraph()
{
    For(i,0,n) {
        For(j,0,m) {
            if(mp[i][j]!='W') {
                continue;
            }
            For(d,0,D) {
                if(checkMp(i+dx[d],j+dy[d],'P')&&checkMp(i-dx[d],j-dy[d],'G')) {
                    id[i][j][d]=graph::newPoint();
                }
            }
        }
    }
    For(i,0,n) {
        For(j,0,m) {
            switch(mp[i][j]) {
                case 'W': {
                    For(d1,0,D-1) {
                        if(!id[i][j][d1]) {
                            continue;
                        }
                        For(d2,d1+1,D) {
                            if(id[i][j][d2]) {
                                graph::addEdge(id[i][j][d1],id[i][j][d2]);
                            }
                        }
                    }
                    break;
                }
                case 'P': {
                    For(d1,0,D-1) {
                        if(!checkMp(i-dx[d1],j-dy[d1],'W')||!checkMp(i-dx[d1]*2,j-dy[d1]*2,'G')) {
                            continue;
                        }
                        For(d2,d1+1,D) {
                            if(checkMp(i-dx[d2],j-dy[d2],'W')&&checkMp(i-dx[d2]*2,j-dy[d2]*2,'G')) {
                                graph::addEdge(id[i-dx[d1]][j-dy[d1]][d1],id[i-dx[d2]][j-dy[d2]][d2]);
                            }
                        }
                    }
                    break;
                }
                case 'G': {
                    For(d1,0,D-1) {
                        if(!checkMp(i+dx[d1],j+dy[d1],'W')||!checkMp(i+dx[d1]*2,j+dy[d1]*2,'P')) {
                            continue;
                        }
                        For(d2,d1+1,D) {
                            if(checkMp(i+dx[d2],j+dy[d2],'W')&&checkMp(i+dx[d2]*2,j+dy[d2]*2,'P')) {
                                graph::addEdge(id[i+dx[d1]][j+dy[d1]][d1],id[i+dx[d2]][j+dy[d2]][d2]);
                            }
                        }
                    }
                    break;
                }
            }
        }
    }
    return;
}
double T=T0;
graph::plan res;
void simulatedAnnealing()
{
    using namespace graph;
    plan sol;
    for(int cnt=1;sol.cnt<goal;++cnt) {
        int u;
        do {
            u=random::rand(1,p);
        } while(sol.sel[u]);
        int tem=calc(&sol,u);
        if((tem>=0)||(random::rand01()<=exp((double)tem/T))) {
            select(sol,u);
        }
        T*=TD;
        if(cnt%100000==0) {
            fprintf(stderr,"Cnt: %d, Tem: %lf, Sol: %d\n",cnt,T,sol.cnt);
        }
    }
    res=sol;
    return;
}
struct output {
    ~output()
    {
        For(i,0,n) {
            For(j,0,m) {
                if(mp[i][j]=='W') {
                    bool flag=false;
                    For(d,0,D) {
                        if(res.sel[id[i][j][d]]) {
                            putchar("-/|\\-/|\\"[d]);
                            flag=true;
                            break;
                        }
                    }
                    if(!flag) {
                        putchar('W');
                    }
                } else {
                    putchar(mp[i][j]);
                }
            }
            putchar('\n');
        }
        return;
    }
}op;
int main(int argc,char *argv[])
{
    freopen(argv[1],"r",stdin);
    freopen(argv[2],"w",stdout);
    scanf("%d%d",&n,&m);
    For(i,0,n) {
        scanf("%s",mp[i]);
    }
    generateGraph();
    sscanf(argv[3],"%d",&goal);
    simulatedAnnealing();
    fputs("Finish.\n",stderr);
    return 0;
}
```