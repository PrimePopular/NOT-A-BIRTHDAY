/* =========================================================
   FOR MUNA — edit this file to change the words.
   Image files live in /assets/images/
   Password is case-sensitive.
   ========================================================= */
const CONTENT = {
  name: "Muna",
  password: "MY MAN",

  dateNote: "",

  photos: [
    {
      src: "assets/images/photo_2026-09-30_02-06-38.jpg",
      alt: "Photo of Muna, one",
      caption: "There's something about the way you say the thing as it is. No extra shine on it."
    },
    {
      src: "assets/images/photo_2026-09-30_02-06-42.jpg",
      alt: "Photo of Muna, two",
      caption: "I like that you're the kind of person who doesn't dress a thought up just to make it easier."
    },
    {
      src: "assets/images/photo_2026-09-30_02-06-44.jpg",
      alt: "Photo of Muna, three",
      caption: "You're surprisingly easy to read sometimes. It shows on your face before you decide what to do with it."
    },
    {
      src: "assets/images/photo_2026-09-30_02-06-45.jpg",
      alt: "Photo of Muna, four",
      caption: "Even when you try to hide that — the almost-smile, the look you pull back — I still catch it."
    },
    {
      src: "assets/images/photo_2026-09-30_02-06-46.jpg",
      alt: "Photo of Muna, five",
      caption: "I appreciate how direct you are. Blunt, even. It makes the room simpler."
    },
    {
      src: "assets/images/photo_2026-09-30_02-06-47 (2).jpg",
      alt: "Photo of Muna, six",
      caption: "And maybe you don't realize how much I notice those little things. I do."
    }
  ],

  yesResponse: {
    kicker: "Good.",
    body: "Then you're mine in the way that matters. No performance. Just us, for real."
  },

  thinkResponse: {
    kicker: "That's fair.",
    body: "Take the time you need. The question can wait. This part doesn't ask you for anything."
  },

  noteTitle: "A little note for you.",

  /* Replace this whole string. Blank lines become paragraph breaks. */
  loveNote: `[WRITE PERSONAL LOVE NOTE HERE]

I made this because I wanted you to have something that wasn't a performance. Not a line. Not a bit.

You are straightforward in a way I trust. You say what you actually think. Sometimes it lands on your face before you have a chance to put it away, and sometimes you try not to let it. I notice both.

I like you. Clearly enough that I wanted to ask properly — not for a night out, but for you.

Whenever you're ready — yes, or not yet — this note stays yours.`,

  signoff: "— for you"
};


/* =========================================================
   Experience
   ========================================================= */
const scenes = {
  lock: document.getElementById("scene-lock"),
  open: document.getElementById("scene-open"),
  truth: document.getElementById("scene-truth"),
  photos: document.getElementById("scene-photos"),
  serious: document.getElementById("scene-serious"),
  question: document.getElementById("scene-question"),
  note: document.getElementById("scene-note")
};

document.querySelectorAll("[data-name]").forEach((el) => {
  el.textContent = CONTENT.name;
});
document.title = "For " + CONTENT.name;

const lockBtn = document.getElementById("lock-btn");
const passForm = document.getElementById("pass-form");
const passInput = document.getElementById("pass-input");
const passNote = document.getElementById("pass-note");
const padlock = document.getElementById("padlock");
const lockHint = document.getElementById("lock-hint");

let unlocked = false;

lockBtn.addEventListener("click", () => {
  if (unlocked) return;
  padlock.classList.add("touched");
  passForm.hidden = false;
  lockHint.classList.add("dim");
  requestAnimationFrame(() => passForm.classList.add("show"));
  setTimeout(() => passInput.focus(), 280);
});

passForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = passInput.value;
  if (value === CONTENT.password) {
    unlock();
  } else {
    wrongKey();
  }
});

function wrongKey() {
  passForm.classList.remove("shake");
  void passForm.offsetWidth;
  passForm.classList.add("shake");
  passNote.textContent = "Not quite.";
  padlock.classList.add("deny");
  setTimeout(() => padlock.classList.remove("deny"), 500);
}

function unlock() {
  unlocked = true;
  passNote.textContent = "";
  padlock.classList.add("open");
  passForm.classList.add("fade");
  lockHint.classList.add("dim");
  setTimeout(() => goTo("open"), 900);
}

function goTo(name) {
  const next = scenes[name];
  const current = document.querySelector(".scene.is-active");
  if (current && current !== next) {
    current.classList.remove("is-active");
    current.classList.add("is-leaving");
    setTimeout(() => {
      current.hidden = true;
      current.classList.remove("is-leaving");
    }, 700);
  }
  next.hidden = false;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    next.classList.add("is-active");
    if (name === "open" || name === "truth" || name === "serious") {
      playLines(next);
    }
    if (name === "photos") {
      observePhotos();
    }
    if (name === "note") {
      revealLetter();
    }
  });
}

function playLines(scene) {
  const lines = scene.querySelectorAll(".line");
  const btn = scene.querySelector(".continue");
  if (btn) btn.hidden = true;
  lines.forEach((line) => {
    line.classList.remove("in");
    const delay = Number(line.dataset.delay || 0);
    setTimeout(() => line.classList.add("in"), delay);
  });
  const last = lines[lines.length - 1];
  const lastDelay = last ? Number(last.dataset.delay || 0) + 900 : 600;
  if (btn) {
    setTimeout(() => {
      btn.hidden = false;
      requestAnimationFrame(() => btn.classList.add("in"));
    }, lastDelay);
  }
}

document.getElementById("to-truth").addEventListener("click", () => goTo("truth"));
document.getElementById("to-photos").addEventListener("click", () => goTo("photos"));
document.getElementById("to-serious").addEventListener("click", () => goTo("serious"));
document.getElementById("to-question").addEventListener("click", () => goTo("question"));

/* Gallery */
const gallery = document.getElementById("gallery");
CONTENT.photos.forEach((photo, i) => {
  const fig = document.createElement("figure");
  fig.className = "frame";
  fig.innerHTML = `
    <div class="frame-media">
      <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async" />
    </div>
    <figcaption>
      <span class="num">0${i + 1}</span>
      <p>${photo.caption}</p>
    </figcaption>
  `;
  gallery.appendChild(fig);
});

let photoObserver;
function observePhotos() {
  if (photoObserver) return;
  photoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("seen");
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
  );
  gallery.querySelectorAll(".frame").forEach((el) => photoObserver.observe(el));
}

/* Question */
const choices = document.getElementById("choices");
const answer = document.getElementById("answer");
const answerKicker = document.getElementById("answer-kicker");
const answerBody = document.getElementById("answer-body");
const questionText = document.getElementById("question-text");

function answerWith(kind) {
  const data = kind === "yes" ? CONTENT.yesResponse : CONTENT.thinkResponse;
  answerKicker.textContent = data.kicker;
  answerBody.textContent = data.body;
  choices.classList.add("away");
  questionText.classList.add("soft");
  setTimeout(() => {
    choices.hidden = true;
    answer.hidden = false;
    requestAnimationFrame(() => answer.classList.add("in"));
  }, 420);
}

document.getElementById("choice-yes").addEventListener("click", () => answerWith("yes"));
document.getElementById("choice-think").addEventListener("click", () => answerWith("think"));
document.getElementById("to-note").addEventListener("click", () => goTo("note"));

/* Letter */
const letterBody = document.getElementById("letter-body");
const noteTitle = document.getElementById("note-title");
const signoff = document.getElementById("signoff");

function buildLetter() {
  noteTitle.textContent = CONTENT.noteTitle;
  signoff.textContent = CONTENT.signoff;
  letterBody.innerHTML = "";
  CONTENT.loveNote
    .trim()
    .split(/\n\s*\n/)
    .forEach((para) => {
      const p = document.createElement("p");
      p.textContent = para.replace(/\s+/g, " ").trim();
      letterBody.appendChild(p);
    });
}

function revealLetter() {
  buildLetter();
  const bits = letterBody.querySelectorAll("p");
  bits.forEach((p, i) => {
    p.classList.remove("in");
    setTimeout(() => p.classList.add("in"), 280 + i * 420);
  });
  signoff.classList.remove("in");
  setTimeout(() => signoff.classList.add("in"), 280 + bits.length * 420);
}

document.getElementById("read-again").addEventListener("click", () => {
  letterBody.querySelectorAll("p").forEach((p) => p.classList.remove("in"));
  signoff.classList.remove("in");
  setTimeout(revealLetter, 60);
  scenes.note.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("start-over").addEventListener("click", () => {
  unlocked = false;
  padlock.classList.remove("open", "touched", "deny");
  passForm.hidden = true;
  passForm.classList.remove("show", "fade", "shake");
  passInput.value = "";
  passNote.textContent = "";
  lockHint.classList.remove("dim");
  choices.hidden = false;
  choices.classList.remove("away");
  answer.hidden = true;
  answer.classList.remove("in");
  questionText.classList.remove("soft");
  document.querySelectorAll(".continue").forEach((b) => {
    b.classList.remove("in");
    b.hidden = true;
  });
  document.querySelectorAll(".line").forEach((l) => l.classList.remove("in"));
  goTo("lock");
});
