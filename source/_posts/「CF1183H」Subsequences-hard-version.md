---
title: 「CF1183H」Subsequences (hard version)
categories:
  - 题解
tags:
  - DP
  - 容斥
date: 2020-02-27 17:13:09
---

[题目链接](http://codeforces.com/contest/1183/problem/H)

## 题意

在本题中，子串是可以通过删去原串若干个字符得到的字符串。特别的，空串也算子序列。

给定一个长度为 $n$ 的字符串 $s$，选出 $k$ 个**本质不同**的子串，最小化代价。

选择一个长度为 $m$ 的子串的代价为 $n-m$，即删去的字符数量。

<!-- more -->

## 思路

考虑 DP 求解。

设 $f_{i,j}$ 为前 $i$ 个字符中长度为 $j$ 的本质不同的子串数量。

容易想到 $f_{i,j}=f_{i-1,j}+f_{i-1,j-1}$。

但这样可能选出重复子串。

比如字符串 `aab`，在 $f_{3,2}$ 时子串 `ab` 会被算两次。

考虑容斥，记 $las_c$ 为字符 $c$ 上次出现时的所在位置。

$f_{i,j}$ 还要减去由 $las_{s(i)}$ 结尾的所有子串数量，即 $f_{las_{s(i)}-1,j-1}$。

推出转移方程：

$$
f_{i,j}=
\begin{cases}
f_{i-1,j}+f_{i-1,j-1}&las_{s_i}=0\\
f_{i-1,j}+f_{i-1,j-1}-f_{las_{s(i)-1},j-1}&otherwise
\end{cases}
$$

最后求答案时，尽量选长度长的子串。

## 实现

空串也算子串，所以 $f_{i,0}=1$。

若 $k>\sum_{i=0}^nf_{n,i}$，输出 `-1` 即可。

时间复杂度为 $O(n^2)$，其实数据可加强（你在想什么）。

## 代码

```cpp
#include<cstdio>
using namespace std;
const int N=100;
int n,las['z'+1];
long long k,f[N+1][N+1],ans;
char s[N+2];
template<class T>inline T min(T x,T y)
{
    return x<=y?x:y;
}
int main()
{
    scanf("%d%I64d",&n,&k);
    scanf("%s",s+1);
    f[0][0]=1;
    for(int i=1;i<=n;++i) {
        f[i][0]=1;
        for(int j=1;j<=n;++j) {
            f[i][j]=f[i-1][j]+f[i-1][j-1];
            if(las[s[i]]) {
                f[i][j]-=f[las[s[i]]-1][j-1];
            }
        }
        las[s[i]]=i;
    }
    for(int i=n;(~i)&&k;--i) {
        long long tem=min(k,f[n][i]);
        k-=tem,ans+=tem*(n-i);
    }
    k?puts("-1"):printf("%I64d\n",ans);
    return 0;
}
```
