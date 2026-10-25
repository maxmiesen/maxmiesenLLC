const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('node:path');
class Element {
 constructor(){this.children=[];this.attrs={};this.listeners={};this.dataset={};this.className='';this.textContent='';this.disabled=false;this.classList={contains:c=>this.className.split(' ').includes(c),add:c=>{if(!this.classList.contains(c))this.className+=' '+c},remove:c=>{this.className=this.className.split(' ').filter(v=>v!==c).join(' ')},toggle:(c,on)=>on?this.classList.add(c):this.classList.remove(c)};}
 set innerHTML(value){this.children=[];this.html=value;} get innerHTML(){return this.html;}
 removeAttribute(k){delete this.attrs[k]; if(k==='src')delete this.src;}
 setAttribute(k,v){this.attrs[k]=String(v)} getAttribute(k){return this.attrs[k]??null}
 addEventListener(k,f){this.listeners[k]=f} appendChild(el){el.parent=this;this.children.push(el)}
 querySelectorAll(q){return this.children.filter(e=>e.classList.contains(q.slice(1)))}
 remove(){this.parent.children=this.parent.children.filter(e=>e!==this)}
 click(){if(!this.disabled)this.listeners.click?.()}
}
const ids=Object.fromEntries(['sidebar','dots','sidebarTotal','totIdx','viewingCount','stageEyebrow','stageTitle','curIdx','stageDesc','openLink','pdfFrame','stageTags','prevBtn','nextBtn','reportOverview','reportTakeaway','reportMethods','pdfContainer','reportPreviewToggle'].map(id=>[id,new Element()]));
const chips=['all','BME','EE','Article'].map((filter,i)=>{const e=new Element();e.dataset.filter=filter;e.className='toc-chip'+(!i?' active':'');return e});
const document={querySelector:s=>ids[s.slice(1)],querySelectorAll:s=>s==='.toc-chip'?chips:[],createElement:()=>new Element()};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../research.js'),'utf8'),{document});
assert.equal(ids.sidebar.children.length,6);assert.equal(ids.stageTitle.textContent,'Orthopedic Biomechanics');
ids.nextBtn.click();assert.equal(ids.openLink.href,'BME405report.pdf');
ids.prevBtn.click();ids.prevBtn.click();assert.equal(ids.openLink.href,'golfreport.pdf');
chips[1].click();assert.equal(ids.sidebar.children.length,4);assert.equal(ids.viewingCount.textContent,'04');
ids.sidebar.children[2].click();assert.equal(ids.openLink.href,'BME410report.pdf');assert.equal(ids.sidebar.children[2].attrs['aria-pressed'],'true');
chips[2].click();assert.equal(ids.openLink.href,'EE202report.pdf');assert.equal(ids.nextBtn.disabled,true);assert.equal(ids.pdfFrame.title,'Linear Circuits Analysis — PDF report');
chips[3].click();assert.equal(ids.openLink.href,'golfreport.pdf');
chips[0].click();assert.equal(ids.sidebar.children.length,6);assert.equal(ids.nextBtn.disabled,false);assert.equal(ids.dots.children.length,6);assert.equal(chips[0].attrs['aria-pressed'],'true');assert.equal(chips[3].attrs['aria-pressed'],'false');
assert.equal(ids.pdfContainer.hidden,true);
assert.equal(ids.pdfFrame.src,undefined);
ids.reportPreviewToggle.click();
assert.equal(ids.pdfContainer.hidden,false);
assert.equal(ids.pdfFrame.src,'BME404report.pdf#view=FitH&toolbar=0');
assert.equal(ids.reportPreviewToggle.attrs['aria-expanded'],'true');
ids.nextBtn.click();
assert.equal(ids.pdfContainer.hidden,true);
assert.equal(ids.pdfFrame.src,undefined);
assert.ok(ids.reportTakeaway.textContent.includes('validation'));
console.log('PASS: deferred PDF loading, preview reset, summaries,  report initialization, filters, next/previous wrap, selection, PDF links, accessible states, single-result controls.');
