## §5.3 Asymptotic Behaviour of Efficient Algebraic Strategies

### Mathematical Foundation: Banach-Alaoglu Theorem

In the context of algebraic strategies, we utilize the **Banach-Alaoglu Theorem**. This theorem states that the closed unit ball of the **dual space** of a -algebra is **weak*-compact**.

More precisely, for a sequence of possibly sub-normalized states  on the algebra:

* Every sequence  will **weak*-converge**.


* There exists a **subsequence**  such that it converges to a **limit state**.


* In the bipartite case, this means:







---

### Tripartite Case and No-Signaling Conditions

When dealing with three parties (Alice, Bob, and Charlie) , we consider the asymptotic limit as .

**Theorem 12:** Consider an algebraic strategy for a tripartite compiled game. In the asymptotic limit, the sequence  weak*-converges to a limit state   such that:

#### 1. Alice to Bob No-Signaling

The limit state must satisfy the condition that Alice cannot signal to Bob:


This holds .

#### 2. Bob to Charlie No-Signaling

For the composite limit strategies  , the state must satisfy:


This ensures that **Bob cannot signal to Charlie**. This holds .

---

### Key Definitions & Equivalence

* 
**Weak*-Convergence in Tripartite Systems:** 

where .


* **Equivalent Operator Form:**





