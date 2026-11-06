/* ======================================================
   ADD YOUR PHOTOS HERE
   ------------------------------------------------------
   1. Drop your image files into the /images folder.
   2. Name them to match the "src" below (or change the
      "src" to match your own filenames).
   3. Add/remove entries in this list — the page updates
      automatically. A missing photo shows a placeholder
      instead of a broken image, so it's safe to leave
      filenames in before you've added every photo.
   ====================================================== */
const photos = [
  { src: "images/photo-1.jpg", caption: "" },
  { src: "images/photo-2.jpg", caption: "" },
  { src: "images/photo-3.jpg", caption: "" },
  { src: "images/photo-4.jpg", caption: "" },
  { src: "images/photo-5.jpg", caption: "" },
  { src: "images/photo-6.jpg", caption: "" },
];

const gallery = document.getElementById("gallery");

const placeholderIcon = `
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="12" cy="13" r="3.4" stroke="currentColor" stroke-width="1.3"/>
  </svg>`;

photos.forEach((photo) => {
  const fig = document.createElement("figure");
  fig.className = "photo";

  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = photo.caption || "A memory";
  img.loading = "lazy";

  img.onerror = () => {
    const filename = photo.src.split("/").pop();
    fig.classList.add("missing");
    fig.innerHTML = `${placeholderIcon}<span class="fname">${filename}</span>`;
  };

  fig.appendChild(img);

  if (photo.caption) {
    const cap = document.createElement("figcaption");
    cap.textContent = photo.caption;
    fig.appendChild(cap);
  }

  gallery.appendChild(fig);
});

/* Reveal the letter once, when it scrolls into view */
const letter = document.getElementById("letter");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        letter.classList.add("in-view");
        observer.unobserve(letter);
      }
    });
  },
  { threshold: 0.3 }
);
observer.observe(letter);
