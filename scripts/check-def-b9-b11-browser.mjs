// Optional browser QA: point PLAYWRIGHT_MODULE at an installed Playwright module.
// No project dependency is added. Uses an isolated browser context and local Vite server.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer } from 'vite';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const server=await createServer({server:{host:'127.0.0.1',port:5173,strictPort:true},logLevel:'error'});
await server.listen();
const browser=await chromium.launch({headless:true, ...(process.env.PLAYWRIGHT_EXECUTABLE ? { executablePath:process.env.PLAYWRIGHT_EXECUTABLE } : {})});
const base='http://127.0.0.1:5173/learn-ai-with-me/';
const report={at:new Date().toISOString(),checks:[],errors:[],screenshots:[],limits:['No live Spark, Flink, Feast, Kafka or JDBC services executed.','Document-hidden lifecycle and unmount cleanup inspected in the shared hook; viewport pause observed in browser.']};
fs.mkdirSync('/tmp/def-lessons/browser',{recursive:true});
try{
 for(const n of [9,10,11])for(const locale of ['vi','en']){
  const{[locale==='vi'?'VI':'EN']:T}=await server.ssrLoadModule(`/src/features/lessons/def/b${n}/lesson${String(n).padStart(2,'0')}.text.${locale}.ts`);
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  await page.goto(`${base}${locale==='en'?'en/':''}courses/data-engineering-foundation/lessons/b${n}?lang=${locale}`);
  await page.locator(`#ch10`).waitFor();
  assert.equal(await page.locator('.lesson-section').count(),15);
  assert.equal(await page.locator('.def-data-lab').count(),3);
  const broken=await page.locator('.lesson-nav a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));assert.deepEqual(broken,[]);
  for(const width of [1440,375])for(const theme of ['dark','light']){
   await page.setViewportSize({width,height:1000});await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(overflow){console.log(await page.locator('body *').evaluateAll(els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&r.width>0&&getComputedStyle(e).position!=='fixed'}).slice(0,18).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,100),width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right}))));await page.screenshot({path:'/tmp/def-lessons/browser/overflow.png',fullPage:true});}assert.equal(overflow,false,`overflow b${n}/${locale}/${width}/${theme}`);
   const badImages=await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));assert.deepEqual(badImages,[]);
   const noColor=await page.locator('.def-data-code').first().evaluate(el=>getComputedStyle(el).color===getComputedStyle(el).backgroundColor);assert.equal(noColor,false);
   report.checks.push(`b${n}/${locale}/${width}/${theme}: anchors, full-page width, images, code contrast roles`);
  }
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>document.documentElement.dataset.theme='dark');
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/tmp/def-lessons/browser/b${n}-${locale}-hero.png`});report.screenshots.push(`b${n}-${locale}-hero.png`);
  if(n===9){
   const labs=page.locator('.def-data-lab');await labs.nth(0).locator('select').selectOption('1');assert.match(await labs.nth(0).innerText(),/150/);assert.match(await labs.nth(0).innerText(),/100/);
   await labs.nth(1).locator('select').nth(2).selectOption('MEMORY_AND_DISK');assert.deepEqual(await labs.nth(1).locator('.def-data-metrics strong').allTextContents(),['4','2','2','4']);
   await labs.nth(2).locator('select').selectOption('4');assert.deepEqual(await labs.nth(2).locator('.def-data-metrics strong').allTextContents(),['175','730','700']);
  }
  if(n===10){
   const labs=page.locator('.def-data-lab');await labs.nth(0).locator('select').nth(1).selectOption('0');await labs.nth(0).locator('select').nth(2).selectOption('1');assert.match(await labs.nth(0).innerText(),locale==='vi'?/Bỏ event/:/Drop event/);
   await labs.nth(1).locator('select').nth(1).selectOption('1');assert.match(await labs.nth(1).innerText(),/90/);await labs.nth(1).locator('select').nth(0).selectOption('1');assert.match(await labs.nth(1).innerText(),/120/);
   await labs.nth(2).locator('select').selectOption('8');const row=await labs.nth(2).locator('tbody tr').last().locator('th,td').allTextContents();assert.deepEqual(row,['6','8','8','0','0']);
  }
  if(n===11){
   assert((await page.locator('#ch07').innerText()).includes('bronze_<source>_<entity>'));
   const labs=page.locator('.def-data-lab');await labs.nth(0).locator('select').nth(0).selectOption('1');assert.match(await labs.nth(0).innerText(),locale==='vi'?/Không trả lời/:/Does not answer/);
   for(const type of ['0','1','2','3','4','6']){await labs.nth(1).locator('select').first().selectOption(type);await labs.nth(1).locator('select').nth(1).selectOption('2');assert.equal(await labs.nth(1).locator('tbody tr').count(),['0','1','3'].includes(type)?1:3);}
   await labs.nth(2).locator('select').nth(1).selectOption('2');assert.match(await labs.nth(2).innerText(),locale==='vi'?/Thiếu/:/Missing/);
   await labs.nth(2).locator('select').first().selectOption('1');assert.match(await labs.nth(2).innerText(),/47.10/);assert.equal(await labs.nth(2).locator('select').nth(1).isDisabled(),true);
  }
  for(const lab of await page.locator('.def-data-lab').all()){await lab.locator('select').first().focus();await page.keyboard.press('ArrowDown');}
  const quiz=page.locator('#quiz');
  for(let i=0;i<T.quiz.length;i++){
   await quiz.locator('button[title]').nth(i).click();
   await quiz.locator('button').filter({has:page.getByText(T.quiz[i].opts[T.quiz[i].a],{exact:true})}).click();
  }
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('data-engineering-foundation-progress')));assert.equal(stored.sessions[`b${n}`].quizScore,100);assert.equal(await page.evaluate(()=>localStorage.getItem('csc14003-progress')),null);
  await page.locator('#checks button').first().click();
  assert(await page.evaluate(n=>localStorage.getItem(`data-engineering-foundation-b${n}-checks`)!==null,n));
  await page.locator('.def-data-lab').nth(1).scrollIntoViewIfNeeded();await page.screenshot({path:`/tmp/def-lessons/browser/b${n}-${locale}-lab.png`});
  await page.setViewportSize({width:375,height:900});await page.evaluate(()=>document.documentElement.dataset.theme='light');await page.locator('.def-data-lab').nth(1).scrollIntoViewIfNeeded();await page.screenshot({path:`/tmp/def-lessons/browser/b${n}-${locale}-mobile.png`});
  await page.locator('.deck-toggle').click();assert.equal(await page.locator('.deck-tick').count(),16);
  await page.locator('.deck-tick').nth(6).click();assert.equal(await page.locator('.deck-slide #ch05').isVisible(),true);
  await page.locator('.deck-tick').nth(14).click();assert.equal(await page.locator('.deck-slide #quiz').isVisible(),true);
  await page.locator('.deck-toggle').click();
  assert.equal(await page.locator('.def-data-trace').first().getAttribute('data-loop-state'),'reduced');
  const codeText=await page.locator('.def-data-code code').first().textContent();assert(codeText.includes('\n'));assert.equal(await page.locator('.def-data-code code span').count()>10,true);
  report.checks.push(`b${n}/${locale}: three labs, keyboard selects, ten-answer quiz=100, isolated storage/checklist, 16-slide deck, reduced motion, selectable code`);
  await context.close();
 }
 // Observe two complete cycles of each explanatory trace concurrently.
 await Promise.all([9,10,11].map(async n=>{
  const context=await browser.newContext({viewport:{width:1440,height:1200},reducedMotion:'no-preference'});const page=await context.newPage();
  await page.goto(`${base}courses/data-engineering-foundation/lessons/b${n}?lang=vi`);
  for(const trace of await page.locator('.def-data-trace').all()){
   await trace.scrollIntoViewIfNeeded();await page.waitForFunction(el=>el.dataset.loopState==='running',await trace.elementHandle());
   const total=await trace.locator('li').count();const seen=[];let resets=0;const deadline=Date.now()+Math.max(60000,total*6000);
   while(resets<2){assert(Date.now()<deadline,`b${n}: loop did not complete two cycles`);const v=Number(await trace.getAttribute('data-step'));if(seen.length&&v<seen.at(-1))resets++;seen.push(v);await page.waitForTimeout(350);}
   assert.equal(new Set(seen).size,total);await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);assert.equal(await trace.getAttribute('data-loop-state'),'suspended');
   const before=await trace.getAttribute('data-step');await page.waitForTimeout(2800);assert.equal(await trace.getAttribute('data-step'),before);
   report.checks.push(`b${n}: observed two cycles (${total} phases), cycle reset, viewport suspension and stable offscreen frame`);
  }
  await context.close();
 }));
 assert.deepEqual(report.errors,[]);
 fs.writeFileSync('docs/courses/data-engineering-foundation/reviews/b9-b11-browser-checks.json',JSON.stringify(report,null,2)+'\n');
 console.log(`PASS: ${report.checks.length} browser checks; ${report.errors.length} console/page errors.`);
}finally{await browser.close();await server.close();}
