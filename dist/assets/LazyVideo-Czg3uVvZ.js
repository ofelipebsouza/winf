import{c as l}from"./index-z0kKdo0r.js";import{a as r,j as p}from"./framer-motion-zBJtH6Qx.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],g=l("check",m),h=({src:a,poster:d,className:u})=>{const i=r.useRef(null);return r.useEffect(()=>{const e=i.current;if(!e)return;const n=()=>e.play().catch(()=>{}),o=new IntersectionObserver(([t])=>{t.isIntersecting?n():e.pause()},{threshold:.15});o.observe(e);const s=()=>{if(!e.paused)return;const t=e.getBoundingClientRect();t.top<window.innerHeight&&t.bottom>0&&n()};e.addEventListener("canplay",s);const c=()=>{if(document.visibilityState==="visible"){const t=e.getBoundingClientRect();t.top<window.innerHeight&&t.bottom>0&&n()}};return document.addEventListener("visibilitychange",c),()=>{o.disconnect(),e.removeEventListener("canplay",s),document.removeEventListener("visibilitychange",c)}},[]),p.jsx("video",{ref:i,loop:!0,muted:!0,playsInline:!0,preload:"none",poster:d,src:a,className:u})};export{g as C,h as L};
//# sourceMappingURL=LazyVideo-Czg3uVvZ.js.map
