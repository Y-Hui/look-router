import{r as o,j as r}from"./preload-helper-d14b839a.js";import{u as d,a as u,b as i,L as h}from"./main-ce890180.js";import{A as x}from"./index-be4b4754.js";import"./clsx-0839fdbe.js";function p(e){const{instance:s}=d("useParams"),[n]=o.useState(()=>{const{params:t={}}=s;return e?e==null?void 0:e(t):t});return n}function l(e){const s={},n=new URLSearchParams(e??"");for(const t of n.keys()){const c=n.getAll(t);c.length===1?s[t]=c[0]:s[t]=c}return s}function m(e){const s=new URLSearchParams(Object.keys(e).reduce((n,t)=>{const c=e[t];return n.concat(Array.isArray(c)?c.map(a=>[t,a]):[[t,c]])},[])).toString();return s.startsWith("?")?s:`?${s}`}function b(e){const s=u();return o.useMemo(()=>{if(typeof s.search!="string")return(e==null?void 0:e({}))??{};const n=l(s.search);return typeof e=="function"?e(n):n},[e,s.search])}function j(){const e=u(),{router:s}=i("useSetQuery");return o.useCallback(n=>{const t=e.search,c=l(t),a=typeof n=="function"?n(c):n;s.updateSearch({...e,search:m(a)},t)},[e,s])}function S(e){const s=b(e),n=j();return[s,n]}const w=()=>{const[e,s]=S(),n=p();return r.jsxs(r.Fragment,{children:[r.jsx(x,{title:"详情页"}),n.id==="50"&&r.jsxs("div",{className:"mt-20 mx-18 p-10 text-orange-500 bg-orange-100 rounded-[14px] text-14",children:[r.jsx("p",{children:"很好！你加载了多次数据成功找到了第 50 个元素"}),r.jsx("br",{}),r.jsx("p",{children:"现在思考一下："}),r.jsx("p",{children:"如果返回上一个页面，需要重新点击“加载更多”按钮才能再次找到第 50 个元素吗？"})]}),r.jsxs("div",{className:"mt-20 mx-18 p-10 border border-slate-200 rounded-[14px]",children:[r.jsx("p",{children:"Path Params"}),r.jsx("pre",{className:"my-10 p-10 bg-[#3f3f3f] text-white rounded-[12px]",children:r.jsx("code",{children:JSON.stringify(n,null,2)})})]}),r.jsxs("div",{className:"mt-20 mx-18 p-10 border border-slate-200 rounded-[14px]",children:[r.jsx("p",{children:"URL Search"}),r.jsx("pre",{className:"my-10 p-10 bg-black text-white rounded-[12px]",children:r.jsx("code",{children:JSON.stringify(e,null,2)})}),r.jsx("button",{className:"block w-full h-44 bg-blue-100 text-blue-500 font-bold rounded-[12px] outline-none",type:"button",onClick:()=>{s({orderBy:"dsc",keyword:"foo",now:Date.now().toString()})},children:"Update URL Search"})]}),r.jsx(h,{className:"block py-10 text-blue-500 underline text-center",to:"/nest/12",children:"/nest/12"})]})};export{w as default};
