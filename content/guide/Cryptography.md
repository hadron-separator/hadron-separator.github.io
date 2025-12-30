## One-time pads and Vernan ciphers
- It has provably unbreakable encryption
- **Encryption method** - Each character in the plaintext is transformed into a corresponding character in the ciphertext
- **Substitution technique** -  In the case of the OTP, this substitution is achieved by assigning a unique numerical value to each character in the plain text
- 
## Perfect Secrecy-
***Definition:*** An encryption scheme (Gen,Enc,Dec) with message space $M$ is perfectly
secret if for every probability distribution for $M$, every message $m \in M$ , and every
ciphertext $c \in C$ for which $Pr[C = c] > 0$:

> $Pr[M =m | C =c] = Pr[M = m].$

(The requirement that $Pr[C = c] > 0$ is a technical one needed to prevent conditioning
on a zero-probability event.)

- Another **equivalent definition** ***(defn 2)*** for perfectly secure scheme would be
For all probability distributions of $M, \forall m \in M \: and \: c\in C$ 
> $Pr[C = c | M = m ] = Pr[C = c]$

**Proof-**
We know 
> $Pr[M =m | C =c] = Pr[M = m]$
> $\implies \frac{Pr[M =m | C =c] \times Pr[C = c]} {Pr[M = m]}= Pr[C = c]$  {just multiplying and dividing by P(C)}
> $\implies Pr[C = c | M = m ] = Pr[C = c]$

- Another **equivalent definition** ***(defn 3)*** of perfect secrecy would be
For all probability distributions of $M, \forall m_0, m_1 \in M \: and \: c\in C$ 
> $Pr[C = c | M = m_0 ] = Pr[C = c | M = m_1 ]$

**Proof-**
> $Pr(C = c) = \Sigma_{m\in M} Pr[M = m].Pr[C = c | M = m]$ 
>  {$Pr[C = c | M = m]$ is the same for every $m \in M$ from definition}
>  
>   $\implies Pr(C = c) = Pr[C = c | M = m] \Sigma_{m\in M}Pr[M = m]$ 
>  {$\Sigma_{m\in M}Pr[M = m] = 1$} 
>
>$\implies Pr[C = c | M = m ] = Pr[C = c]$ {which is definition 2}


***Definition:*** An encryption scheme is **perfectly indistinguishable** if no adversary A can
succeed with probability better than 1/2.
### Limitations of perfect secrecy:
***Thm:*** If $|k| < |M|$ then it is impossible to have perfect secrecy
***Proof:*** Let $M(c)$ be the set of all possible messages that are possible decryptions of $c$
that is 
> $M(c) = {m | m = (c) Dec_k(c) \: for\: some\: k\in K}$ 

Since $|K| < |M|$, there are fewer keys than messages. Therefore, not all messages can be
potential decryptions for a given ciphertext. And here , clearly $|M(c)| \leq |K|$. (Recall
that we may assume Dec is deterministic.) If $|K| < |M|$, there is some $m’ \in M$ such that
$m’ \notin M(c)$.
But then
> $Pr[M = m’ | C = c] = 0 \neq Pr[M = m’]$

Therefore violating the condition of perfect secrecy
## Shannon's theory
***Thm:***  Let (Gen, Enc, Dec) be an encryption scheme with message space $M$, for
which $|M| = |K| = |C|$. The scheme is perfectly secret **if and only if**:
1. Every key $k \in K$ is chosen with (equal) probability $1/|K|$ by Gen.
2. For every $m \in M$ and every $c \in C$, there is a unique key $k \in K$ such that $Enc_k(m)$
outputs $c$.

For an encryption scheme to achieve perfect secrecy, the joint probability distribution
$Pr[M = m, C = c]$ is equal to the product of the individual probabilities 
$Pr[M = m] · Pr[C = c]$, where $m \in M and c \in C$. Mathematically, this can be expressed as:
> $Pr[M = m, C = c] = Pr[M = m] · Pr[C = c]$


### Some relaxations:
- some relaxations that we make to make computational cryptography possible-
	- Only deal with efficient Adversaries -  PPTM
	- Allow the adversaries to predict the answer correctly a negligible amount of times more than random guesses.

### One way functions (OWF):
***Definition :*** A function $f : {0, 1}^∗ → {0, 1}^∗$ is one-way if the following two conditions
hold:
1. (Easy to compute) There exists a polynomial-time algorithm $M_f$ computing f ; 
   that is, $M_f(x) = f(x), \forall x$ (1)
2. (Hard to invert) For every probabilistic polynomial-time algorithm $A$, there is a negligible function $negl$ such that :
$P[Invert_{A,f} (n) = 1] \leq negl(n)$ 

That is, for every probabilistic polynomial-time algorithm $A$, there exists a negligible function $negl$ such that :
$P [A(1^n, f (x))\in f^{−1}f (x)] \leq negl(n)$

## Discrete log problem (DLP):
- We take a group, lets say $\mathbb{Z}^{*}_{11}$ = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10} where multiplication modulo p is the composition operator.
- We then find the generator of the group - 2
- $2^0 = 1, 2^1 = 2, ...$
{2, 4, 8, 5, 10, 9, 7, 3, 6, 1} is the generated group
$\implies \log_2 2 = 1$
$\implies \log_2 10 = 5$
$\implies \log_2 1 = 10$ and so on..

Assumption: Finding the discrete log of a number in the $\mathbb{Z}_p^*$ group is HARD

## Hardcore Predicates
***Definition:*** A function $B : {0, 1}^∗ → {0, 1}$ is a hard-core bit for a function f if and only if
for every PPT $A$, the function $\epsilon$ : N → N is negligible where
$\epsilon(n) = Pr[A(f(x)) = B(x) | x \leftarrow U_n] − 1/2$
### MSB-DLP
MSB is a hardcore predicate for the discrete log problem
$\implies$ Finding the MSB of the discrete log is as hard as finding the entire discrete log itself

**Proof:** If one knows $MSB_{(p, g)}(x)$ then they can find $DLP_{(p, g)}(x)$ using the following-
- If $z$ is a square modulo $p$, there is a randomized algorithm to find $w$ such that $w^2 \equiv z(mod\:p)$ 
- $y$ is  square modulo $p$ if and only if $y \equiv g^{2k}(mod\:p)$ for some integer $k$

From Fermats little theorem, we know for any number $a$ and a prime $p$, $a^{p-1} \equiv 1 (mod \: p)$ 
Using this we can say that $y^{\frac{p-1}{2}} \equiv 1 (mod\: p)$ 

Given some $q \equiv g^x (mod \: p)$, we can determine the lower order bits of $x$ as follows-
Define:
$r = q$ if $q$ is a square-modulo $p$
$r = g^{-1}q$ if $q$ is **not** a square-modulo $p$

Now we know for sure that $r$ is a square-modulo p.
$\implies r \equiv g^{2k} (mod \: p)$ such that $2k = x$ if x is even or $2k = x-1$ if x is odd
$\therefore$ we can say $k$ is $x$ right shifted by 1-bit

We know there exists an efficient algorithm to find the square root.
$\therefore$ we can efficiently find the values $s = g^k$ or $s=g^{-k} = g^{\frac{p-1}{2} + k}$
### LSB-DLP
### CPA Attack
### Probabilistic Encryption
Probabilistic encryption adds randomness to the encryption process, making it less
predictable. This means that encrypting the same message multiple times with the
same key will produce different results each time.
> $Enc(x) = (f (r), x \bigoplus h(r))$
- x is the plaintext,
- r is a random value or nonce used in the encryption process,
- f and h are cryptographic functions,
- ⊕ denotes XOR operation.

- The key technique behind probabilistic encryption is that, we first append some random bits to the actual message and then encrypt it.
- So for the decryption part we do-
> $Dec(y, z) = h(f^{−1}(y)) \bigoplus z$ 

 - $y = f(r)$ is the first part of the ciphertext
	 - $f^{-1}(y)$ = r
 - $z=x\bigoplus h(r)$ is the second part of the ciphertext
	 - $h(f^{-1}(y))+z = h(r)\bigoplus x\bigoplus h(r) = x$
Ok, this is cool. Now I get it. There is some trapdoor information that the sender and receiver share. This can be used to invert the cryptographic functions $f$ and $h$
Since the adversary does not have the trapdoor information, $f$ cant be inverted. Therefore, can't gain knowledge of the random $r$ nonce chosen. Therefore making the scheme probabilistically encrypted

### Cryptogrpahic Attacks
#### Ciphertext only - 
Only the ciphertext is known to the adversary. This is just a normal eavesdropper in an insecure channel
#### Known Plaintext -
The adversary knows a plaintext and its corresponding ciphertext
#### Chosen Plaintext Attack -
The adversary knows has access to the encryption function. Therefore, given any plaintext, the adversary knows the corresponding ciphertext
#### Chosen  Ciphertext Attack - 
The adversary has access to both the encryption and the decryption function.. But the catch is, the **adversary can't use the decryption function on the ciphertext that needs to be decrypted**
### PRG
***Defn:*** Let $G$ be a deterministic polynomial-time algorithm such that for any $n$ and
any input $s ∈ {0, 1}^n$, the result $G(s)$ is a string of length $l(n)$. $G$ is a pseudorandom generator if the following conditions hold:
1. (Expansion.) For every n it holds that $l(n) > n$.
2. (Pseudorandomness.) For any ppt algorithm $D$, there is a negligible function $negl$ such that
> $Pr[D(G(s)) = 1] − Pr[D(r) = 1] \leq negl(n)$

where the first probability is taken over uniform choice of $s \in {0, 1}^n$ and
the randomness of $D$, and the second probability is taken over uniform
choice of $r ∈ \{0, 1\}^{l(n)}$ and the randomness of $D$
### EAV secure from PRG
***Defn:*** EAV secure - the message is secure from an eavesdropper => it is secure against known plaintext attack and known ciphertext attack

Let $G$ be a pseudorandom generator with expansion factor $l(n)$. Define a
fixed-length private-key encryption scheme for messages of length $l(n)$ as follows:
 - Gen: on input $1^n$, choose uniform $k \in \{0, 1\}^n$ and output it as the key.
 - Enc: on input a key $k \in \{0, 1\}^n$ and a message $m \in \{0, 1\}^{ℓ(n)}$, output the ciphertext 
 > $c := G(k) \bigoplus m.$
 
 - Dec: on input a key $k \in \{0, 1\}^n$ and a ciphertext $c \in \{0, 1\}^{ℓ(n)}$, output the message
> $m := G(k) \bigoplus c.$

***Thm:*** If $G$ is a pseudorandom generator, then Theorem 1 is an EAV-secure, fixed-
length private-key encryption scheme for messages of length $l(n)$
***Proof Idea:*** Use a small key $k$. Using $k$ and the PRG $G$, generate a longer key of length $l(n)$ that can then be used for security the same way as One-time Pad.

***Thm:*** There is a private-key encryption scheme that has **indistinguishable encryptions** in the presence of an eavesdropper, but **not indistinguishable multiple encryptions** in
the presence of an eavesdropper.
***What this means?:*** The same message when encrypted using the same input key to the PRG gives the same output. Therefore it is not multi-message secure. It is single message secure.
***Proof:*** 
<!-- ![[images/NoCPA_using_PRGs.png]] -->

<img src="content/guide/images/NoCPA_using_PRGs.png" alt="CPA security is not possible with just PRGs" width="100%">

Adversary gives two messages, $M_0=(0^L, 0^L), M_1=(0^L, 1^L)$ to the green Man - Encryption algorithm
The green man randomly chooses one of $M_0$ and $M_1$ and encrypts it and sends it back to the Adversary
Now the adversary can check if both the encryptions were the same or not. If both the encryptions are the same, then it means message vector $M_0$ was sent, otherwise, $M_1$ was sent.

### CPA Security
- In CPA attacks, the adversary knows has access to the encryption function. Therefore, given any plaintext, the adversary knows the corresponding ciphertext.
- The adversary queries the encryption algorithm such that it can maximize the probability of some function of the underlying message vector

<img src="content/guide/images/CPA_sec_defn.png" alt="Alt text" width="100%">

- the adversary has access to the encryption function. Therefore, can encrypt any message it wants, including $m_0, m_1$
	- For this reason, it is necessary for the messages $m_0, m_1$ to have different encryption each time. Therefore, we need to have probabilistic encryption
- There is another critical condition that the adversary needs to satisfy, the messages $m_0, m_1$ must be such that $|m_0| = |m_1|$


***Setting:*** The CPA indistinguishability experiment $PrivK^{cpa}_{A,\Pi}(n)$ is defined for any encryption scheme
$\Pi = (Gen, Enc, Dec)$, adversary $A$, and security parameter $n$ as follows:
1. Generate a key $k$ by running $Gen(1^n)$.
2. Provide $A$ with input $1^n$ and oracle access to $Enc_k(·)$. A outputs a pair of messages
$m_0, m_1$ of the same length.
3. Choose a uniform bit $b \in \{0, 1\}$, then compute and provide $A$ with the ciphertext
$c = Enc_k(m_b)$
4. A continues to have oracle access to $Enc_k(·)$ and outputs a bit $b_0$.
5. The output of the experiment is 1 if $b_0 = b$, and 0 otherwise. In the former case, we say
that A succeeds.

***Thm:*** Theorem 4 :- A private-key encryption scheme $\Pi = (Gen, Enc, Dec)$ has indistinguishable encryptions under a chosen-plaintext attack, or is CPA-secure, if for all probabilistic polynomial-time adversaries $A$ there is a negligible function $negl$ such that:
$Pr[PrivK^{cpa}_{A,\Pi}(n)=1] \leq 1/2 + negl(n)$

***Thm:*** Any private-key encryption scheme that is CPA-secure is also CPA-secure for
multiple encryptions
### PRF
$F : \{0, 1\}^n \times \{0, 1\}^l \rightarrow \{0, 1\}^L$ is a PRF, where the first n-bit input is the "key" of the PRF and the next n-bits is the input "block" to the PRF


<img src="content/guide/images/PRF_defn.png" alt="Alt text" width="100%">

Pseudo random permutation - PRP
The only differnece between PRF and PRP is that, PRP is a bijection
$\implies$ The input length and output length both are $L$


<img src="content/guide/images/PRP_defn.png" alt="Alt text" width="100%">


### CCA Security
CCA attack is the case where the adversary is an active adversary. 
$\implies$ the adversary can actively change the contents of the cipher sent on the channel. This is equivalent to the adversary having access to the decoder to decode any ciphertext, except the cipher in contention
### Message Authenticating Codes
#### CBC MACs (done)
#### Variable Length MACs (done)
### Hashing and Collision resistance 

### RSA Assumption
- GenRSA(n) $\longrightarrow (N, p, q, e, d)$ where $p, q$ are primes whose product is $N$
- $\phi(N) = (p-1)(q-1)$
- $e$  is such that $gcd(e, \phi(N))=1$
- We know $a^{\phi(N)} \equiv 1(mod N)$
$\implies a^{\phi(N)-1}$ is the inverse of $a$ in $Z_N^*$
- $d := e^{-1} mod\: \phi(N)$
- We also know $a^x mod\:N = a^{x mod\:\phi(N)} mod\:N$
- $\implies a^{ed\:mod\:\phi(N)} mod\:N = a\:mod\:N = a$ ------------------ (1)
**RSA Assumption** - Given $(N, e, y)$ where $y \in Z_n^*$
- It is hard to compute the $e^{th}$ root of $y\: mod(N)$
$\implies$ it is hard to compute $x$ such that-
$x^e \equiv y\:\: (mod\: N)$

RSA Assumption is stronger than Factoring assumption-
This is because, if factoring can be solved, then we can compute $d$ for the given $e$
Using 1, this implies, for $x = y^d, x^e \equiv 1 (mod\: N)$
therefore, we can calculate $x$ efficiently as $y$ is given and $d$ can be found efficiently
