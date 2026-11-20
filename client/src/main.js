import "./style.css";
import { profile, projects } from "./data.js";
import { createSpace } from "./space.js";
import {
  createIcons,
  Orbit,
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Github,
  Linkedin,
  Mail,
  Pause,
  Play,
  VolumeX,
  Compass,
  X,
  Grid2X2,
  ChevronRight,
  GraduationCap,
  Code2,
  MapPin,
  Menu,
} from "lucide";
const icons = {
  Orbit,
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Github,
  Linkedin,
  Mail,
  Pause,
  Play,
  VolumeX,
  Compass,
  X,
  Grid2X2,
  ChevronRight,
  GraduationCap,
  Code2,
  MapPin,
  Menu,
};
const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let progress = 0,
  station = 0,
  about = false,
  paused = reduced.matches,
  mode = reduced.matches ? "direct" : "flight",
  selected = -1;
let savedScroll = 0,
  ignoreScroll = false;
const stops = [0, 0.22, 0.46, 0.7, 0.94];
document.querySelector("#app").innerHTML = `
<canvas id="universe" aria-hidden="true"></canvas><div class="space-vignette" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>
<header class="site-header"><a class="wordmark" href="#/home" aria-label="Matthew Christensen, home">${icon("orbit")}<span>matthew<span class="wordmark-dot">.</span></span></a><nav aria-label="Main navigation"><a href="#/home" data-nav="home">Home</a><a href="#/about" data-nav="about">About</a><a href="#/projects" data-nav="projects">Projects<span>04</span></a><span class="nav-indicator" aria-hidden="true"></span></nav><a class="header-github" href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub ${icon("arrow-up-right")}</a></header>
<main id="main-content" tabindex="-1"><section class="hero journey-layer" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow"><span class="tiny-star">✦</span> A UNIVERSE OF POSSIBILITIES</p><h1 id="hero-title">Curiosity drives.<br><span>Purpose</span> builds.</h1><p class="hero-intro">Hi, I’m <strong>Matthew Christensen.</strong><br>${profile.intro}</p><a href="#/projects" class="primary-button">Explore my work ${icon("arrow-up-right")}</a><a href="#/about" class="text-link hero-about">The person behind the projects ${icon("arrow-right")}</a><div class="hero-credentials"><span>${icon("graduation-cap")} Information Systems @ BYU</span><span class="credential-line"></span><span>Class of 2028</span></div></div><div class="origin"><div class="portrait-orbit orbit-one"></div><div class="portrait-orbit orbit-two"></div><div class="portrait-shell"><img src="${asset("matthew-github.jpg")}" alt="Matthew Christensen" fetchpriority="high"></div><div class="origin-badge"><span class="signal-dot"></span> THE HUMAN AT THE CENTER</div><div class="origin-label"><span>00 / POINT OF ORIGIN</span><strong>Matthew Christensen</strong><small>Developer. Listener. Lifelong learner.</small></div><span class="orbit-satellite satellite-one"></span><span class="orbit-satellite satellite-two"></span><span class="orbit-coordinate">40° N &nbsp; / &nbsp; 111° W<br>PROVO, UTAH</span></div><span class="side-annotation">EVERY CONNECTION STARTS WITH CURIOSITY</span></section>
<section id="project-station" class="project-station journey-layer" aria-label="Project details" hidden></section>
<div class="floating-nodes" aria-label="Constellation project nodes">${projects.map((p, i) => `<button class="space-node" data-node="${i}" aria-label="Explore ${p.name}"><span class="node-target"><span></span></span><span class="node-label"><small>0${i + 1} / ${p.category.toUpperCase()}</small><strong>${p.name} ${icon("arrow-up-right")}</strong></span></button>`).join("")}</div>
<section id="about-page" hidden aria-labelledby="about-title"><div class="about-heading"><p class="eyebrow"><span class="tiny-star">✦</span> THE PERSON BEHIND THE PROJECTS</p><h1 id="about-title">Grounded in people.<br><span>Drawn to possibility.</span></h1></div><div class="about-layout"><aside class="about-profile"><img src="${asset("matthew-github.jpg")}" alt="Matthew Christensen"><h2>Matthew Christensen</h2><p>Full-stack developer<br>Information Systems student</p><div class="about-socials"><a href="${profile.github}" target="_blank" rel="noopener noreferrer" aria-label="Matthew on GitHub">${icon("github")}</a><a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Matthew on LinkedIn">${icon("linkedin")}</a><a href="mailto:${profile.email}" aria-label="Email Matthew">${icon("mail")}</a></div><span class="profile-location">${icon("map-pin")} Provo, Utah</span></aside><div class="about-details"><div class="about-intro"><h2>I build to make things better.</h2><p>I’m a full-stack developer and Information Systems student at Brigham Young University. I’m drawn to understanding people’s needs and shaping systems that solve real problems.</p><p>Whether it’s giving traffic officers a clearer view of campus or exploring a better grocery-planning experience, I care about connecting technical work to something useful.</p></div><div class="about-block"><p class="eyebrow">01 / EDUCATION</p><div class="education-row"><h3>Brigham Young University<span>Marriott School of Business</span></h3><span class="date">EXPECTED APR 2028</span></div><p>B.S. in Management Information Systems · GPA 3.60</p><p class="muted">Coursework in Python, JavaScript, databases and SQL, IT infrastructure, business analysis, and project/product management.</p></div><div class="about-block"><p class="eyebrow">02 / EXPERIENCE</p><article class="experience"><div><h3>Traffic Officer</h3><span>BYU Traffic & Security</span></div><span class="date">DEC 2025 — NOV 2026</span><p>Built and deployed a vehicle dashboard in a 70-hour solo project, saving 20 ticketing hours each week.</p></article><article class="experience"><div><h3>Retail Associate</h3><span>Hobby Lobby · Rochester, NY</span></div><span class="date">JUN — AUG 2026</span><p>Collaborated on department layouts and trained up to five employees in store standards, safety, and efficiency.</p></article><article class="experience"><div><h3>Student Intern</h3><span>GlobalHub / iLabz</span></div><span class="date">SEP — DEC 2025</span><p>Designed Figma webpage prototypes with a six-person team. Incorporated student interviews into two-week Agile sprints.</p></article></div><div class="about-block"><p class="eyebrow">03 / TECHNICAL FOUNDATIONS</p><div class="skill-list">${profile.skills.map((s) => `<span>${s}</span>`).join("")}</div></div><div class="about-block personal"><p class="eyebrow">04 / A LITTLE BEYOND THE SCREEN</p><p>I enjoy hiking, running, fitness, reading, and making music. I’ve played trumpet and saxophone and explored songwriting.</p><p>Two years of missionary service in Bangkok included mentoring, leadership, and weekly English classes. I speak Thai at an intermediate level and am an Eagle Scout.</p></div><a href="#/projects" class="primary-button">See what I’ve been building ${icon("arrow-up-right")}</a><p class="about-source">Background based on my résumé and public GitHub work.</p></div></div><footer class="about-footer"><span>MATTHEW CHRISTENSEN</span><a href="mailto:${profile.email}">Let’s build something useful ${icon("arrow-up-right")}</a></footer></section>
</main>
<div class="journey-ui"><div class="view-options"><span class="signal-dot"></span><span id="location-label">POINT OF ORIGIN</span><button id="project-index-trigger" aria-label="Open project index">${icon("grid-2x2")} Project index</button></div><div class="flight-nav" aria-label="Journey destinations"><div class="flight-line"><span></span></div><button class="destination" data-stop="0" aria-label="Travel home"><span class="dest-dot"></span><small>00</small><strong>Origin</strong></button>${projects.map((p, i) => `<button class="destination" data-stop="${i + 1}" aria-label="Travel to ${p.name}"><span class="dest-dot"></span><small>0${i + 1}</small><strong>${p.name}</strong></button>`).join("")}</div><div class="journey-footer"><div class="travel-hint">${icon("arrow-down")} <span>SCROLL TO TRAVEL</span><span class="hint-rule"></span><span>FOLLOW THE CONNECTIONS</span></div><div class="footer-controls"><button id="journey-mode" aria-pressed="${mode === "direct"}">${icon("compass")} <span>${mode === "direct" ? "Direct navigation" : "Space journey"}</span></button><button id="motion-toggle" aria-label="${paused ? "Resume" : "Pause"} ambient motion">${icon(paused ? "play" : "pause")}</button><span class="copyright">© ${new Date().getFullYear()} MC</span></div></div></div>
<dialog id="project-index"><button class="close-dialog" aria-label="Close project index">${icon("x")}</button><p class="eyebrow">CHOOSE YOUR NEXT DESTINATION</p><h2>A constellation of work.</h2><div class="index-list">${projects.map((p, i) => `<button data-index="${i}"><span class="index-number">0${i + 1}</span><img src="${asset(p.image)}" alt=""><span><strong>${p.name}</strong><small>${p.category}</small></span>${icon("arrow-up-right")}</button>`).join("")}</div></dialog><div class="page-progress"><span></span></div><span class="sr-only" id="journey-announcement" role="status" aria-live="polite"></span>`;
function refreshIcons() {
  createIcons({ icons });
}
function announce(text) {
  document.querySelector("#journey-announcement").textContent = text;
}
function renderStation(index) {
  if (index === selected) return;
  selected = index;
  const p = projects[index];
  const stationEl = document.querySelector("#project-station");
  stationEl.style.setProperty("--station-color", p.color);
  stationEl.innerHTML = `<div class="station-copy"><p class="eyebrow"><span class="station-count">0${index + 1} / 04</span>${p.eyebrow}</p><p class="project-context">${p.context}</p><h2>${p.name}</h2><h3>${p.subtitle}</h3><p class="project-description">${p.description}</p><div class="project-tags">${p.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><div class="project-actions"><a class="primary-button" href="${profile.github}/${p.repo}" target="_blank" rel="noopener noreferrer">${icon("github")} View on GitHub ${icon("arrow-up-right")}</a><button class="next-station" aria-label="${index === 3 ? "Return home" : "Next project"}">${index === 3 ? "Back to origin" : "Next destination"} ${icon("arrow-right")}</button></div><p class="project-detail">${p.detail}</p></div><div class="station-visual"><div class="image-orbit" aria-hidden="true"></div><div class="screen-frame"><div class="screen-toolbar"><span class="window-dots"><i></i><i></i><i></i></span><span>${p.name.toLowerCase().replaceAll(" ", "-")} / ${p.repo === "Aquarium-App" ? "prototype" : "project"}</span>${icon("arrow-up-right")}</div><img src="${asset(p.image)}" alt="${p.imageAlt}"><span class="image-caption">${p.imageLabel} <span>0${index + 1} / SELECTED WORK</span></span></div><div class="project-impact"><span class="impact-star">✦</span><div><strong>${p.metric}</strong><span>${p.metricLabel}</span></div></div></div>`;
  stationEl.querySelector(".next-station").onclick = () =>
    travelTo(index === 3 ? 0 : index + 2);
  refreshIcons();
  announce(`Project ${index + 1} of 4: ${p.name}`);
}
function updateUI() {
  if (about) return;
  station = 0;
  for (let i = 1; i < stops.length; i++)
    if (progress >= (stops[i - 1] + stops[i]) / 2) station = i;
  const onHome = station === 0;
  document.querySelector(".hero").hidden = !onHome;
  document.querySelector("#project-station").hidden = onHome;
  if (!onHome) renderStation(station - 1);
  document.querySelectorAll("[data-nav]").forEach((el) => {
    const active = el.dataset.nav === (onHome ? "home" : "projects");
    el.classList.toggle("active", active);
    if (active) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  document.querySelectorAll(".destination").forEach((el, i) => {
    el.classList.toggle("active", i === station);
    el.classList.toggle("passed", i < station);
    if (i === station) el.setAttribute("aria-current", "step");
    else el.removeAttribute("aria-current");
  });
  document.querySelectorAll(".space-node").forEach((el, i) => {
    el.hidden = i !== station - 1 || onHome;
    el.classList.toggle("selected", i === station - 1);
  });
  document.querySelector("#location-label").textContent = onHome
    ? "POINT OF ORIGIN"
    : `0${station} / ${projects[station - 1].category.toUpperCase()}`;
  document.querySelector(".flight-line>span").style.width =
    `${(station / 4) * 100}%`;
  document.querySelector(".page-progress span").style.width =
    `${progress * 100}%`;
}
function scrollAt(p, animate = true) {
  const target = p * (document.documentElement.scrollHeight - innerHeight);
  window.scrollTo({
    top: target,
    behavior: animate && !paused && mode === "flight" ? "smooth" : "instant",
  });
  if (mode === "direct") {
    progress = p;
    updateUI();
  }
}
function travelTo(stop) {
  if (about) {
    about = false;
    document.body.classList.remove("about-open");
    document.querySelector("#about-page").hidden = true;
    document.querySelector(".journey-ui").hidden = false;
  }
  const hash = stop === 0 ? "#/home" : `#/projects/${projects[stop - 1].id}`;
  if (location.hash !== hash) history.pushState(null, "", hash);
  scrollAt(stops[stop]);
  progress = stops[stop];
  updateUI();
}
function openAbout() {
  if (!about) savedScroll = window.scrollY;
  about = true;
  document.body.classList.add("about-open");
  document.querySelector(".hero").hidden = true;
  document.querySelector("#project-station").hidden = true;
  document.querySelector(".floating-nodes").hidden = true;
  document.querySelector(".journey-ui").hidden = true;
  document.querySelector("#about-page").hidden = false;
  document.querySelectorAll("[data-nav]").forEach((el) => {
    const active = el.dataset.nav === "about";
    el.classList.toggle("active", active);
    if (active) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  document.querySelector("#about-page").scrollTop = 0;
  announce("About Matthew Christensen");
}
function applyRoute() {
  const route = location.hash.replace("#/", "").split("/");
  if (route[0] === "about") {
    openAbout();
    return;
  }
  about = false;
  document.body.classList.remove("about-open");
  document.querySelector("#about-page").hidden = true;
  document.querySelector(".journey-ui").hidden = false;
  document.querySelector(".floating-nodes").hidden = false;
  let stop = 0;
  if (route[0] === "projects") {
    const idx = projects.findIndex((p) => p.id === route[1]);
    stop = idx < 0 ? 1 : idx + 1;
  }
  progress = stops[stop];
  scrollAt(progress, false);
  updateUI();
}
document
  .querySelectorAll("[data-stop]")
  .forEach((el) => (el.onclick = () => travelTo(Number(el.dataset.stop))));
document
  .querySelectorAll("[data-node]")
  .forEach((el) => (el.onclick = () => travelTo(Number(el.dataset.node) + 1)));
document.querySelectorAll('a[href^="#/"]').forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const hash = el.getAttribute("href");
    if (location.hash !== hash) history.pushState(null, "", hash);
    applyRoute();
  }),
);
window.addEventListener("hashchange", applyRoute);
window.addEventListener("popstate", applyRoute);
let scrollFrame;
window.addEventListener(
  "scroll",
  () => {
    if (about || ignoreScroll) return;
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      progress =
        window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - innerHeight);
      updateUI();
    });
  },
  { passive: true },
);
const indexDialog = document.querySelector("#project-index");
document.querySelector("#project-index-trigger").onclick = () =>
  indexDialog.showModal();
document.querySelector(".close-dialog").onclick = () => indexDialog.close();
indexDialog.onclick = (e) => {
  if (e.target === indexDialog) indexDialog.close();
};
document.querySelectorAll("[data-index]").forEach(
  (el) =>
    (el.onclick = () => {
      indexDialog.close();
      travelTo(Number(el.dataset.index) + 1);
    }),
);
function syncMotion() {
  document
    .querySelector("#motion-toggle")
    .setAttribute(
      "aria-label",
      `${paused ? "Resume" : "Pause"} ambient motion`,
    );
  document.querySelector("#motion-toggle").innerHTML = icon(
    paused ? "play" : "pause",
  );
  refreshIcons();
}
document.querySelector("#motion-toggle").onclick = () => {
  paused = !paused;
  syncMotion();
};
reduced.addEventListener("change", (e) => {
  paused = e.matches;
  if (e.matches) mode = "direct";
  syncMotion();
  syncMode();
});
function syncMode() {
  document.body.classList.toggle("direct-mode", mode === "direct");
  document
    .querySelector("#journey-mode")
    .setAttribute("aria-pressed", mode === "direct");
  document.querySelector("#journey-mode").innerHTML =
    `${icon("compass")} <span>${mode === "direct" ? "Direct navigation" : "Space journey"}</span>`;
  refreshIcons();
}
document.querySelector("#journey-mode").onclick = () => {
  mode = mode === "flight" ? "direct" : "flight";
  syncMode();
};
window.addEventListener("keydown", (e) => {
  if (
    about ||
    indexDialog.open ||
    e.target.closest("a,button,input,textarea,select")
  )
    return;
  if (["ArrowRight", "PageDown"].includes(e.key)) {
    e.preventDefault();
    travelTo(Math.min(4, station + 1));
  }
  if (["ArrowLeft", "PageUp"].includes(e.key)) {
    e.preventDefault();
    travelTo(Math.max(0, station - 1));
  }
  if (e.key === "Home") {
    e.preventDefault();
    travelTo(0);
  }
});
refreshIcons();
syncMode();
if (!location.hash) history.replaceState(null, "", "#/home");
applyRoute();
createSpace(document.querySelector("#universe"), projects, {
  getProgress: () => progress,
  isPaused: () => paused,
  isAbout: () => about,
  isDirect: () => mode === "direct",
  onNodePosition: (index, x, y, visible) => {
    const el = document.querySelector(`[data-node="${index}"]`);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.opacity = visible ? "1" : "0";
    el.style.pointerEvents = visible ? "auto" : "none";
  },
});
