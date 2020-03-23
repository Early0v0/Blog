---
title: 「AHOI/HNOI2017」礼物
categories:
  - 题解
tags:
  - FFT
date: 2020-03-16 14:46:16
---

[题目链接](https://loj.ac/problem/2020)

## 题意

给定两个可旋转但不可翻转的环 $x,y$，支持整个环同时增加一个整数，最小化 $\sum_{i=1}^n(x_i-y_i)^2$。

<!-- more -->

## 思路

把所有条件整合到一起，即求 $\sum_{i=1}^n(x_i-y_{i-l}+k)^2\ (l,k\in\mathbb Z)$ 的最小值。

将其展开：

$$
\begin{aligned}\sum_{i=1}^n(x_i-y_{i-l}+k)^2&=\sum_{i=1}^n((x_i-y_{i-l})^2+2\cdot(x_i-y_{i-l})\cdot k+k^2)\\&=\sum_{i=1}^n(x_i^2+y_i^2)-2\cdot\sum_{i=1}^n(x_i\cdot y_{i-l})+n\cdot k^2+2\cdot\sum_{i=1}^n(x_i-y_i)\cdot k\end{aligned}
$$

其中，第一项可以直接求出，第三项与第四项组成了一个关于 $k$ 的一元二次方程组，求出对称轴 $k=-\frac{\sum_{i=1}^n(x_i-y_i)}{n}$，将 $\lfloor k\rfloor$ 和 $\lceil k\rceil$ 代入原式，取个 $\min$ 值即可。

第二项需要用到 FFT 求出。

将 $x$ 序列复制一遍（因为是环），$y$ 序列反转，则 $x_i\cdot y_{i+l}$ 变为 $x_i\cdot y_{n-i+l}$，这个单项式的次数是 $n+l$ 的。

我们只要对 $x$ 和 $y$ 进行 FFT 卷积，然后第二项的值减去 $2\cdot\max(f_i)\ (n+1\leq i\leq2\cdot n)$ 即可。

## 实现

注意 FFT 的精度误差。

## 代码

```cpp
#include<cstdio>
#include<cmath>
#include<algorithm>
using namespace std;
const int N=50000,S=1<<18;
const double Pi2=acos(-1)*2;
int n,m,a[N+1],b[N+1],suma,sumb,sqra,sqrb,tot,len=1,rev[S],maxn,ans;
struct com {
    double x,y;
    com operator+(com ano)const
    {
        return com{x+ano.x,y+ano.y};
    }
    com operator-(com ano)const
    {
        return com{x-ano.x,y-ano.y};
    }
    com operator*(com ano)const
    {
        return com{x*ano.x-y*ano.y,x*ano.y+y*ano.x};
    }
}f[S],g[S];
void init_rev()
{
    for(int i=0;i<len;++i) {
        rev[i]=(rev[i>>1]>>1)|(i&1?(len>>1):0);
    }
    return;
}
void fft(com*f,bool flag)
{
    for(int i=0;i<len;++i) {
        if(i<rev[i]) {
            swap(f[i],f[rev[i]]);
        }
    }
    for(int i=2,l=1;i<=len;i<<=1,l<<=1) {
        com ide=com{cos(Pi2/i),flag?sin(Pi2/i):-sin(Pi2/i)};
        for(int j=0;j<len;j+=i) {
            com now=com{1,0};
            for(int k=j;k<j+l;++k) {
                com tem=now*f[l+k];
                f[l+k]=f[k]-tem;
                f[k]=f[k]+tem;
                now=now*ide;
            }
        }
    }
    return;
}
int main()
{
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;++i) {
        scanf("%d",&a[i]);
        suma+=a[i],sqra+=a[i]*a[i];
    }
    for(int i=1;i<=n;++i) {
        scanf("%d",&b[i]);
        sumb+=b[i],sqrb+=b[i]*b[i];
        tot+=b[i]-a[i],ans+=a[i]*a[i]+b[i]*b[i];
    }
    int l=floor(1.0*tot/n),r=ceil(1.0*tot/n);
    ans+=min(n*l*l-(tot*l<<1),n*r*r-(tot*r<<1));
    while(len<=n*3) {
        len<<=1;
    }
    init_rev();
    for(int i=1;i<=n;++i) {
        f[i].x=f[n+i].x=a[i];
        g[i].x=b[n-i+1];
    }
    fft(f,1),fft(g,1);
    for(int i=0;i<len;++i) {
        f[i]=f[i]*g[i];
    }
    fft(f,0);
    for(int i=n+1;i<=n<<1;++i) {
        maxn=max(maxn,int(f[i].x/len+0.5));
    }
    ans-=maxn<<1;
    printf("%d\n",ans);
    return 0;
}
```
