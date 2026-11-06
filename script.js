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
const jokes=["You're not old. You're a classic, and classics are expensive.","At 51, you're like a software update: somehow better, and still asking everyone to restart.","51 candles? We were going to get you a cake, but the fire department said no.","Why did the birthday cake go to therapy? It had too many layers.","Age is just a number. In your case, a very impressive one with excellent taste.","Why did the candle apply for a job? It wanted to make a little light work.","They say wisdom comes with age. You're basically a whole library now.","You're not getting older. You're becoming a limited-edition masterpiece."];
let jokeIndex=0;$("#another-joke").addEventListener("click",()=>{jokeIndex=(jokeIndex+1)%jokes.length;$("#birthday-joke").textContent=jokes[jokeIndex];$("#joke-counter").textContent=`${String(jokeIndex+1).padStart(2,"0")} / 08`;});

/* Wish card creator: live preview, copy and downloadable PNG-free text keepsake */
const wishInput=$("#wish-input"),wishPreviewText=$("#wish-preview-text");
wishInput.addEventListener("input",()=>{wishPreviewText.textContent=wishInput.value.trim()||"A new year. A thousand possibilities. And so much love behind you.";});
$("#create-wish").addEventListener("click",async()=>{const wish=wishInput.value.trim();if(!wish){$("#wish-status").textContent="Write a little wish first. Even one sentence is perfect.";wishInput.focus();return;}const card=`HAPPY 51ST BIRTHDAY, MAMA\n\n51 looks good on you.\n\n${wish}\n\nA new year. A thousand possibilities.\nMade with love. Always. ♡`;const blob=new Blob([card],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="mama-51-birthday-wish.txt";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);$("#wish-status").textContent="Your keepsake is ready. Saved as a little birthday note.";});
$("#clear-wish").addEventListener("click",()=>{wishInput.value="";wishPreviewText.textContent="A new year. A thousand possibilities. And so much love behind you." ;$("#wish-status").textContent="Fresh page. Fresh wish.";});

/* One confetti engine used by the cake and closing easter egg */
function celebrate(amount=60){if(reduceMotion)return;const colors=["#D6AE63","#E8A2A0","#FBF6EF","#B9AFC6"];const fragment=document.createDocumentFragment();for(let i=0;i<amount;i++){const piece=document.createElement("span");piece.className="confetti-piece";piece.style.setProperty("--x",Math.random()*100+"vw");piece.style.setProperty("--drift",(Math.random()*190-95)+"px");piece.style.setProperty("--spin",(Math.random()*720-360)+"deg");piece.style.setProperty("--duration",(2.1+Math.random()*2)+"s");piece.style.setProperty("--confetti-color",colors[i%colors.length]);fragment.appendChild(piece);}document.body.appendChild(fragment);setTimeout(()=>$$(".confetti-piece").forEach(p=>p.remove()),4400);}
let heartClicked=false;$("#closing-heart").addEventListener("click",()=>{if(heartClicked)return;heartClicked=true;$("#heart-hint").textContent="surprise delivered · love you";$("#closing-note").textContent="A little extra love, just for you. ♡";celebrate(85);});

/* Letter reveal */
const letter=$("#letter");if(reduceMotion||!("IntersectionObserver"in window))letter.classList.add("in-view");else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){letter.classList.add("in-view");observer.unobserve(letter);}}),{threshold:.2});observer.observe(letter);}
