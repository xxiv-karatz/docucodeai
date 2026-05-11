export type Example = { language: string; label: string; code: string };

export const EXAMPLES: Example[] = [
  {
    language: "python",
    label: "Python — messy data parser",
    code: `def p(d):
    r=[]
    for x in d:
        if x.get('a') and x['a']>0:
            t=x['a']*1.2
            if x.get('d'):t=t-x['d']
            r.append({'id':x['id'],'t':round(t,2)})
    return sorted(r,key=lambda x:-x['t'])`,
  },
  {
    language: "javascript",
    label: "JavaScript — debounce util",
    code: `function d(f,w){let t;return function(){const c=this,a=arguments;clearTimeout(t);t=setTimeout(()=>f.apply(c,a),w)}}`,
  },
  {
    language: "sql",
    label: "SQL — sales rollup",
    code: `select u.id,u.name,sum(o.total) s,count(*) c from users u join orders o on o.uid=u.id where o.created_at>now()-interval '30 day' group by 1,2 having sum(o.total)>500 order by s desc limit 25;`,
  },
  {
    language: "java",
    label: "Java — fib recursive",
    code: `public class F{public static int f(int n){if(n<2)return n;return f(n-1)+f(n-2);}public static void main(String[]a){System.out.println(f(10));}}`,
  },
  {
    language: "python",
    label: "Python — cryptic regex validator",
    code: `import re
def v(e):
    return bool(re.match(r'^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',e.lower())) and len(e)<255 and '..' not in e`,
  },
  {
    language: "typescript",
    label: "TypeScript — generic memoize",
    code: `const m=<T extends(...a:any[])=>any>(f:T):T=>{const c=new Map();return((...a:any[])=>{const k=JSON.stringify(a);if(c.has(k))return c.get(k);const r=f(...a);c.set(k,r);return r})as T}`,
  },
  {
    language: "javascript",
    label: "JavaScript — deep clone",
    code: `function dc(o,s=new WeakMap()){if(o===null||typeof o!=='object')return o;if(s.has(o))return s.get(o);const c=Array.isArray(o)?[]:{};s.set(o,c);for(const k in o)c[k]=dc(o[k],s);return c}`,
  },
  {
    language: "go",
    label: "Go — concurrent worker pool",
    code: `package main
import("sync")
func wp(j []int,n int,f func(int)int)[]int{r:=make([]int,len(j));var w sync.WaitGroup;c:=make(chan int,n);for i,v:=range j{w.Add(1);c<-1;go func(i,v int){defer w.Done();r[i]=f(v);<-c}(i,v)};w.Wait();return r}`,
  },
  {
    language: "rust",
    label: "Rust — fizzbuzz one-liner",
    code: `fn fb(n:u32){(1..=n).for_each(|i|println!("{}",match(i%3,i%5){(0,0)=>"FizzBuzz".into(),(0,_)=>"Fizz".into(),(_,0)=>"Buzz".into(),_=>i.to_string()}))}`,
  },
  {
    language: "sql",
    label: "SQL — running total CTE",
    code: `with t as(select date_trunc('day',created_at) d,sum(amount) a from txns where created_at>now()-interval '90 day' group by 1)select d,a,sum(a) over(order by d rows between unbounded preceding and current row) running from t order by d;`,
  },
  {
    language: "python",
    label: "Python — quicksort recursive",
    code: `def qs(a):
    if len(a)<2:return a
    p=a[len(a)//2]
    return qs([x for x in a if x<p])+[x for x in a if x==p]+qs([x for x in a if x>p])`,
  },
  {
    language: "javascript",
    label: "JavaScript — event emitter",
    code: `class E{constructor(){this.l={}}on(e,f){(this.l[e]=this.l[e]||[]).push(f)}off(e,f){this.l[e]=(this.l[e]||[]).filter(x=>x!==f)}emit(e,...a){(this.l[e]||[]).forEach(f=>f(...a))}}`,
  },
];
