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
];
