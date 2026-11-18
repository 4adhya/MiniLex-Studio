const $ = (id) => document.getElementById(id);
const samples = {
 basic: `int main() {\n    int total = 24;\n    float rate = 3.5;\n    total = total + rate;\n    if (total >= 20) {\n        return total;\n    }\n}`,
 clike: `#include <stdio.h>\n// calculate a score\nint main(void) {\n    char grade = 'A';\n    float score = 92.5;\n    if (score >= 90.0) {\n        printf("Excellent!");\n    }\n    return 0;\n}`,
 errors: `int main() {\n    int value = 12;\n    value = value @ 3;\n    return value;\n}`
};
const keywords = new Set("auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while class public private protected new delete using namespace std bool true false include".split(" "));
const operators = ["++","--","==","!=","<=",">=","&&","||","+=","-=","*=","/=","%=","->","<<",">>","+","-","*","/","%","=","<",">","!","&","|","^","~"];
const symbols = new Set(["(",")","{","}","[","]",";",",",".",":","?"]);
let lastTokens = [], lastErrors = [];
function updateLines(){const v=$("sourceCode").value; $("lineNumbers").innerHTML=Array.from({length:v.split("\n").length},(_,i)=>i+1).join("<br>");$("charCount").textContent=`${v.length} characters`;}
function scan(source){
 const tokens=[], errors=[]; let i=0,line=1,col=1;
 const advance=(s)=>{for(const c of s){if(c==="\n"){line++;col=1;}else col++;}i+=s.length;};
 while(i<source.length){
  const rest=source.slice(i), startLine=line,startCol=col;
  const ws=rest.match(/^\s+/); if(ws){advance(ws[0]);continue;}
  if(rest.startsWith("//")){const m=rest.match(/^\/\/[^\n]*/)[0];advance(m);continue;}
  if(rest.startsWith("/*")){const end=rest.indexOf("*/",2);const m=end<0?rest:rest.slice(0,end+2);if(end<0)errors.push({lexeme:"Unclosed comment",line:startLine,column:startCol});advance(m);continue;}
  let m, type, value;
  if((m=rest.match(/^"(?:\\.|[^"\\])*"/)) || (m=rest.match(/^'(?:\\.|[^'\\])*'/))){value=m[0];type="STRING";}
  else if((m=rest.match(/^(?:\d+\.\d+|\d+|\.\d+)/))){value=m[0];type="NUMBER";}
  else if((m=rest.match(/^[A-Za-z_][A-Za-z0-9_]*/))){value=m[0];type=keywords.has(value)?"KEYWORD":"IDENTIFIER";}
  else {const op=operators.find(o=>rest.startsWith(o));if(op){value=op;type="OPERATOR";}else if(symbols.has(rest[0])){value=rest[0];type="SYMBOL";}}
  if(value!==undefined){tokens.push({lexeme:value,type,line:startLine,column:startCol});advance(value);}
  else {errors.push({lexeme:source[i],line:startLine,column:startCol});advance(source[i]);}
 }
 return {tokens,errors};
}
function analyze(){
 const source=$("sourceCode").value, result=scan(source);lastTokens=result.tokens;lastErrors=result.errors;
 $("totalStat").textContent=result.tokens.length;$("typesStat").textContent=new Set(result.tokens.map(t=>t.type)).size;$("linesStat").textContent=source.length?source.split("\n").length:0;$("errorsStat").textContent=result.errors.length;
 $("errorCaption").textContent=result.errors.length?result.errors.map(e=>`${e.lexeme} @ ${e.line}:${e.column}`).join(", "):"No invalid characters";
 $("tokenCount").textContent=`${result.tokens.length} tokens`;
 const filter=$("filterType").value;const shown=result.tokens.filter(t=>filter==="ALL"||t.type===filter);
 $("tokenBody").innerHTML=shown.length?shown.map(t=>`<tr><td>${result.tokens.indexOf(t)+1}</td><td>${escapeHtml(t.lexeme)}</td><td><span class="token-badge badge-${t.type}">${t.type}</span></td><td>${t.line}</td><td>${t.column}</td></tr>`).join(""):`<tr><td colspan="5" class="empty-state">${result.tokens.length?"No tokens match this filter.":"No tokens found."}</td></tr>`;
 $("tableFoot").textContent=`${shown.length} shown · ${result.errors.length} lexical error${result.errors.length===1?"":"s"}`;
 const types=[...new Set(result.tokens.map(t=>t.type))];$("filterType").innerHTML='<option value="ALL">All token types</option>'+types.map(t=>`<option>${t}</option>`).join("");$("filterType").value="ALL";
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("analyzeBtn").addEventListener("click",analyze);
$("sourceCode").addEventListener("input",updateLines);
$("filterType").addEventListener("change",()=>{const filter=$("filterType").value;const shown=lastTokens.filter(t=>filter==="ALL"||t.type===filter);$("tokenBody").innerHTML=shown.length?shown.map(t=>`<tr><td>${lastTokens.indexOf(t)+1}</td><td>${escapeHtml(t.lexeme)}</td><td><span class="token-badge badge-${t.type}">${t.type}</span></td><td>${t.line}</td><td>${t.column}</td></tr>`).join(""):'<tr><td colspan="5" class="empty-state">No tokens match this filter.</td></tr>';});
document.querySelectorAll("[data-sample]").forEach(b=>b.addEventListener("click",()=>{$("sourceCode").value=samples[b.dataset.sample];updateLines();analyze();}));
$("resetBtn").addEventListener("click",()=>{$("sourceCode").value="";updateLines();lastTokens=[];lastErrors=[];$("totalStat").textContent=$("typesStat").textContent=$("linesStat").textContent=$("errorsStat").textContent="—";$("tokenCount").textContent="0 tokens";$("tokenBody").innerHTML='<tr><td colspan="5" class="empty-state">Run analysis to see your token stream.</td></tr>';$("tableFoot").textContent="Waiting for input";});
$("copyBtn").addEventListener("click",async()=>{const txt=["#\tLEXEME\tTYPE\tLINE\tCOLUMN",...lastTokens.map((t,i)=>`${i+1}\t${t.lexeme}\t${t.type}\t${t.line}\t${t.column}`)].join("\n");try{await navigator.clipboard.writeText(txt);$("copyBtn").textContent="✓ Copied";setTimeout(()=>$("copyBtn").textContent="▣ Copy tokens",1400);}catch{$("copyBtn").textContent="Copy unavailable";}});
$("downloadBtn").addEventListener("click",()=>{const rows=[["Index","Lexeme","Token Type","Line","Column"],...lastTokens.map((t,i)=>[i+1,t.lexeme,t.type,t.line,t.column])];const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="minilex-tokens.csv";a.click();URL.revokeObjectURL(a.href);});
function openRules(){$("rulesModal").classList.add("open");}
$("showRules").addEventListener("click",openRules);$("rulesNav").addEventListener("click",openRules);$("closeModal").addEventListener("click",()=>$("rulesModal").classList.remove("open"));$("rulesModal").addEventListener("click",e=>{if(e.target===$("rulesModal"))$("rulesModal").classList.remove("open");});
const ruleRows=[["KEYWORD","Reserved language words","int, float, if, else, return, while"],["IDENTIFIER","Names defined by the programmer","[A-Za-z_][A-Za-z0-9_]*"],["NUMBER","Integer and decimal constants","[0-9]+(.[0-9]+)?"],["STRING","Quoted character and string literals","'...' or \"...\""],["OPERATOR","Arithmetic, relational and logical operators","+ - * / = == <= && ..."],["SYMBOL","Separators and grouping characters","( ) { } [ ] ; , ."],["SKIP","Whitespace and comments","spaces, tabs, // and /* */"]];
$("modalRules").innerHTML=ruleRows.map(r=>`<div><b>${r[0]}</b><span>${r[1]}</span><code>${r[2]}</code></div>`).join("");
updateLines();analyze();