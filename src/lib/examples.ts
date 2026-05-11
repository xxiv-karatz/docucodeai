export type Example = { language: string; label: string; code: string };

export const EXAMPLES: Example[] = [
  {
    language: "python",
    label: "Python — quicksort recursive",
    code: `def qs(a):
    if len(a)<2:return a
    p=a[len(a)//2]
    return qs([x for x in a if x<p])+[x for x in a if x==p]+qs([x for x in a if x>p])`,
  },
  {
    language: "python",
    label: "Python — rock paper scissors",
    code: `def rps(p1,p2):
    w={'r':'s','p':'r','s':'p'}
    if p1==p2:return 'tie'
    return 'p1' if w[p1]==p2 else 'p2'
p1=input('p1 (r/p/s): ')
p2=input('p2 (r/p/s): ')
print(rps(p1,p2))`,
  },
  {
    language: "python",
    label: "Python — bubble sort",
    code: `def bs(a):
    n=len(a)
    for i in range(n):
        for j in range(0,n-i-1):
            if a[j]>a[j+1]:a[j],a[j+1]=a[j+1],a[j]
    return a`,
  },
  {
    language: "python",
    label: "Python — binary search",
    code: `def bsearch(a,t):
    l,r=0,len(a)-1
    while l<=r:
        m=(l+r)//2
        if a[m]==t:return m
        elif a[m]<t:l=m+1
        else:r=m-1
    return -1`,
  },
  {
    language: "python",
    label: "Python — linear search",
    code: `def ls(a,t):
    for i in range(len(a)):
        if a[i]==t:return i
    return -1`,
  },
  {
    language: "python",
    label: "Python — guess the number",
    code: `import random
n=random.randint(1,100)
g=0;t=0
while g!=n:
    g=int(input('guess 1-100: '))
    t+=1
    if g<n:print('higher')
    elif g>n:print('lower')
print('got it in',t,'tries')`,
  },
  {
    language: "python",
    label: "Python — tic tac toe winner check",
    code: `def w(b):
    l=[(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    for a,b2,c in l:
        if b[a]==b[b2]==b[c]!=' ':return b[a]
    return None`,
  },
  {
    language: "python",
    label: "Python — fizzbuzz",
    code: `for i in range(1,101):
    if i%15==0:print('FizzBuzz')
    elif i%3==0:print('Fizz')
    elif i%5==0:print('Buzz')
    else:print(i)`,
  },
  {
    language: "python",
    label: "Python — factorial recursive",
    code: `def f(n):
    if n<=1:return 1
    return n*f(n-1)
print(f(int(input('n: '))))`,
  },
  {
    language: "python",
    label: "Python — palindrome check",
    code: `def p(s):
    s=s.lower().replace(' ','')
    return s==s[::-1]
print(p(input('word: ')))`,
  },
  {
    language: "python",
    label: "Python — fibonacci sequence",
    code: `def fib(n):
    a,b=0,1
    for _ in range(n):
        print(a,end=' ')
        a,b=b,a+b
fib(int(input('how many: ')))`,
  },
  {
    language: "python",
    label: "Python — selection sort",
    code: `def ss(a):
    for i in range(len(a)):
        m=i
        for j in range(i+1,len(a)):
            if a[j]<a[m]:m=j
        a[i],a[m]=a[m],a[i]
    return a`,
  },
  {
    language: "python",
    label: "Python — coin flip simulator",
    code: `import random
n=int(input('flips: '))
h=t=0
for _ in range(n):
    if random.random()<0.5:h+=1
    else:t+=1
print('heads:',h,'tails:',t)`,
  },
];
