import{r as o,j as r}from"./preload-helper-d14b839a.js";import{b as l}from"./main-f6f28c70.js";const p=()=>{const[s,a]=o.useState(()=>Array(15).fill(null).map((e,t)=>({key:t+1})));return r.jsxs("div",{className:"pt-20 px-18 pb-80",children:[r.jsx("p",{className:"flex items-center p-10 h-[50px] text-orange-500 bg-orange-100 rounded-[14px]",children:"找到第 50 个元素并点击"}),r.jsx("div",{className:"pt-20 space-y-20",children:s.map(e=>r.jsxs(l,{className:"flex items-center box-border p-10 h-[80px] border border-slate-200 rounded-[14px]",to:`/details/${e.key}`,children:["List Item: ",e.key]},e.key))}),r.jsx("button",{className:"mt-30 mx-auto block w-[140px] h-44 border border-slate-200 font-bold rounded-[12px] outline-none",onClick:async()=>{await new Promise(e=>{window.setTimeout(e,300)}),a(e=>[...e,...Array(15).fill(null).map((t,n)=>({key:e.length+1+n}))])},children:"加载更多"})]})};export{p as default};
