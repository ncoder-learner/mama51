const gallery = document.getElementById("gallery");
const progressFill = document.getElementById("scroll-progress-fill");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const placeholderIcon = `
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="12" cy="13" r="3.4" stroke="currentColor" stroke-width="1.3"/>
  </svg>`;

function renderPhoto(photo) {
  const fig = document.createElement("figure");
  fig.className = "photo";

  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = photo.alt || photo.caption || "A memory";
  img.loading = "lazy";
  img.decoding = "async";

  img.onerror = () => {
    const filename = photo.src.split("/").pop();
    fig.classList.add("missing");
    fig.replaceChildren();
    fig.insertAdjacentHTML("afterbegin", placeholderIcon);
    const name = document.createElement("span");
    name.className = "fname";
    name.textContent = filename;
    fig.appendChild(name);
  };

  fig.appendChild(img);
  if (photo.caption) {
    const cap = document.createElement("figcaption");
    cap.textContent = photo.caption;
    fig.appendChild(cap);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "caption-toggle";
    toggle.setAttribute("aria-label", "Show photo caption");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<span aria-hidden="true">i</span>';
    toggle.addEventListener("click", () => {
      const visible = fig.classList.toggle("is-caption-visible");
      toggle.setAttribute("aria-expanded", String(visible));
      toggle.setAttribute("aria-label", visible ? "Hide photo caption" : "Show photo caption");
    });
    fig.appendChild(toggle);
  }
  gallery.appendChild(fig);
}

fetch("images/manifest.json")
  .then((response) => {
    if (!response.ok) throw new Error("Photo manifest could not be loaded.");
    return response.json();
  })
  .then((manifest) => {
    const photos = Array.isArray(manifest) ? manifest : manifest.photos;
    if (!Array.isArray(photos)) throw new Error("Photo manifest has an invalid format.");
    photos.forEach((photo) => renderPhoto(typeof photo === "string" ? { src: photo } : photo));
    if (!photos.length) gallery.innerHTML = '<p class="gallery-empty">Your favorite moments will live here.</p>';
  })
  .catch((error) => {
    console.error(error);
    gallery.innerHTML = '<p class="gallery-empty">The photo gallery could not load just now.</p>';
  });

/* Scroll progress: update on scroll and resize, with no animation loop. */
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressFill.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

/* Reveal the letter once, when it enters the viewport. */
const letter = document.getElementById("letter");
if (reduceMotion || !("IntersectionObserver" in window)) {
  letter.classList.add("in-view");
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        letter.classList.add("in-view");
        observer.unobserve(letter);
      }
    });
  }, { threshold: 0.2 });
  observer.observe(letter);
}

/* A rotating collection of birthday groaners. */
const jokes = [
  "Why did the birthday cake go to therapy? It had too many layers.",
  "You're not getting older. You're becoming a limited-edition classic.",
  "At 51, you're like a software update: somehow better, and still asking everyone to restart.",
  "What's the best thing about birthdays? You get to eat cake without pretending it's a balanced meal.",
  "Age is just a number. In your case, a very impressive one with excellent taste.",
  "Why did the candle apply for a job? It wanted to make a little light work.",
  "51 candles? We were going to get you a cake, but the fire department said no.",
  "They say wisdom comes with age. You're basically a whole library by now."
];
let jokeIndex = 0;
document.getElementById("another-joke").addEventListener("click", () => {
  jokeIndex = (jokeIndex + 1) % jokes.length;
  document.getElementById("birthday-joke").textContent = jokes[jokeIndex];
});

/* The heart has one secret job: a single little confetti moment. */
const heart = document.getElementById("closing-heart");
const heartHint = document.getElementById("heart-hint");
const closingNote = document.getElementById("closing-note");
let confettiSent = false;
heart.addEventListener("click", () => {
  if (confettiSent) return;
  confettiSent = true;
  heartHint.textContent = "you found the good stuff";
  closingNote.textContent = "A little extra love, just for you.";
  heart.setAttribute("aria-label", "Birthday love sent");
  if (reduceMotion) return;

  const colors = ["#D6AE63", "#E8A2A0", "#FBF6EF", "#B9AFC6"];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 54; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${Math.random() * 100}vw`);
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    piece.style.setProperty("--spin", `${Math.random() * 720 - 360}deg`);
    piece.style.setProperty("--fall-time", `${2.2 + Math.random() * 1.8}s`);
    piece.style.setProperty("--confetti-color", colors[i % colors.length]);
    fragment.appendChild(piece);
  }
  document.body.appendChild(fragment);
  window.setTimeout(() => document.querySelectorAll(".confetti-piece").forEach((piece) => piece.remove()), 4500);
});
