---
title: Link Cut Tree 学习笔记
categories:
  - 笔记
tags:
  - LCT
  - Splay
date: 2020-03-24 15:04:356
---

## 简介

Link Cut Tree（简称 LCT）是使用 Splay 和实链剖分来维护森林的一个数据结构，它支持以下在线操作：

- 查询 / 修改链上的信息
- 换根
- 动态连边 / 删边
- 查询连通性
- ……

<!-- more -->

## 实现

在 LCT 中，每个 Splay 维护的是一条从上到下且深度**严格**递增的实链，且 Splay 按照点的深度排序。

不同于重链剖分，实链剖分选择的实儿子由我们自己决定。

![eg](eg.png)

比如这棵树，我们如果选择 $2,5$ 做实儿子，则实链有 $\{1,2,5\},\{3\},\{4\}$；如果选择 $3,4$ 做实儿子，则实链有 $\{1,3\},\{2,4\},\{5\}$。

实链剖分具有灵活的特性，可以方便地维护动态问题。

对于每条实链，我们为它创建一个 Splay 来维护。

它有以下性质：

1. 每个节点被有且仅有一个 Splay 包含；
2. 边分为实边和虚边，实边的两个端点在同一个 Splay 中，虚边则是从一个 Splay 中深度最低的节点指向另一个 Splay。

为了保持 Splay 的二叉树形状，我们让节点不指向虚儿子，只让儿子指向它（即“认父不认子”）。

### 前置操作

#### 存储方式

用 struct 和指针存储。

```cpp
struct tree {
    int val,sum;
    bool rev;
    tree *fa,*son[2];
};
tree nul{0,0,0,&nul,{&nul,&nul}};
```

#### 更新子树信息

[洛谷例题](https://www.luogu.com.cn/problem/P3690)要求维护的是异或和，所以代码中亦是如此。

```cpp
inline void push_up(tree *x)
{
    x->sum=x->val^x->son[0]->sum^x->son[1]->sum;
    return;
}
```

#### 判断是否为 Splay 的根

根据“认父不认子”，如果 $X$ 不是其父亲的左 / 右儿子，则它就是当前 Splay 的根。

```cpp
inline bool is_root(tree *x)
{
    return (x!=x->fa->son[0])&&(x!=x->fa->son[1]);
}
```

#### 判断儿子类型

与 Splay 的思想一致。

```cpp
inline int son_type(tree *x)
{
    return x==x->fa->son[0]?0:1;
}
```

#### 区间翻转

与 Splay 翻转的思想一致。

```cpp
inline void push_down(tree *x)
{
    if(!x->rev) {
        return;
    }
    x->son[0]->rev^=1,x->son[1]->rev^=1;
    swap(x->son[0],x->son[1]);
    x->rev=0;
    return;
}
```

#### Update 操作

将 $X$ 到根的所有节点 Push_down。

可用递归实现。

```cpp
void update(tree *x)
{
    if(!is_root(x)) {
        update(x->fa);
    }
    push_down(x);
    return;
}
```

#### 上旋

如果当前节点的父亲是 Splay 的根则需特判。

```cpp
void rotate(tree *x)
{
    tree *fa=x->fa,*ffa=fa->fa;
    int typ=son_type(x);
    if(!is_root(fa)) {
        ffa->son[son_type(fa)]=x;
    }
    fa->son[typ]=x->son[typ^1],x->son[typ^1]->fa=fa;
    x->son[typ^1]=fa,fa->fa=x;
    x->fa=ffa;
    push_up(fa),push_up(x);
    return;
}
```

#### Splay 操作

```cpp
void splay(tree *x)
{
    update(x);
    for(tree *fa;fa=x->fa,!is_root(x);rotate(x)) {
        if(!is_root(fa)) {
            rotate(son_type(x)==son_type(fa)?fa:x);
        }
    }
    push_up(x);
    return;
}
```

### Access 操作

将根节点到某个节点的所有边变为实边，并且将它的儿子全部设为虚儿子。

我们从 $X$ 出发，将其 Splay 到当前 Splay 树的根，然后将它的右儿子设置为空（即断开它与它的实儿子）。

然后我们跳到 $X$ 的父节点 $Fa$，同样将其 Splay 到根，然后将它的右儿子设置为 $X$。

循环处理，直到跳到树根。

```cpp
void access(tree *x)
{
    for(tree *ori=&nul;x!=&nul;ori=x,x=x->fa) {
        splay(x);
        x->son[1]=ori;
        push_up(x);
    }
    return;
}
```

### 换根

让指定点成为**原树**的根。

首先对 $X$ 进行 Access，此时 $X$ 一定为 Splay 树中深度最大的点。

> 原因：Access 将它的儿子全部设为虚儿子。

然后我们将 $X$ 进行 Splay，此时它就没有了右子树且成为了根节点。

最后将 $X$ 的翻转标记异或 $1$ 即可。

```cpp
void make_root(tree *x)
{
    access(x);
    splay(x);
    x->rev^=1;
    return;
}
```

### 找根

寻找 $X$ 所在**原树**的根。

与换根类似，首先对 $X$ 进行 Access，然后我们将 $X$ 进行 Splay，沿途 Push_down 并一路向左找即可（根的深度最浅）。

```cpp
tree *find_root(tree *x)
{
    access(x);
    splay(x);
    while(push_down(x),x->son[0]!=&nul) {
        x=x->son[0];
    }
    splay(x);
    return x;
}
```

### 访问原树的链

需保证 $X,Y$ 连通。

先将 $X$ 设为根，然后对 $Y$ 进行 Access 与 Splay，此时 $Y$ 上就维护了从 $X$ 到 $Y$ 的链上的信息。

```cpp
void split(tree *x,tree *y)
{
    make_root(x);
    access(y);
    splay(y);
    return;
}
```

> 虽然我很好奇为什么它叫 Split（分裂）。

> 终于到了 LCT 的 Link 和 Cut 了！:tada:

### 连边

使 $X$ 成为根，如果 $X,Y$ 不连通则将 $X$ 的父亲指向 $Y$。

```cpp
void link(tree *x,tree *y)
{
    make_root(x);
    if(find_root(y)!=x) {
        x->fa=y;
    }
    return;
}
```

### 断边

使 $X$ 成为根，如果 $X,Y$ **直接**连通则双向断开关系。

不要忘了更新 $X$ 维护的信息。

```cpp
void cut(tree *x,tree *y)
{
    make_root(x);
    if((find_root(y)==x)&&(y->fa==x)) {
        x->son[1]=y->fa=&nul;
        push_up(x);
    }
    return;
}
```

## 资料

> 本文部分参考[LCT 总结 - Flash_Hu](https://www.cnblogs.com/flashhu/p/8324551.html)。
