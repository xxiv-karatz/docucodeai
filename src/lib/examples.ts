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
    language: "javascript",
    label: "JavaScript — bubble sort",
    code: `function bs(a){
    for(let i=0;i<a.length;i++)
        for(let j=0;j<a.length-i-1;j++)
            if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]];
    return a
}`,
  },
  {
    language: "java",
    label: "Java — binary search",
    code: `public class B{
    static int s(int[]a,int t){
        int l=0,r=a.length-1;
        while(l<=r){int m=(l+r)/2;if(a[m]==t)return m;else if(a[m]<t)l=m+1;else r=m-1;}
        return -1;
    }
}`,
  },
  {
    language: "go",
    label: "Go — linear search",
    code: `package main
import "fmt"
func ls(a []int,t int)int{for i,v:=range a{if v==t{return i}};return -1}
func main(){fmt.Println(ls([]int{3,1,4,1,5,9,2,6},5))}`,
  },
  {
    language: "javascript",
    label: "JavaScript — guess the number",
    code: `const rl=require('readline').createInterface({input:process.stdin,output:process.stdout});
const n=Math.floor(Math.random()*100)+1;let t=0;
const ask=()=>rl.question('guess 1-100: ',g=>{t++;g=+g;
    if(g<n){console.log('higher');ask()}
    else if(g>n){console.log('lower');ask()}
    else{console.log('got it in',t,'tries');rl.close()}
});ask();`,
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
    language: "rust",
    label: "Rust — fizzbuzz",
    code: `fn main(){
    for i in 1..=100{
        match(i%3,i%5){
            (0,0)=>println!("FizzBuzz"),
            (0,_)=>println!("Fizz"),
            (_,0)=>println!("Buzz"),
            _=>println!("{}",i)
        }
    }
}`,
  },
  {
    language: "javascript",
    label: "JavaScript — factorial recursive",
    code: `function f(n){return n<=1?1:n*f(n-1)}
console.log(f(parseInt(prompt('n: '))));`,
  },
  {
    language: "java",
    label: "Java — palindrome check",
    code: `import java.util.Scanner;
public class P{
    public static void main(String[]a){
        String s=new Scanner(System.in).nextLine().toLowerCase().replace(" ","");
        System.out.println(s.equals(new StringBuilder(s).reverse().toString()));
    }
}`,
  },
  {
    language: "go",
    label: "Go — fibonacci sequence",
    code: `package main
import "fmt"
func main(){
    n:=10;a,b:=0,1
    for i:=0;i<n;i++{fmt.Print(a," ");a,b=b,a+b}
}`,
  },
  {
    language: "typescript",
    label: "TypeScript — selection sort",
    code: `function ss(a:number[]):number[]{
    for(let i=0;i<a.length;i++){
        let m=i;
        for(let j=i+1;j<a.length;j++)if(a[j]<a[m])m=j;
        [a[i],a[m]]=[a[m],a[i]];
    }
    return a;
}`,
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
