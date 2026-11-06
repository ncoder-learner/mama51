const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Progress */
const progressFill = $("#scroll-progress-fill");
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progressFill.style.transform=`scaleX(${max>0?Math.min(1,window.scrollY/max):0})`;}
window.addEventListener("scroll",updateProgress,{passive:true});window.addEventListener("resize",updateProgress);updateProgress();

/* Manifest-powered gallery + proper full-screen viewer */
const gallery=$("#gallery"),photoCount=$("#photo-count"),lightbox=$("#lightbox");
let photos=[],activePhoto=0;
function openPhoto(index){if(!photos.length)return;activePhoto=(index+photos.length)%photos.length;const photo=photos[activePhoto];$("#lightbox-image").src=photo.src;$("#lightbox-image").alt=photo.alt||photo.caption||"A memory";$("#lightbox-caption").textContent=photo.caption||"";$("#lightbox-counter").textContent=`${String(activePhoto+1).padStart(2,"0")} / ${String(photos.length).padStart(2,"0")}`;if(!lightbox.open)lightbox.showModal();}
function movePhoto(delta){openPhoto(activePhoto+delta);}
$("#lightbox-prev").addEventListener("click",()=>movePhoto(-1));$("#lightbox-next").addEventListener("click",()=>movePhoto(1));$("#lightbox-close").addEventListener("click",()=>lightbox.close());
lightbox.addEventListener("click",e=>{if(e.target===lightbox)lightbox.close();});
document.addEventListener("keydown",e=>{if(!lightbox.open)return;if(e.key==="ArrowRight")movePhoto(1);if(e.key==="ArrowLeft")movePhoto(-1);});
let touchStartX=0;lightbox.addEventListener("touchstart",e=>{touchStartX=e.changedTouches[0].clientX;},{passive:true});lightbox.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>45)movePhoto(dx<0?1:-1);},{passive:true});
function renderPhoto(photo,index){const fig=document.createElement("figure");fig.className="photo";const img=document.createElement("img");img.src=photo.src;img.alt=photo.alt||photo.caption||"A memory";img.loading="lazy";img.decoding="async";img.onerror=()=>{fig.classList.add("missing");fig.textContent="A memory is hiding here: "+photo.src.split("/").pop();};fig.appendChild(img);if(photo.caption){const cap=document.createElement("figcaption");cap.textContent=photo.caption;fig.appendChild(cap);}fig.tabIndex=0;fig.setAttribute("role","button");fig.setAttribute("aria-label",`Open photo ${index+1}${photo.caption?", "+photo.caption:""}`);fig.addEventListener("click",()=>openPhoto(index));fig.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openPhoto(index);}});gallery.appendChild(fig);}
fetch("images/manifest.json").then(r=>{if(!r.ok)throw Error("Manifest unavailable");return r.json();}).then(data=>{photos=(Array.isArray(data)?data:data.photos||[]).map(p=>typeof p==="string"?{src:p}:p);photos.forEach(renderPhoto);photoCount.textContent=`${String(photos.length).padStart(2,"0")} MOMENTS IN THE COLLECTION`;if(!photos.length)gallery.innerHTML='<p class="gallery-empty">Your favorite moments will live here.</p>';}).catch(err=>{console.error(err);photoCount.textContent="THE PHOTO ARCHIVES";gallery.innerHTML='<p class="gallery-empty">The memories are taking a moment to load.</p>';});

/* Cake designer: 51 real DOM candles, controls, lighting sequence and celebration */
const cake=$("#cake-preview"),candleField=$("#candle-field"),cakeMessage=$("#cake-message"),lightButton=$("#light-candles"),wishButton=$("#make-wish");
cake.dataset.sprinkles="true";cake.dataset.flowers="false";
for(let i=0;i<51;i++){const candle=document.createElement("span");candle.className="candle";candleField.appendChild(candle);}
$$(".swatch").forEach(button=>button.addEventListener("click",()=>{$$(".swatch").forEach(b=>b.classList.remove("active"));button.classList.add("active");cake.dataset.flavor=button.dataset.flavor;}));
function toggleCake(button,key){const on=button.getAttribute("aria-pressed")!=="true";button.setAttribute("aria-pressed",String(on));button.querySelector(".option-state").textContent=on?"ON":"OFF";cake.dataset[key]=String(on);}
$("#sprinkle-toggle").addEventListener("click",e=>toggleCake(e.currentTarget,"sprinkles"));$("#flower-toggle").addEventListener("click",e=>toggleCake(e.currentTarget,"flowers"));
let candlesLit=false;
lightButton.addEventListener("click",()=>{if(candlesLit)return;candlesLit=true;$$(".candle").forEach((c,i)=>{if(reduceMotion)c.classList.add("lit");else setTimeout(()=>c.classList.add("lit"),i*24);});cakeMessage.textContent="51 little flames. One very big wish.";lightButton.disabled=true;wishButton.disabled=false;$("#cake-caption").textContent="Look at that. A whole constellation." ;});
wishButton.addEventListener("click",()=>{if(!candlesLit)return;$$(".candle").forEach(c=>c.classList.remove("lit"));candlesLit=false;wishButton.disabled=true;lightButton.disabled=false;cakeMessage.textContent="Wish made. It's going to be a good year.";$("#cake-caption").textContent="Wish sent into the universe.";celebrate(75);});

/* Open-when time capsule */
const capsuleCopy={
laugh:{kicker:"A VERY IMPORTANT ANNOUNCEMENT",title:"Breaking news: you're still the favorite.",message:"After an extensive investigation involving absolutely no scientific method, the committee has confirmed that you remain one of a kind. Your application for more naps, more cake, and fewer responsibilities has been approved. Effective immediately."},
love:{kicker:"IN CASE YOU FORGOT",title:"You are loved. A ridiculous amount.",message:"Not because of what you do, how much you get done, or how well you hold everything together. Just because you're you. The ordinary days, the messy days, the days you don't feel like your best self — you're loved through all of them."},
celebrate:{kicker:"PLEASE TAKE THE STAGE",title:"A standing ovation. For you.",message:"For every little thing you do that nobody sees. For the laughs, the patience, the strength, the care, and all the ways you make life better just by being in it. This is your reminder to take the credit. You earned it."}
};
$$(".capsule-card").forEach(card=>card.addEventListener("click",()=>{const item=capsuleCopy[card.dataset.capsule];$("#reveal-kicker").textContent=item.kicker;$("#reveal-title").textContent=item.title;$("#reveal-message").textContent=item.message;$("#capsule-reveal").hidden=false;$("#capsule-reveal").scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"center"});}));
$("#close-reveal").addEventListener("click",()=>$("#capsule-reveal").hidden=true);

/* Joke carousel with non-repeating immediate sequence */
const jokes=[
"You're not old. You're a classic, and classics are expensive.",
"At 51, you're like a software update: somehow better, and still asking everyone to restart.",
"51 candles? We were going to get you a cake, but the fire department said no.",
"Why did the birthday cake go to therapy? It had too many layers.",
"Age is just a number. In your case, a very impressive one with excellent taste.",
"Why did the candle apply for a job? It wanted to make a little light work.",
"They say wisdom comes with age. You're basically a whole library now.",
"You're not getting older. You're becoming a limited-edition masterpiece.",
"What's Mama's favorite exercise? Running the entire household.",
"At this point, your birthday cake needs its own fire extinguisher.",
"You're 51. That's 18 with 33 years of experience.",
"Why don't birthdays ever get lonely? They always come with presents.",
"You're not aging. You're collecting upgrades.",
"What's the secret to looking this good at 51? Mind your business. It's classified.",
"51 is the new 31. The math is questionable, but the confidence is excellent.",
"Why did the birthday card go to school? It wanted to be well-rounded.",
"You're proof that some things really do get better with time. Like cake. And you.",
"At 51, you have reached the age where a quiet evening is a luxury vacation.",
"What's better than one amazing year? The next one. Obviously.",
"Your back doesn't hurt. It's just applauding your life choices.",
"Why was the birthday candle so confident? It knew it was on fire.",
"You're not over the hill. You're at the scenic overlook.",
"51 years of making everything look easy. We know it's not. Thank you.",
"What's the best thing about being 51? You can blame absolutely anything on being tired.",
"Happy birthday! May your coffee be strong and your family be only slightly annoying."
];
let jokeIndex=0;$("#another-joke").addEventListener("click",()=>{jokeIndex=(jokeIndex+1)%jokes.length;$("#birthday-joke").textContent=jokes[jokeIndex];$("#joke-counter").textContent=`${String(jokeIndex+1).padStart(2,"0")} / ${String(jokes.length).padStart(2,"0")}`;});

/* Wish card creator: live preview, copy and downloadable PNG-free text keepsake */
const wishInput=$("#wish-input"),wishPreviewText=$("#wish-preview-text");
wishInput.addEventListener("input",()=>{wishPreviewText.textContent=wishInput.value.trim()||"A new year. A thousand possibilities. And so much love behind you.";});
$("#create-wish").addEventListener("click",()=>{const wish=wishInput.value.trim();if(!wish){$("#wish-status").textContent="Write a little wish first. Even one sentence is perfect.";wishInput.focus();return;}
  const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=1500;const ctx=canvas.getContext("2d");
  const gradient=ctx.createLinearGradient(0,0,1200,1500);gradient.addColorStop(0,"#1D1527");gradient.addColorStop(1,"#38283f");ctx.fillStyle=gradient;ctx.fillRect(0,0,1200,1500);
  ctx.strokeStyle="#D6AE63";ctx.lineWidth=3;ctx.strokeRect(42,42,1116,1416);ctx.strokeStyle="#D6AE6355";ctx.lineWidth=1;ctx.strokeRect(60,60,1080,1380);
  ctx.textAlign="center";ctx.fillStyle="#D6AE63";ctx.font="30px Georgia";ctx.fillText("✦   ·   ✧   ·   ✦",600,190);
  ctx.fillStyle="#B9AFC6";ctx.font="22px Arial";ctx.letterSpacing="8px";ctx.fillText("A LITTLE NOTE FOR YOUR NEXT CHAPTER",600,310);
  ctx.fillStyle="#FBF6EF";ctx.font="italic 100px Georgia";ctx.fillText("51 looks",600,500);ctx.fillStyle="#E8A2A0";ctx.fillText("good on you.",600,620);
  ctx.fillStyle="#D6AE63";ctx.fillRect(510,700,180,2);
  ctx.fillStyle="#FBF6EF";ctx.font="36px Georgia";const words=wish.split(/\\s+/);let line="",y=830;for(const word of words){const test=line?line+" "+word:word;if(ctx.measureText(test).width>850&&line){ctx.fillText(line,600,y);line=word;y+=58;}else line=test;}if(line)ctx.fillText(line,600,y);
  ctx.fillStyle="#B9AFC6";ctx.font="italic 29px Georgia";ctx.fillText("A new year. A thousand possibilities.",600,1190);
  ctx.fillStyle="#D6AE63";ctx.font="22px Arial";ctx.fillText("HAPPY 51ST BIRTHDAY, MAMA  ♡",600,1320);
  canvas.toBlob(blob=>{if(!blob){$("#wish-status").textContent="Couldn't create the card on this browser.";return;}const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="mama-51-birthday-keepsake.png";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$("#wish-status").textContent="Your keepsake card is ready. Save it, send it, or keep it close.";}, "image/png");
});
$("#clear-wish").addEventListener("click",()=>{wishInput.value="";wishPreviewText.textContent="A new year. A thousand possibilities. And so much love behind you." ;$("#wish-status").textContent="Fresh page. Fresh wish.";});

/* One confetti engine used by the cake and closing easter egg */
function celebrate(amount=60){if(reduceMotion)return;const colors=["#D6AE63","#E8A2A0","#FBF6EF","#B9AFC6"];const fragment=document.createDocumentFragment();for(let i=0;i<amount;i++){const piece=document.createElement("span");piece.className="confetti-piece";piece.style.setProperty("--x",Math.random()*100+"vw");piece.style.setProperty("--drift",(Math.random()*190-95)+"px");piece.style.setProperty("--spin",(Math.random()*720-360)+"deg");piece.style.setProperty("--duration",(2.1+Math.random()*2)+"s");piece.style.setProperty("--confetti-color",colors[i%colors.length]);fragment.appendChild(piece);}document.body.appendChild(fragment);setTimeout(()=>$$(".confetti-piece").forEach(p=>p.remove()),4400);}
let heartClicked=false;$("#closing-heart").addEventListener("click",()=>{if(heartClicked)return;heartClicked=true;$("#heart-hint").textContent="surprise delivered · love you";$("#closing-note").textContent="A little extra love, just for you. ♡";celebrate(85);});

/* Letter reveal */
const letter=$("#letter");if(reduceMotion||!("IntersectionObserver"in window))letter.classList.add("in-view");else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){letter.classList.add("in-view");observer.unobserve(letter);}}),{threshold:.2});observer.observe(letter);}

/* Birthday roulette: a one-tap activity picker for the birthday girl */
const birthdayPlans=[
{icon:"🍰",title:"Cake first. Questions later.",detail:"Choose the biggest slice. Birthday calories are on vacation."},
{icon:"📸",title:"Take a ridiculous family photo.",detail:"Everyone has to commit to the pose. No boring smiles allowed."},
{icon:"🎶",title:"You control the music.",detail:"Pick the playlist. Everyone else is legally required to sing along."},
{icon:"🛋️",title:"A guilt-free relaxation break.",detail:"Put your feet up. Someone else can handle the little things."},
{icon:"🍽️",title:"Birthday dinner is your decision.",detail:"Pick the food and the place. The family follows."},
{icon:"💃",title:"Have a 30-second dance party.",detail:"The more embarrassing the moves, the better."},
{icon:"💌",title:"Collect three compliments.",detail:"Everyone nearby has to say one thing they appreciate about you."},
{icon:"🌅",title:"Plan one thing just for yourself.",detail:"A small treat, a day out, or something you've been putting off."},
{icon:"🎬",title:"Pick tonight's movie.",detail:"You get final say. No committee meetings."},
{icon:"📱",title:"Call someone who makes you laugh.",detail:"A birthday catch-up with one of your favorite people."},
{icon:"🍨",title:"Dessert round two.",detail:"Because the first dessert was clearly just a warm-up."},
{icon:"👑",title:"Declare yourself birthday royalty.",detail:"For the next hour, your only job is to enjoy being celebrated."}
];
let lastPlan=-1;
$("#spin-roulette").addEventListener("click",()=>{
 let next;do{next=Math.floor(Math.random()*birthdayPlans.length);}while(next===lastPlan);lastPlan=next;
 const plan=birthdayPlans[next];
 $("#roulette-icon").textContent=plan.icon;
 $("#roulette-result").textContent=plan.title;
 $("#roulette-detail").textContent=plan.detail;
 $("#spin-roulette").textContent="Spin again ↗";
});
/* Keep the fixed mobile dock in sync with the section currently on screen. */
const dockLinks=$$(".mobile-dock a");
if("IntersectionObserver"in window&&dockLinks.length){
 const dockSections=dockLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
 const dockObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){dockLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));}});
 },{rootMargin:"-35% 0px -55% 0px",threshold:0});
 dockSections.forEach(section=>dockObserver.observe(section));
}
