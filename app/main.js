// @bun
function Z(K,z){T(K.remoteAddress,z,J.In)}function _(K,z){const O=z.replaceAll(/\r/g,"\\r").replaceAll(/\n/g,"\\n");T(K.remoteAddress,O.length>100?`${O.slice(0,97)}...`:O,J.Out)}function T(K,z,O=J.IO){const E=O!==J.None?` ${O}`:"";console.log(`${Date.now()} [${K}]${E} ${z}`)}var J;(function(G){G["In"]="-->";G["Out"]="<--";G["IO"]="<->";G["None"]=""})(J||(J={}));function W(K){K.shift();const z=S(K),O=K.join("\r\n");return{headers:z,body:O}}var S=function(K){let z=!1;const O={},E=": ";while(K.length>0&&!z){const G=K.shift();if(z=G==="",!z){const I=G.indexOf(E);if(I>=0){const Q=G.slice(0,I),N=G.slice(I+E.length);O[Q.toLowerCase()]=N}}}return O};function $(K){return K.toString().split("\r\n")}function j(K){const z=K.split(" ");if(z.length<3)return!1;const O=z[0],E=z[1],G=z[2];return{method:O,path:E,version:G}}function B(K,z){K.write(z),K.end()}function M(K,z,O){const E=[K];for(let G in z)E.push(`${G}: ${z[G]}`);return E.push(""),E.push(O),E.join("\r\n")}function X(K,z){return K.slice(z.length)}async function U(K,z,O){const E=x(K,z);try{return await Bun.write(E,O)}catch(G){return console.log(`Cannot write given content into "${E}" file. ${G.message}`),-1}}async function V(K,z){const O=C(K,z);return await Bun.file(O).text()}var x=function(K,z){return C(K,z)},{join:C}=import.meta.require("path");function q(){const K={elements:[],flags:{}};for(let z=0;z<process.argv.length;z++){let O=process.argv[z];const E={};if(O.startsWith("-")){let G=0;for(;G<O.length&&O[G]==="-";G++);if(G===O.length)E[O]=!0,K.elements.push(E);else{const I=z<process.argv.length?process.argv[++z]:!0,Q=O.slice(G);E[Q]=I,K.elements.push(E),K.flags[Q]=I}}else E[O]=!0,K.elements.push(E)}return K}var F=function(K){if(K.startsWith("/echo/")){const O=K.slice("/echo/".length);return M("HTTP/1.1 200 OK",{"Content-Type":"text/plain","Content-Length":O.length.toString()},O)}},P=function(K){const{headers:z}=W(K),O=z["user-agent"];return M("HTTP/1.1 200 OK",{"Content-Type":"text/plain","Content-Length":O.length.toString()},O)};async function u(K){if(K.startsWith("/files/")&&K.length>"/files/".length){const O=X(K,"/files/"),E=await R(O);if(E)return M("HTTP/1.1 200 OK",{"Content-Type":"application/octet-stream","Content-Length":E.length.toString()},E)}}async function R(K){try{return await V(H,K)}catch(z){console.log(`Cannot read "${K}" file. ${z.message}`)}}async function b(K,z){if(K.startsWith("/files/")&&K.length>"/files/".length){const E=X(K,"/files/"),{body:G}=W(z);if(await U(H,E,G))return M("HTTP/1.1 201 OK",{},"")}}var{flags:Y}=q(),H="directory"in Y&&typeof Y.directory==="string"?Y.directory:"staticFiles",w=Bun.listen({hostname:"localhost",port:4221,socket:{close(K){K.end()},async data(K,z){let O;const E=$(z);if(E.length>0){const I=j(E[0]);if(I)switch(Z(K,`${I.method} ${I.path}`),I.method){case"GET":{switch(I.path){case"/":O=M("HTTP/1.1 200 OK",{},"");break;case"/user-agent":O=P(E);break}O=O??F(I.path)??await u(I.path);break}case"POST":{O=O??await b(I.path,E);break}}}O=O??"HTTP/1.1 404 Not Found\r\n\r\n";const G=120;if(O.length>G)O=O.slice(0,G-3)+"...";_(K,O),B(K,O)},drain(K){},error(K,z){},open(K){}}});T("Server",`is listening on ${w.hostname}:${w.port} ...`,J.None);
