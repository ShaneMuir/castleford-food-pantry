import { chromium } from "/Users/shanem/Desktop/demo/castleford-food-pantry/node_modules/@playwright/test/index.mjs";
const b = await chromium.launch();
for (const [name, w, h] of [["desktop",1440,900],["mobile",390,844]]) {
  const p = await (await b.newContext({ viewport:{width:w,height:h}, ignoreHTTPSErrors:true })).newPage();
  const errs=[]; p.on("console",m=>{if(m.type()==="error")errs.push(m.text())}); p.on("requestfailed",r=>errs.push("FAILED "+r.url()));
  await p.goto("https://castleford-food-pantry.test/",{waitUntil:"networkidle"});
  await p.waitForTimeout(800);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);});
  await p.waitForLoadState("networkidle");await p.waitForTimeout(600);
  await p.screenshot({path:`/Users/shanem/Desktop/demo/castleford-food-pantry/.screenshots/${name}-top.png`});
  await p.screenshot({path:`/Users/shanem/Desktop/demo/castleford-food-pantry/.screenshots/${name}-full.png`,fullPage:true});
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth - innerWidth);
  console.log(name,"horizontal overflow px:",ov,"errors:",JSON.stringify(errs));
}
await b.close();
