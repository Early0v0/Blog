---
title: Splay 学习笔记
categories:
  - 笔记
tags:
  - Splay
date: 2020-03-12 15:28:18
---

## 简介

Splay 是二叉查找树的一种，它通过访问节点时将其旋转到根节点，使查找树尽量维持平衡。

<!-- more -->

## 实现

每个节点需保存它所维护的值 $val$，这个值所出现的次数 $cnt$，它的子树大小 $size$，它的父节点 $fa$ 以及它的左儿子 $son_0$ 和右儿子 $son_1$。

> 说明：代码中 $t$ 即 $\&t[0]$，是定义的一个空节点，其 $val,cnt,siz$ 均为 $0$，父亲和儿子都指向自己。

```cpp
struct splay_tree {
    int val,cnt,siz;
    splay_tree *fa,*son[2];
}t[N+1],*root;
```

### 更新子树大小

节点改变后更新它的 $siz$。

```cpp
inline void maintain(splay_tree *x)
{
    x->siz=x->cnt+x->son[0]->siz+x->son[1]->siz;
    return;
}
```

### 销毁节点

前提是已经将它移至叶子节点。

```cpp
inline void clear(splay_tree *x)
{
    x->val=x->cnt=x->siz=0;
    x->fa=x->son[0]=x->son[1]=t;
    return;
}
```

### 上旋

本质上是将一个节点上移一个位置。

上旋分为两种：左儿子上旋为右旋，右儿子上旋为左旋。

![右旋前 右旋后](rotate.png)

步骤如下（以右旋为例）：

1. 将 $Fa$ 的左儿子指向 $Xson2$，$Xson2$ 的父亲指向 $Fa$；
2. 将 $X$ 的右儿子指向 $Fa$，$Fa$ 的父亲指向 $X$；
3. 如果 $Fa$ 有父亲（记为 $FFa$），则将 $X$ 的父亲指向 $FFa$，$FFa$ 的儿子（原来 $Fa$ 所在位置）指向 $X$；
4. 更新 $X$ 和 $Fa$ 的 $siz$ 值。

```cpp
void rotate(splay_tree *x)
{
    splay_tree *fa=x->fa,*ffa=fa->fa;
    int ch=x==x->fa->son[0]?0:1;
    fa->son[ch]=x->son[ch^1],x->son[ch^1]->fa=fa;
    x->son[ch^1]=fa,fa->fa=x,x->fa=ffa;
    if(ffa!=t) {
        ffa->son[fa==ffa->son[0]?0:1]=x;
    }
    maintain(fa),maintain(x);
    return;
}
```

### Splay 操作

将访问的节点旋转到根节点。

- 如果 $X$ 的父亲是根节点，直接将 $X$ 上旋，结束操作；
- 如果 $X$ 与其父亲儿子类型相同，先上旋其父亲，再上旋 $X$；
- 否则连续上旋两次 $X$。

```cpp
void splay(splay_tree *x)
{
    for(splay_tree *fa=x->fa;fa=x->fa,fa!=t;rotate(x)) {
        if(fa->fa!=t) {
            rotate((x==fa->son[0])==(fa==fa->fa->son[0])?fa:x);
        }
    }
    root=x;
    return;
}
```

### 建立 Splay

先将数据升序排序（假设需要插入 $a$ 数组），然后用类似建立线段树的方法递归建立。

```cpp
splay_tree *build(splay_tree *fa,int l,int r)
{
    if(l>r) {
        return t;
    }
    int mid=(l+r)>>1;
    splay_tree *x=&(t[++tot]=splay_tree{a[mid],1,0,fa,{t,t}});
    x->son[0]=build(x,l,mid-1),x->son[1]=build(x,mid+1,r);
    maintain(x);
    return x;
}
```

### 插入值

- 如果树为空，则新建根节点并插入，结束操作；
- 否则由根开始遍历：
  - 如果当前节点的权值等于 $val$，则当前节点的 $cnt$ 值 +1，更新节点和父亲的 $siz$ ，并对当前节点进行 Splay 操作；
  - 如果当前节点为空，则在此新建节点即可；
  - 否则按照二叉查找树的性质向下递归。

```cpp
void insert(int val)
{
    if(root==t) {
        t[++tot]=splay_tree{val,1,1,t,{t,t}};
        root=&t[tot];
        return;
    }
    splay_tree *x=root,*fa=t;
    while(true) {
        if(x->val==val) {
            ++x->cnt;
            maintain(x),maintain(fa);
            splay(x);
            return;
        }
        fa=x,x=x->son[x->val<val];
        if(x==t) {
            t[++tot]=splay_tree{val,1,1,fa,{t,t}};
            fa->son[val>fa->val]=&t[tot];
            maintain(&t[tot]),maintain(fa);
            splay(&t[tot]);
            return;
        }
    }
}
```

### 查询 val 的排名

- 初始排名为 $1$；
- 如果 $val$ 比当前节点的权值小，则递归左子树；
- 如果 $val$ 比当前节点的权值大，则将答案加上左子树的 $siz$ 和当前节点的 $cnt$，递归右子树；
- 如果 $val$ 等于当前节点的权值，返回答案；
- 最后进行 Splay 操作。

```cpp
int val2rank(int val)
{
    int ret=1;
    splay_tree *x=root;
    while(x!=t) {
        if(val<x->val) {
            x=x->son[0];
        } else {
            ret+=x->son[0]->siz;
            if(val==x->val) {
                splay(x);
                return ret;
            }
            ret+=x->cnt;
            x=x->son[1];
        }
    }
}
```

### 查询排名为 rnk 的数

- 如果 $rnk$ 小于等于当前节点左子树的 $siz$，则递归左子树；

- 否则将 $rnk$ 减去左子树的 $siz$ 和当前节点的 $cnt$，如果 $rnk\leq0$，则返回当前节点的权值，否则递归右子树。

```cpp
int rank2val(int rnk)
{
    splay_tree *x=root;
    while(true) {
        if((x->son[0]!=t)&&(rnk<=x->son[0]->siz)) {
            x=x->son[0];
        } else {
            rnk-=x->son[0]->siz+x->cnt;
            if(rnk<=0) {
                return x->val;
            }
            x=x->son[1];
        }
    }
}
```

### 删除值

- 先找到值为 $val$ 的节点，将其进行 Splay 操作（可以通过查询 $val$ 的排名实现）；
- 如果它的 $cnt$ 值大于 $1$，则令 $cnt\gets cnt-1$ 即可；
- 如果它是唯一的节点，则直接删除节点；
- 如果它只有一个儿子，则令它的儿子作根，然后删除节点；
- 否则找到值小于 $val$ 的最大节点进行 Splay 操作，令根的右子树为值为 $val$ 的节点的右子树，更新根的 $siz$，最后删除节点。

```cpp
void del(int val)
{
    val2rank(val);
    if(root->cnt>1) {
        --root->cnt,--root->siz;
        return;
    }
    if((root->son[0]==t)&&(root->son[1]==t)) {
        clear(root);
        root=t;
        return;
    }
    for(int i=0;i<2;++i) {
        if(root->son[i]!=t) {
            continue;
        }
        splay_tree *x=root;
        root=root->son[i^1];
        root->fa=t;
        clear(x);
        return;
    }
    splay_tree *x=root->son[0],*rt=root;
    while(x->son[1]!=t) {
        x=x->son[1];
    }
    splay(x);
    rt->son[1]->fa=x,x->son[1]=rt->son[1];
    clear(rt);
    maintain(root);
    return;
}
```

### 查询 val 的前驱

插入 $val$，在根的左子树中找最大的值（即一直向右子树寻找），最后删除 $val$。

```cpp
int val2pre(int val)
{
    insert(val);
    splay_tree *x=root->son[0];
    while(x->son[1]!=t) {
        x=x->son[1];
    }
    int ret=x->val;
    del(val);
    return ret;
}
```

### 查询 val 的后继

同查询前驱类似。

```cpp
int val2suc(int val)
{
    insert(val);
    splay_tree *x=root->son[1];
    while(x->son[0]!=t) {
        x=x->son[0];
    }
    int ret=x->val;
    del(val);
    return ret;
}
```

## 资料

> 本文部分参考 [Splay - OI Wiki](https://oi-wiki.org/ds/splay)。
