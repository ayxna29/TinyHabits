import { supabase } from "./supabaseClient.js";

/* ---------------- data (sourced from the official Tiny Habits Recipe Maker) ---------------- */
var ANCHORS = "wake up in the morning (and I'm still in bed).put my feet on the floor in the morning (getting out of bed).turn off my alarm in the morning.brush my teeth.flush the toilet and wash my hands.make a cup of coffee/tea.start the coffee maker/tea kettle.sit down for breakfast.make my bed.get out of the shower.put on my shoes in the morning.buckle my seatbelt in the car.sit down at my work desk.place my laptop in front of me.wait for a meeting to begin.return to a project from being interrupted.realize that I'm procrastinating.realize my mind is wandering away from my project.feel a resistance to starting a task.hang up the phone.sit down for lunch.finish my afternoon snack.shut down my computer for the day.walk into my home after work.finish cleaning up after dinner.start the dishwasher.put my kids to bed.get into my pajamas.turn off the TV in the evening.plug my phone in to charge at night.put my head on my pillow.toss and turn in bed at night".split(".");

var BEHAVIORS = [
  { text: "write down my top priority for the day", category: "Productivity" },
  { text: "open my \"to do\" list", category: "Productivity" },
  { text: "put my phone on \"do not disturb\" mode", category: "Productivity" },
  { text: "set a timer for 5 minutes and dive into my work project.", category: "Productivity" },
  { text: "launch my word processing program", category: "Productivity" },
  { text: "fill a glass with water", category: "Nutrition" },
  { text: "eat a vegetable that I enjoy", category: "Nutrition" },
  { text: "eat a handful of blueberries", category: "Nutrition" },
  { text: "make a cup of green tea/black coffee", category: "Nutrition" },
  { text: "take a deep relaxing breath", category: "Stress" },
  { text: "close my eyes and relax for three breaths", category: "Stress" },
  { text: "walk outside briefly", category: "Stress" },
  { text: "think of one thing I'm grateful for", category: "Stress" },
  { text: "open the window and take a breath of fresh air", category: "Stress" },
  { text: "do two pushups", category: "Fitness" },
  { text: "do three squats", category: "Fitness" },
  { text: "plank for three breaths", category: "Fitness" },
  { text: "stretch my body briefly", category: "Fitness" },
  { text: "set out my yoga mat", category: "Fitness" },
  { text: "do two lunges on each leg", category: "Fitness" },
  { text: "read one paragraph from a book", category: "Learning" },
  { text: "turn on my audio book", category: "Learning" },
  { text: "turn on a podcast episode", category: "Learning" },
  { text: "study one word of Hawaiian (or other language)", category: "Learning" },
  { text: "play three chords on my guitar", category: "Creativity" },
  { text: "open my journal", category: "Creativity" },
  { text: "tidy up one item", category: "Tidiness" },
  { text: "wipe off one countertop or surface", category: "Tidiness" },
  { text: "wash one item in the kitchen sink", category: "Tidiness" },
  { text: "tidy one item in the fridge", category: "Tidiness" },
  { text: "give someone a hug", category: "Relationships" },
  { text: "text a happy or funny emoji to someone", category: "Relationships" },
  { text: "send a text message to someone I love", category: "Relationships" },
  { text: "think of someone who loves me a lot", category: "Relationships" },
  { text: "think of one person I should connect with today", category: "Relationships" },
  { text: "think about my life's purpose", category: "My Purpose" },
  { text: "say a brief prayer", category: "My Purpose" },
  { text: "read one verse of scripture", category: "My Purpose" },
  { text: "put on glasses that block blue light.", category: "Better Sleep" },
  { text: "switch off notifications on my phone", category: "Better Sleep" },
  { text: "play some classical music (like Mozart)", category: "Brain Health" },
  { text: "put MCT oil in my coffee/tea", category: "Brain Health" }
];
var CATEGORIES = Array.from(new Set(BEHAVIORS.map(function (b) { return b.category; })));

var CELEBRATIONS = [
  'Say out loud: "Awesome!"',
  'Say out loud: "I\'m the kind of person who…"',
  "Two thumbs up",
  "A fist pump",
  "Imagine the crowd cheering",
  "Smile big",
  'Nod your head and say "Yes!"',
  "Hum a victory tune",
  "Imagine your favorite teacher cheering you on"
];

var QUOTES = [
  "Help people do what they already want to do, and help them feel successful.",
  "Behavior happens when Motivation, Ability, and a Prompt come together at the same moment.",
  "Emotions create habits. Not repetition. Not frequency. Not fairy dust.",
  "People change best by feeling good, not by feeling bad.",
  "Tiny is mighty.",
  "Take the tiny leaf of a new habit and plant it in a fertile spot."
];

var ABILITY_FACTORS = [
  { name: "Time", hint: "Do you have enough of it right at the anchor moment?" },
  { name: "Money", hint: "Does doing it cost something you'd rather not spend?" },
  { name: "Physical effort", hint: "Is your body up for it at that time of day?" },
  { name: "Mental effort", hint: "Does it need more thinking than you have to spare?" },
  { name: "Routine", hint: "Does it clash with what you normally do in that moment?" }
];

var SCALE_DOWN = [
  "Do the starter step only — set out the mat, open the book, put on one shoe.",
  "Shrink the whole thing — two pushups instead of a workout, one sentence instead of a page.",
  "Make it take 30 seconds or less, and let it grow naturally when it wants to.",
  "Attach it to a smaller anchor that happens earlier in the sequence."
];

var LANDING_RECIPES = [
  "After I put my feet on the floor in the morning, I will think of one thing I'm grateful for.",
  "After I make a cup of coffee/tea, I will read one paragraph from a book.",
  "After I sit down for lunch, I will eat a vegetable that I enjoy.",
  "After I shut down my computer for the day, I will do two pushups.",
  "After I brush my teeth, I will think of someone who loves me a lot."
];

var METHOD_STEPS = [
  { n: "01", title: "Anchor Moment", body: "An existing routine or an event that happens. The anchor reminds you to do the new tiny behavior — it is the prompt." },
  { n: "02", title: "New Tiny Behavior", body: "A simple version of the new habit you want, scaled back to something you can do in 30 seconds or less. Do it immediately after the anchor." },
  { n: "03", title: "Instant Celebration", body: "Something you do to create positive emotion — Shine — right after the tiny behavior. The emotion, not the repetition, is what wires the habit in." }
];
var DEEPER_LINKS = [
  ["Tiny Habits — official site", "https://tinyhabits.com"],
  ["Tiny Habits Recipe Maker", "https://recipemaker.tinyhabits.com/tiny-habits"],
  ["BJ Fogg, PhD — behavior scientist", "https://bjfogg.com"],
  ["The Fogg Behavior Model", "https://behaviormodel.org"],
  ["Tiny Habits Academy", "https://tinyhabitsacademy.com"]
];

/* ---------------- pure helpers ---------------- */
function pad2(n) { return String(n).padStart(2, "0"); }
function todayStr(d) { d = d || new Date(); return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
function lastNDates(n) { var arr = []; for (var k = n - 1; k >= 0; k--) { var d = new Date(); d.setDate(d.getDate() - k); arr.push(todayStr(d)); } return arr; }
function currentStreak(log) {
  var set = new Set(log), streak = 0, cur = new Date();
  if (!set.has(todayStr(cur))) cur.setDate(cur.getDate() - 1);
  while (set.has(todayStr(cur))) { streak++; cur.setDate(cur.getDate() - 1); }
  return streak;
}
function longestStreak(log) {
  var days = Array.from(new Set(log)).sort(), max = 0, run = 0, prev = null;
  days.forEach(function (dstr) {
    var t = new Date(dstr + "T00:00:00").getTime();
    run = (prev !== null && t - prev === 86400000) ? run + 1 : 1;
    prev = t;
    if (run > max) max = run;
  });
  return max;
}
function completionRate(log, windowDays) {
  windowDays = windowDays || 14;
  var set = new Set(log);
  return lastNDates(windowDays).filter(function (d) { return set.has(d); }).length / windowDays;
}
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function escapeHtml(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }

/* ---------------- suggestion engine ---------------- */
function suggestionFor(r) {
  if (r.paused) return null;
  var rate = completionRate(r.log, 14);
  var streak = currentStreak(r.log);
  var daysSince = Math.max(1, daysBetween(new Date(r.created_at), new Date()));
  if (daysSince >= 7 && rate < 0.4) {
    return { type: "adjust", label: "Might need a tweak — low completion lately" };
  }
  if (streak >= 14 || rate >= 0.9) {
    return { type: "levelup", label: "Really consistent — ready to make it slightly bigger?" };
  }
  return null;
}

/* ---------------- auth + data state ---------------- */
var session = null;
var sessionChecked = false;
var recipes = [];
var goals = [];
var journal = [];
var userSettings = null;
var recipesLoading = false;

var authMode = "signin"; // or "signup"
var authBusy = false;
var authMessage = "";
var authMessageKind = ""; // "error" | "info"

async function loadRecipesRaw() {
  var { data, error } = await supabase.from("recipes").select("*").order("created_at", { ascending: true });
  if (error) console.error(error); else recipes = data || [];
}
async function loadGoalsRaw() {
  var { data, error } = await supabase.from("goals").select("*").order("created_at", { ascending: true });
  if (error) console.error(error); else goals = data || [];
}
async function loadJournalRaw() {
  var { data, error } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false });
  if (error) console.error(error); else journal = data || [];
}
async function loadUserSettingsRaw() {
  var { data, error } = await supabase.from("user_settings").select("*").eq("user_id", session.user.id).maybeSingle();
  if (error) { console.error(error); return; }
  userSettings = data || { user_id: session.user.id, daily_reminder_enabled: false, daily_reminder_time: null };
}
async function saveUserSettings(patch) {
  var next = Object.assign({}, userSettings, patch, { user_id: session.user.id });
  var { data, error } = await supabase.from("user_settings").upsert(next).select().single();
  if (error) { console.error(error); return error; }
  userSettings = data;
  return null;
}
async function loadAll() {
  if (!session) { recipes = []; goals = []; journal = []; userSettings = null; return; }
  recipesLoading = true;
  render();
  await Promise.all([loadRecipesRaw(), loadGoalsRaw(), loadJournalRaw(), loadUserSettingsRaw()]);
  recipesLoading = false;
  pollDailyReminder();
  render();
}

async function addRecipe(r) {
  var { data, error } = await supabase
    .from("recipes")
    .insert({ user_id: session.user.id, anchor: r.anchor, behavior: r.behavior, celebration: r.celebration, goal_id: r.goalId || null })
    .select()
    .single();
  if (error) { console.error(error); return error; }
  recipes.push(data);
  return null;
}
async function updateRecipe(id, patch) {
  var { data, error } = await supabase.from("recipes").update(patch).eq("id", id).select().single();
  if (error) { console.error(error); return error; }
  recipes = recipes.map(function (r) { return r.id === id ? data : r; });
  return null;
}
async function removeRecipe(id) {
  var { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) { console.error(error); return error; }
  recipes = recipes.filter(function (r) { return r.id !== id; });
  return null;
}
async function addNote(id, text) {
  var r = recipes.find(function (x) { return x.id === id; });
  if (!r) return;
  var notes = (r.notes || []).concat([{ date: new Date().toISOString(), text: text }]);
  return updateRecipe(id, { notes: notes });
}
async function toggleDay(id, date) {
  var r = recipes.find(function (x) { return x.id === id; });
  if (!r) return;
  var has = r.log.includes(date);
  var log = has ? r.log.filter(function (d) { return d !== date; }) : r.log.concat([date]);
  return updateRecipe(id, { log: log });
}
async function importRecipes(list) {
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    await supabase.from("recipes").insert({
      user_id: session.user.id,
      anchor: item.anchor,
      behavior: item.behavior,
      celebration: item.celebration,
      paused: !!item.paused,
      log: item.log || [],
      notes: item.notes || []
    });
  }
  await loadRecipesRaw();
}

async function addGoal(g) {
  var { data, error } = await supabase
    .from("goals")
    .insert({ user_id: session.user.id, title: g.title, why: g.why || null, target_date: g.targetDate || null })
    .select()
    .single();
  if (error) { console.error(error); return error; }
  goals.push(data);
  return null;
}
async function removeGoal(id) {
  var { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) { console.error(error); return error; }
  goals = goals.filter(function (g) { return g.id !== id; });
  recipes = recipes.map(function (r) { return r.goal_id === id ? Object.assign({}, r, { goal_id: null }) : r; });
  return null;
}

async function addJournalEntry(text, tagIds) {
  var { data, error } = await supabase
    .from("journal_entries")
    .insert({ user_id: session.user.id, text: text, tag_recipe_ids: tagIds || [] })
    .select()
    .single();
  if (error) { console.error(error); return error; }
  journal.unshift(data);
  return null;
}
async function removeJournalEntry(id) {
  var { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) { console.error(error); return error; }
  journal = journal.filter(function (j) { return j.id !== id; });
  return null;
}

async function signIn(email, password) {
  authBusy = true; authMessage = ""; render();
  var { error } = await supabase.auth.signInWithPassword({ email: email, password: password });
  authBusy = false;
  if (error) { authMessage = error.message; authMessageKind = "error"; render(); }
}
async function signUp(email, password) {
  authBusy = true; authMessage = ""; render();
  var { data, error } = await supabase.auth.signUp({ email: email, password: password });
  authBusy = false;
  if (error) { authMessage = error.message; authMessageKind = "error"; render(); return; }
  if (data && data.session) return; // confirmation disabled — onAuthStateChange takes it from here
  authMode = "signin";
  authMessage = "Check your email to confirm your account, then sign in.";
  authMessageKind = "info";
  render();
}
async function signOut() {
  await supabase.auth.signOut();
}

supabase.auth.onAuthStateChange(function (_event, newSession) {
  session = newSession;
  sessionChecked = true;
  if (session) loadAll();
  else { recipes = []; goals = []; journal = []; render(); }
});
supabase.auth.getSession().then(function (res) {
  session = res.data.session;
  sessionChecked = true;
  if (session) loadAll();
  else render();
});

/* ---------------- general daily reminder (client-side, while a tab is open) ---------------- */
var DAILY_FIRED_KEY = "tiny-habits:daily-fired:v1";
var notifPermission = ("Notification" in window) ? Notification.permission : "unsupported";

function requestNotifPermission() {
  if (!("Notification" in window)) return;
  Notification.requestPermission().then(function (p) { notifPermission = p; render(); });
}
function minutesNow(d) { d = d || new Date(); return d.getHours() * 60 + d.getMinutes(); }
function minutesOf(t) { var p = t.split(":"); return Number(p[0]) * 60 + Number(p[1]); }

function pollDailyReminder() {
  if (!session || !userSettings || !userSettings.daily_reminder_enabled || !userSettings.daily_reminder_time) return;
  if (minutesNow() < minutesOf(userSettings.daily_reminder_time)) return;
  var today = todayStr();
  if (localStorage.getItem(DAILY_FIRED_KEY) === today) return;
  localStorage.setItem(DAILY_FIRED_KEY, today);
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification("Tiny Habits", { body: "A minute for one small thing?", tag: "daily-reminder" }); } catch (e) {}
  }
}
setInterval(function () { pollDailyReminder(); }, 60000);

/* ---------------- display / accessibility preferences (local to this device) ---------------- */
var DISPLAY_PREFS_KEY = "tiny-habits:display-prefs:v1";
var DEFAULT_DISPLAY_PREFS = { calmMode: false, largerText: false, highContrast: false, hideNumbers: false };
function loadDisplayPrefs() {
  try { return Object.assign({}, DEFAULT_DISPLAY_PREFS, JSON.parse(localStorage.getItem(DISPLAY_PREFS_KEY) || "{}")); }
  catch (e) { return Object.assign({}, DEFAULT_DISPLAY_PREFS); }
}
var displayPrefs = loadDisplayPrefs();
function saveDisplayPrefs() { try { localStorage.setItem(DISPLAY_PREFS_KEY, JSON.stringify(displayPrefs)); } catch (e) {} }
function applyDisplayPrefs() {
  var root = document.documentElement;
  root.classList.toggle("calm-mode", displayPrefs.calmMode);
  root.classList.toggle("larger-text", displayPrefs.largerText);
  root.classList.toggle("high-contrast", displayPrefs.highContrast);
}
applyDisplayPrefs();

/* ---------------- ephemeral UI state ---------------- */
var builderOpen = false;
var builderBusy = false;
var builderState = { anchor: "", behavior: "", celebration: "", category: CATEGORIES[0], goalId: "" };
var openEditId = null;
var shineVisible = {};
var troubleStep = 0;
var troubleAnswer = null;
var goalFormOpen = false;
var goalFormState = { title: "", why: "", targetDate: "" };
var journalTags = new Set();

/* ---------------- routing ---------------- */
function currentRoute() { return location.hash.replace(/^#/, "") || "/"; }
function goTo(route) { location.hash = "#" + route; }

document.getElementById("navBrand").addEventListener("click", function () { goTo("/"); });
document.getElementById("navLinks").addEventListener("click", function (e) {
  var btn = e.target.closest("[data-route]");
  if (btn) goTo(btn.dataset.route);
});
window.addEventListener("hashchange", render);
document.querySelector(".skip-link").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("main").focus();
});

/* ---------------- render dispatch ---------------- */
function render() {
  var navLinks = document.getElementById("navLinks");
  var navAccount = document.getElementById("navAccount");
  var main = document.getElementById("main");

  if (!sessionChecked) {
    navLinks.style.visibility = "hidden";
    navAccount.innerHTML = "";
    main.innerHTML = '<p class="sub" style="margin-top:3rem;">Loading…</p>';
    return;
  }

  if (!session) {
    navLinks.style.visibility = "hidden";
    navAccount.innerHTML = "";
    renderLanding(main);
    return;
  }

  navLinks.style.visibility = "visible";
  navAccount.innerHTML = '<span class="nav-email">' + escapeHtml(session.user.email) + '</span><button class="link-btn" id="btnSignOut">Sign out</button>';
  document.getElementById("btnSignOut").addEventListener("click", signOut);

  var route = currentRoute();
  document.querySelectorAll(".nav-link").forEach(function (a) { a.classList.toggle("active", a.dataset.route === route); });
  if (route === "/review") renderReview(main);
  else if (route === "/troubleshoot") renderTroubleshoot(main);
  else if (route === "/method") renderMethod(main);
  else if (route === "/goals") renderGoals(main);
  else if (route === "/journal") renderJournal(main);
  else if (route === "/settings") renderSettings(main);
  else renderToday(main);
}

/* ---------------- Landing (logged out) ---------------- */
var landingTimer = null;
function renderLanding(main) {
  main.innerHTML =
    '<section class="landing-hero">' +
      '<p class="eyebrow">Anchor Moment → Tiny Behavior → Celebration</p>' +
      '<h1 class="landing-title">Small enough<br>to actually do.</h1>' +
      '<p class="sub" style="max-width:34rem;">Tiny Habits Practice turns BJ Fogg\'s method into a daily loop: pick a moment you already hit every day, attach something absurdly small to it, then celebrate on purpose. That\'s the whole system.</p>' +
      '<p class="landing-recipe" id="landingRecipe">' + LANDING_RECIPES[0] + '</p>' +
    '</section>' +
    '<div class="method-grid landing-steps">' +
      METHOD_STEPS.map(function (s) { return '<section class="card-paper method-card"><p class="method-num">' + s.n + '</p><h2 class="method-title">' + s.title + '</h2><p class="method-body">' + s.body + '</p></section>'; }).join("") +
    '</div>' +
    '<section class="card-paper auth-card">' +
      '<div class="auth-tabs">' +
        '<button class="auth-tab' + (authMode === "signin" ? " active" : "") + '" data-mode="signin" type="button">Sign in</button>' +
        '<button class="auth-tab' + (authMode === "signup" ? " active" : "") + '" data-mode="signup" type="button">Create account</button>' +
      '</div>' +
      '<form id="authForm" class="auth-form">' +
        '<div class="edit-field"><label class="field-label">Email</label><input type="email" class="input-line" id="authEmail" required autocomplete="email"></div>' +
        '<div class="edit-field"><label class="field-label">Password</label><input type="password" class="input-line" id="authPassword" required minlength="6" autocomplete="' + (authMode === "signup" ? "new-password" : "current-password") + '"></div>' +
        (authMessage ? '<p class="auth-message ' + (authMessageKind === "error" ? "is-error" : "is-info") + '">' + escapeHtml(authMessage) + '</p>' : "") +
        '<button type="submit" class="btn btn-primary btn-block" id="authSubmit" ' + (authBusy ? "disabled" : "") + '>' + (authBusy ? "Please wait…" : (authMode === "signin" ? "Sign in" : "Create account")) + '</button>' +
      '</form>' +
    '</section>' +
    '<footer class="page-footer">Anchor and behavior wording from the official Tiny Habits® Recipe Maker. Tiny Habits® is a trademark of BJ Fogg. A personal practice tool, not affiliated with Tiny Habits.</footer>';

  document.querySelectorAll(".auth-tab").forEach(function (btn) {
    btn.addEventListener("click", function () { authMode = btn.dataset.mode; authMessage = ""; render(); });
  });
  document.getElementById("authForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("authEmail").value.trim();
    var password = document.getElementById("authPassword").value;
    if (authMode === "signin") signIn(email, password); else signUp(email, password);
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || displayPrefs.calmMode;
  clearInterval(landingTimer);
  if (!reduceMotion) {
    var idx = 0;
    landingTimer = setInterval(function () {
      idx = (idx + 1) % LANDING_RECIPES.length;
      var el = document.getElementById("landingRecipe");
      if (!el) { clearInterval(landingTimer); return; }
      el.style.opacity = "0";
      setTimeout(function () {
        if (!document.getElementById("landingRecipe")) return;
        el.textContent = LANDING_RECIPES[idx];
        el.style.opacity = "1";
      }, 300);
    }, 3400);
  }
}

/* ---------------- Today ---------------- */
function greeting() { var h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }
function dateLong() { return new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }); }

function renderToday(main) {
  if (recipesLoading) { main.innerHTML = '<p class="sub" style="margin-top:3rem;">Loading your recipes…</p>'; return; }

  var active = recipes.filter(function (r) { return !r.paused; });
  var resting = recipes.filter(function (r) { return r.paused; });
  var today = todayStr();
  var doneCount = active.filter(function (r) { return r.log.includes(today); }).length;
  var headline = active.length === 0 ? "One tiny habit is enough to start." : (doneCount === active.length ? "Everything's done. Celebrate it." : doneCount + " of " + active.length + " done today.");

  main.innerHTML =
    '<p class="eyebrow">' + greeting() + ' · ' + dateLong() + '</p>' +
    '<h1 class="page-title">' + headline + '</h1>' +
    '<section class="block">' +
      '<div class="block-head"><h2 class="h2">Your recipes</h2><button class="btn btn-primary btn-pill" id="btnToggleBuilder" type="button">' + (builderOpen ? "Close" : "New habit") + '</button></div>' +
      '<div id="builderSlot"></div>' +
      '<div id="activeList"></div>' +
    '</section>' +
    (resting.length ? '<div class="block"><h3 class="h2" style="font-size:1.1rem;color:var(--muted-foreground)">Resting</h3><div id="restingList"></div></div>' : '') +
    '<p class="footer-quote">“Start with something that costs nothing. A habit that fails is a design flaw, not a character flaw.”</p>' +
    '<footer class="page-footer">Anchor and behavior wording from the official Tiny Habits® Recipe Maker. Tiny Habits® is a trademark of BJ Fogg. A personal practice tool, not affiliated with Tiny Habits.</footer>';

  document.getElementById("btnToggleBuilder").addEventListener("click", function () { builderOpen = !builderOpen; render(); });

  if (builderOpen) renderBuilder(document.getElementById("builderSlot"));

  var activeList = document.getElementById("activeList");
  if (active.length === 0 && !builderOpen) {
    activeList.innerHTML = '<p class="card-paper empty-note">Nothing here yet. Pick something so small it feels silly — “' + QUOTES[4] + '”</p>';
  } else {
    active.forEach(function (r) { activeList.appendChild(renderRecipeCard(r)); });
  }

  if (resting.length) {
    var restingList = document.getElementById("restingList");
    resting.forEach(function (r) { restingList.appendChild(renderRecipeCard(r)); });
  }
}

function renderBuilder(slot, opts) {
  opts = opts || {};
  var filteredBehaviors = BEHAVIORS.filter(function (b) { return b.category === builderState.category; });
  var celebrationPreview = builderState.celebration || CELEBRATIONS[0];
  slot.innerHTML =
    '<section class="card-paper" style="padding:1.5rem;margin-top:1.25rem;">' +
      '<div style="display:grid;gap:1.75rem;">' +
        '<div><h2 class="h2">After I…</h2><input type="text" class="input-line" style="margin-top:.75rem" id="bAnchor" placeholder="brush my teeth" value="' + escapeHtml(builderState.anchor) + '"><div class="chip-row" id="bAnchorChips"></div></div>' +
        '<div><h2 class="h2">I will…</h2><input type="text" class="input-line" style="margin-top:.75rem" id="bBehavior" placeholder="do two pushups" value="' + escapeHtml(builderState.behavior) + '">' +
          '<div class="chip-row" id="bCategoryPills" style="max-height:none;overflow:visible;"></div>' +
          '<div class="chip-row" id="bBehaviorChips"></div>' +
        '</div>' +
        '<div><h2 class="h2">And I\'ll celebrate by…</h2><input type="text" class="input-line" style="margin-top:.75rem" id="bCelebration" placeholder="a fist pump — or write your own" value="' + escapeHtml(builderState.celebration) + '"><div class="chip-row" id="bCelebrationChips" style="max-height:none;overflow:visible;"></div></div>' +
        '<div><h2 class="h2">Part of a goal</h2><select class="input-line" id="bGoal"><option value="">No goal — just a habit</option>' +
          goals.map(function (g) { return '<option value="' + g.id + '"' + (g.id === builderState.goalId ? " selected" : "") + '>' + escapeHtml(g.title) + '</option>'; }).join("") +
        '</select></div>' +
      '</div>' +
      '<div class="card-paper" style="margin-top:2rem;padding:1.25rem;border-style:dashed;background:color-mix(in oklab, var(--secondary) 60%, transparent);">' +
        '<p class="recipe-format-sentence">After I ' + (builderState.anchor ? '<u>' + escapeHtml(builderState.anchor) + '</u>' : '<span>[anchor moment]</span>') + ', I will ' + (builderState.behavior ? '<u>' + escapeHtml(builderState.behavior) + '</u>' : '<span>[tiny behavior]</span>') + '.</p>' +
        '<p class="stat-line" style="margin-top:.5rem">Celebration: ' + escapeHtml(celebrationPreview) + '</p>' +
      '</div>' +
      '<button class="btn btn-primary btn-block" id="bSave" type="button" ' + ((builderState.anchor.trim() && builderState.behavior.trim() && !builderBusy) ? "" : "disabled") + '>' + (builderBusy ? "Saving…" : "Keep this recipe") + '</button>' +
    '</section>';

  fillChips(document.getElementById("bAnchorChips"), ANCHORS, builderState.anchor, function (v) { builderState.anchor = v; renderBuilder(slot); });
  fillChips(document.getElementById("bBehaviorChips"), filteredBehaviors.map(function (b) { return b.text; }), builderState.behavior, function (v) { builderState.behavior = v; renderBuilder(slot); });
  fillChips(document.getElementById("bCelebrationChips"), CELEBRATIONS, builderState.celebration, function (v) { builderState.celebration = v; renderBuilder(slot); });

  var catWrap = document.getElementById("bCategoryPills");
  CATEGORIES.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "cat-pill" + (c === builderState.category ? " active" : "");
    b.textContent = c;
    b.addEventListener("click", function () { builderState.category = c; renderBuilder(slot); });
    catWrap.appendChild(b);
  });

  document.getElementById("bAnchor").addEventListener("input", function (e) { builderState.anchor = e.target.value; syncSaveState(); });
  document.getElementById("bBehavior").addEventListener("input", function (e) { builderState.behavior = e.target.value; syncSaveState(); });
  document.getElementById("bCelebration").addEventListener("input", function (e) { builderState.celebration = e.target.value; syncSaveState(); });
  document.getElementById("bGoal").addEventListener("change", function (e) { builderState.goalId = e.target.value; });
  document.getElementById("bSave").addEventListener("click", async function () {
    builderBusy = true; syncSaveState();
    var error = await addRecipe({
      anchor: builderState.anchor.trim(),
      behavior: builderState.behavior.trim(),
      celebration: (builderState.celebration.trim() || CELEBRATIONS[0]),
      goalId: builderState.goalId || null
    });
    builderBusy = false;
    if (error) { syncSaveState(); return; }
    builderState = { anchor: "", behavior: "", celebration: "", category: CATEGORIES[0], goalId: "" };
    builderOpen = false;
    render();
  });
  function syncSaveState() {
    var preview = slot.querySelector(".recipe-format-sentence");
    if (!preview) return;
    preview.innerHTML = "After I " + (builderState.anchor ? "<u>" + escapeHtml(builderState.anchor) + "</u>" : "<span>[anchor moment]</span>") + ", I will " + (builderState.behavior ? "<u>" + escapeHtml(builderState.behavior) + "</u>" : "<span>[tiny behavior]</span>") + ".";
    slot.querySelector(".stat-line").textContent = "Celebration: " + (builderState.celebration || CELEBRATIONS[0]);
    var saveBtn = document.getElementById("bSave");
    saveBtn.disabled = !(builderState.anchor.trim() && builderState.behavior.trim()) || builderBusy;
    saveBtn.textContent = builderBusy ? "Saving…" : "Keep this recipe";
  }
}

function fillChips(container, items, active, onPick) {
  items.forEach(function (item) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip" + (item === active ? " active" : "");
    b.textContent = item;
    b.addEventListener("click", function () { onPick(item); });
    container.appendChild(b);
  });
}

function renderRecipeCard(r) {
  var card = document.createElement("article");
  card.className = "card-paper recipe-card" + (r.paused ? " paused" : "");
  var doneToday = r.log.includes(todayStr());
  var streak = currentStreak(r.log);
  var best = longestStreak(r.log);
  var rate = Math.round(completionRate(r.log, 14) * 100);
  var editing = openEditId === r.id;
  var sug = suggestionFor(r);
  var goal = r.goal_id ? goals.find(function (g) { return g.id === r.goal_id; }) : null;

  card.innerHTML =
    '<div class="recipe-top">' +
      '<div>' +
        (goal ? '<p class="goal-tag">🎯 ' + escapeHtml(goal.title) + '</p>' : '') +
        '<p class="recipe-sentence">After I <span class="anchor-part">' + escapeHtml(r.anchor) + '</span>, I will <span class="behavior-part">' + escapeHtml(r.behavior) + '</span>.</p>' +
      '</div>' +
      '<button class="link-btn" data-act="edit">' + (editing ? "Close" : "Edit") + '</button>' +
    '</div>' +
    '<p class="recipe-meta-line">Celebrate: ' + escapeHtml(r.celebration) + '</p>' +
    '<div class="day-grid" id="dayGrid-' + r.id + '"></div>' +
    '<div class="stat-and-log">' +
      '<p class="stat-line">' + (displayPrefs.hideNumbers ? (streak > 0 ? "On track" : "Start today") : ((streak > 0 ? streak + " day" + (streak === 1 ? "" : "s") + " in a row" : "Start today") + ' · best ' + best + ' · ' + rate + '% of the last 14')) + '</p>' +
      '<button class="btn btn-pill" data-act="log" style="' + (doneToday ? "background:var(--secondary);color:var(--secondary-foreground)" : "background:var(--primary);color:var(--primary-foreground)") + '">' + (doneToday ? "Done today ✓" : "I did it") + '</button>' +
    '</div>' +
    (sug ? '<button type="button" class="suggestion-badge ' + sug.type + '" data-act="suggestion">' + escapeHtml(sug.label) + '</button>' : '') +
    (shineVisible[r.id] ? '<div class="shine-banner' + (displayPrefs.calmMode ? " no-animate" : "") + '">' + escapeHtml(r.celebration) + '</div>' : '') +
    (editing ? renderEditPanelHtml(r) : '');

  var dayGrid = card.querySelector("#dayGrid-" + r.id);
  lastNDates(21).forEach(function (d) {
    var cell = document.createElement("button");
    cell.type = "button"; cell.title = d; cell.setAttribute("aria-label", "Toggle " + d);
    cell.className = "day-cell" + (r.log.includes(d) ? " filled" : "");
    cell.addEventListener("click", async function () { await toggleDay(r.id, d); render(); });
    dayGrid.appendChild(cell);
  });

  card.querySelector('[data-act="edit"]').addEventListener("click", function () { openEditId = editing ? null : r.id; render(); });
  card.querySelector('[data-act="log"]').addEventListener("click", async function () {
    if (!doneToday) { shineVisible[r.id] = true; render(); setTimeout(function () { shineVisible[r.id] = false; render(); }, 1600); }
    await toggleDay(r.id, todayStr());
    render();
  });
  var sugBtn = card.querySelector('[data-act="suggestion"]');
  if (sugBtn) {
    sugBtn.addEventListener("click", function () {
      if (sug.type === "adjust") goTo("/troubleshoot");
      else { openEditId = r.id; render(); }
    });
  }

  if (editing) wireEditPanel(card, r);
  return card;
}

function renderEditPanelHtml(r) {
  return '<div class="edit-panel">' +
    '<div class="edit-field"><label class="field-label">Anchor moment</label><input type="text" class="input-line" data-field="anchor" value="' + escapeHtml(r.anchor) + '"></div>' +
    '<div class="edit-field"><label class="field-label">Tiny behavior</label><input type="text" class="input-line" data-field="behavior" value="' + escapeHtml(r.behavior) + '"></div>' +
    '<div class="edit-field"><label class="field-label">Celebration</label><input type="text" class="input-line" data-field="celebration" value="' + escapeHtml(r.celebration) + '"><div class="chip-row" id="editCelebrationChips-' + r.id + '"></div></div>' +
    '<div class="edit-field"><label class="field-label">Part of a goal</label><select class="input-line" data-field="goal_id"><option value="">No goal — just a habit</option>' +
      goals.map(function (g) { return '<option value="' + g.id + '"' + (g.id === r.goal_id ? " selected" : "") + '>' + escapeHtml(g.title) + '</option>'; }).join("") +
    '</select></div>' +
    '<div class="edit-actions">' +
      '<button class="btn btn-outline btn-sm" data-act="pause">' + (r.paused ? "Resume habit" : "Rest this habit") + '</button>' +
      '<button class="destructive-btn" data-act="delete">Delete</button>' +
    '</div>' +
  '</div>';
}

function wireEditPanel(card, r) {
  card.querySelector('[data-field="anchor"]').addEventListener("change", async function (e) { await updateRecipe(r.id, { anchor: e.target.value }); });
  card.querySelector('[data-field="behavior"]').addEventListener("change", async function (e) { await updateRecipe(r.id, { behavior: e.target.value }); });
  card.querySelector('[data-field="celebration"]').addEventListener("change", async function (e) { await updateRecipe(r.id, { celebration: e.target.value }); });
  card.querySelector('[data-field="goal_id"]').addEventListener("change", async function (e) { await updateRecipe(r.id, { goal_id: e.target.value || null }); render(); });
  fillChips(card.querySelector("#editCelebrationChips-" + r.id), CELEBRATIONS, r.celebration, async function (v) {
    await updateRecipe(r.id, { celebration: v }); render();
  });
  card.querySelector('[data-act="pause"]').addEventListener("click", async function () { await updateRecipe(r.id, { paused: !r.paused }); render(); });
  card.querySelector('[data-act="delete"]').addEventListener("click", async function () {
    if (confirm("Delete this recipe? This can't be undone.")) { await removeRecipe(r.id); openEditId = null; render(); }
  });
}

/* ---------------- Goals ---------------- */
function renderGoals(main) {
  if (recipesLoading) { main.innerHTML = '<p class="sub" style="margin-top:3rem;">Loading your goals…</p>'; return; }

  main.innerHTML =
    '<h1 class="page-title" style="font-size:clamp(2rem,5vw,3rem)">Goals</h1>' +
    '<p class="sub">A SMART goal is the bigger why. Your tiny-habit recipes are the steps that actually get you there.</p>' +
    '<div class="block-head" style="margin-top:2rem;"><h2 class="h2">Your goals</h2><button class="btn btn-primary btn-pill" id="btnToggleGoalForm" type="button">' + (goalFormOpen ? "Close" : "New goal") + '</button></div>' +
    '<div id="goalFormSlot"></div>' +
    (goals.length === 0 && !goalFormOpen ? '<p class="card-paper empty-note">No goals yet. A goal gives your recipes a reason — start with something specific and time-bound, like "Run a 5K by October."</p>' : '<div id="goalsList"></div>');

  document.getElementById("btnToggleGoalForm").addEventListener("click", function () { goalFormOpen = !goalFormOpen; render(); });
  if (goalFormOpen) renderGoalForm(document.getElementById("goalFormSlot"));
  if (goals.length) {
    var list = document.getElementById("goalsList");
    goals.forEach(function (g) { list.appendChild(renderGoalCard(g)); });
  }
}

function renderGoalForm(slot) {
  slot.innerHTML =
    '<section class="card-paper" style="padding:1.5rem;margin-top:1.25rem;">' +
      '<div style="display:grid;gap:1.25rem;">' +
        '<div class="edit-field"><label class="field-label">Goal <span style="text-transform:none;letter-spacing:0;">— specific and measurable</span></label><input type="text" class="input-line" id="gTitle" placeholder="Run a 5K without stopping" value="' + escapeHtml(goalFormState.title) + '"></div>' +
        '<div class="edit-field"><label class="field-label">Why it matters</label><input type="text" class="input-line" id="gWhy" placeholder="I want more energy for my kids" value="' + escapeHtml(goalFormState.why) + '"></div>' +
        '<div class="edit-field"><label class="field-label">Target date <span style="text-transform:none;letter-spacing:0;">— time-bound</span></label><input type="date" class="input-line" style="max-width:12rem" id="gDate" value="' + escapeHtml(goalFormState.targetDate) + '"></div>' +
      '</div>' +
      '<button class="btn btn-primary btn-block" id="gSave" type="button" ' + (goalFormState.title.trim() ? "" : "disabled") + '>Save goal</button>' +
    '</section>';

  document.getElementById("gTitle").addEventListener("input", function (e) { goalFormState.title = e.target.value; document.getElementById("gSave").disabled = !e.target.value.trim(); });
  document.getElementById("gWhy").addEventListener("input", function (e) { goalFormState.why = e.target.value; });
  document.getElementById("gDate").addEventListener("input", function (e) { goalFormState.targetDate = e.target.value; });
  document.getElementById("gSave").addEventListener("click", async function () {
    var error = await addGoal({ title: goalFormState.title.trim(), why: goalFormState.why.trim(), targetDate: goalFormState.targetDate || null });
    if (error) return;
    goalFormState = { title: "", why: "", targetDate: "" };
    goalFormOpen = false;
    render();
  });
}

function addStepToGoal(goalId) {
  builderState = { anchor: "", behavior: "", celebration: "", category: CATEGORIES[0], goalId: goalId };
  builderOpen = true;
  goTo("/");
}

function renderGoalCard(g) {
  var card = document.createElement("section");
  card.className = "card-paper goal-card";
  var steps = recipes.filter(function (r) { return r.goal_id === g.id; });
  var unlinked = recipes.filter(function (r) { return !r.goal_id; });
  var created = new Date(g.created_at);
  var today = new Date();

  var timeRow = "";
  if (g.target_date) {
    var target = new Date(g.target_date + "T00:00:00");
    var totalDays = daysBetween(created, target);
    var elapsedDays = daysBetween(created, today);
    var remaining = daysBetween(today, target);
    var timePct = totalDays > 0 ? clamp(elapsedDays / totalDays, 0, 1) * 100 : 100;
    timeRow = '<div class="progress-row"><div class="progress-label"><span>Time</span><span>' + (remaining >= 0 ? remaining + " days left" : "target date passed") + '</span></div><div class="progress-bar-track"><div class="progress-bar-fill" style="width:' + timePct + '%"></div></div></div>';
  }
  var consistencyPct = steps.length ? Math.round(steps.reduce(function (s, r) { return s + completionRate(r.log, 14); }, 0) / steps.length * 100) : 0;
  var consistencyRow = '<div class="progress-row"><div class="progress-label"><span>Habit consistency</span><span>' + consistencyPct + '% (last 14 days)</span></div><div class="progress-bar-track"><div class="progress-bar-fill" style="width:' + consistencyPct + '%"></div></div></div>';

  card.innerHTML =
    '<div class="recipe-top">' +
      '<div><h2 class="goal-title">' + escapeHtml(g.title) + '</h2>' + (g.why ? '<p class="goal-why">' + escapeHtml(g.why) + '</p>' : '') + '</div>' +
      '<button class="destructive-btn" data-act="deleteGoal">Delete</button>' +
    '</div>' +
    timeRow + consistencyRow +
    '<div class="goal-steps">' +
      '<h3 class="h2" style="font-size:1rem;">Steps</h3>' +
      '<div id="goalSteps-' + g.id + '"></div>' +
      (steps.length === 0 ? '<p class="stat-line" style="margin-top:.5rem;">No steps yet — attach a recipe or add a new one.</p>' : '') +
      '<div class="add-step-row">' +
        (unlinked.length ? '<select class="input-line" id="attachSelect-' + g.id + '" style="max-width:20rem;"><option value="">Attach an existing recipe…</option>' + unlinked.map(function (r) { return '<option value="' + r.id + '">After I ' + escapeHtml(r.anchor) + ', I will ' + escapeHtml(r.behavior) + '</option>'; }).join("") + '</select><button class="btn btn-outline btn-sm" data-act="attach">Attach</button>' : "") +
        '<button class="btn btn-primary btn-sm" data-act="addStep">+ New step</button>' +
      '</div>' +
    '</div>';

  var stepsSlot = card.querySelector("#goalSteps-" + g.id);
  steps.forEach(function (r) { stepsSlot.appendChild(renderRecipeCard(r)); });

  card.querySelector('[data-act="deleteGoal"]').addEventListener("click", async function () {
    if (confirm('Delete "' + g.title + '"? Its steps stay, just unlinked from this goal.')) { await removeGoal(g.id); render(); }
  });
  card.querySelector('[data-act="addStep"]').addEventListener("click", function () { addStepToGoal(g.id); });
  var attachBtn = card.querySelector('[data-act="attach"]');
  if (attachBtn) {
    attachBtn.addEventListener("click", async function () {
      var sel = document.getElementById("attachSelect-" + g.id);
      if (!sel.value) return;
      await updateRecipe(sel.value, { goal_id: g.id });
      render();
    });
  }
  return card;
}

/* ---------------- Journal ---------------- */
function renderJournal(main) {
  if (recipesLoading) { main.innerHTML = '<p class="sub" style="margin-top:3rem;">Loading your journal…</p>'; return; }

  main.innerHTML =
    '<h1 class="page-title" style="font-size:clamp(2rem,5vw,3rem)">Journal</h1>' +
    '<p class="sub">The mindset side of the practice — how the habits are actually landing, in your own words.</p>' +
    '<section class="card-paper journal-composer" style="margin-top:2rem;">' +
      '<textarea class="input-line journal-textarea" id="journalText" placeholder="What\'s on your mind? How did today feel?"></textarea>' +
      '<p class="field-label" style="margin-top:1.25rem;">Tag a related habit</p>' +
      '<div class="chip-row" id="journalTagChips" style="max-height:none;overflow:visible;"></div>' +
      '<button class="btn btn-primary" id="journalSave" style="margin-top:1.5rem;" disabled>Save entry</button>' +
    '</section>' +
    (journal.length ? '<div id="journalList" class="block"></div>' : '<p class="card-paper empty-note">No entries yet. A line or two after logging a habit is plenty.</p>');

  var chipWrap = document.getElementById("journalTagChips");
  recipes.forEach(function (r) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (journalTags.has(r.id) ? " active" : "");
    chip.textContent = r.behavior;
    chip.addEventListener("click", function () {
      if (journalTags.has(r.id)) journalTags.delete(r.id); else journalTags.add(r.id);
      chip.classList.toggle("active");
    });
    chipWrap.appendChild(chip);
  });

  var textarea = document.getElementById("journalText");
  var saveBtn = document.getElementById("journalSave");
  textarea.addEventListener("input", function () { saveBtn.disabled = !textarea.value.trim(); });
  saveBtn.addEventListener("click", async function () {
    var text = textarea.value.trim();
    if (!text) return;
    var error = await addJournalEntry(text, Array.from(journalTags));
    if (error) return;
    journalTags = new Set();
    render();
  });

  if (journal.length) {
    var list = document.getElementById("journalList");
    journal.forEach(function (entry) { list.appendChild(renderJournalEntry(entry)); });
  }
}

function renderJournalEntry(entry) {
  var card = document.createElement("article");
  card.className = "card-paper journal-entry";
  var tags = (entry.tag_recipe_ids || []).map(function (id) { return recipes.find(function (r) { return r.id === id; }); }).filter(Boolean);
  card.innerHTML =
    '<div class="recipe-top">' +
      '<span class="journal-date">' + new Date(entry.created_at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) + '</span>' +
      '<button class="link-btn" data-act="deleteEntry">Delete</button>' +
    '</div>' +
    '<p class="journal-text">' + escapeHtml(entry.text) + '</p>' +
    (tags.length ? '<div class="journal-tags">' + tags.map(function (r) { return '<span class="journal-tag">' + escapeHtml(r.behavior) + '</span>'; }).join("") + '</div>' : '');
  card.querySelector('[data-act="deleteEntry"]').addEventListener("click", async function () {
    if (confirm("Delete this journal entry?")) { await removeJournalEntry(entry.id); render(); }
  });
  return card;
}

/* ---------------- Settings ---------------- */
function renderSettings(main) {
  if (recipesLoading || !userSettings) { main.innerHTML = '<p class="sub" style="margin-top:3rem;">Loading your settings…</p>'; return; }

  main.innerHTML =
    '<h1 class="page-title" style="font-size:clamp(2rem,5vw,3rem)">Settings</h1>' +
    '<p class="sub">Notifications, and how the app looks and sounds for you.</p>' +

    '<section class="card-paper settings-card">' +
      '<h2 class="h2">Notifications</h2>' +
      '<p class="stat-line" style="margin-top:.5rem;">A single daily nudge — not tied to any one habit, just a reminder to show up.</p>' +
      '<label class="settings-row"><input type="checkbox" id="setReminderEnabled" ' + (userSettings.daily_reminder_enabled ? "checked" : "") + '><span><b>Remind me once a day</b><br><span class="stat-line">Fires while a tab is open — this can\'t reach you if the browser is fully closed.</span></span></label>' +
      '<div class="edit-field" style="margin-top:1rem;max-width:12rem;' + (userSettings.daily_reminder_enabled ? "" : "display:none;") + '" id="reminderTimeField"><label class="field-label">Time</label><input type="time" class="input-line" id="setReminderTime" value="' + escapeHtml(userSettings.daily_reminder_time || "09:00") + '"></div>' +
      (notifPermission === "default" ? '<button class="btn btn-outline btn-sm" id="btnRequestNotif" style="margin-top:1rem;" type="button">Allow browser notifications</button>' : "") +
      (notifPermission === "denied" ? '<p class="stat-line" style="margin-top:1rem;color:var(--destructive);">Notifications are blocked for this site in your browser — the reminder will be silent until you allow them.</p>' : "") +
      '<button class="btn btn-primary btn-sm" id="btnSaveReminder" style="margin-top:1.25rem;">Save</button>' +
      '<p class="settings-saved" id="reminderSaved" aria-live="polite" hidden>Saved.</p>' +
    '</section>' +

    '<section class="card-paper settings-card">' +
      '<h2 class="h2">Display &amp; accessibility</h2>' +
      '<label class="settings-row"><input type="checkbox" id="prefCalm" ' + (displayPrefs.calmMode ? "checked" : "") + '><span><b>Calm mode</b><br><span class="stat-line">Turns off motion and animated celebrations — confirmations become plain and still.</span></span></label>' +
      '<label class="settings-row"><input type="checkbox" id="prefLargeText" ' + (displayPrefs.largerText ? "checked" : "") + '><span><b>Larger text</b><br><span class="stat-line">Scales up all text on this device.</span></span></label>' +
      '<label class="settings-row"><input type="checkbox" id="prefContrast" ' + (displayPrefs.highContrast ? "checked" : "") + '><span><b>High contrast</b><br><span class="stat-line">Stronger borders and darker text throughout.</span></span></label>' +
      '<label class="settings-row"><input type="checkbox" id="prefHideNumbers" ' + (displayPrefs.hideNumbers ? "checked" : "") + '><span><b>Hide streak numbers</b><br><span class="stat-line">Shows "on track" instead of day counts and percentages, if numbers add pressure rather than help.</span></span></label>' +
    '</section>' +

    '<section class="card-paper settings-card">' +
      '<h2 class="h2">Account</h2>' +
      '<p class="stat-line" style="margin-top:.5rem;">Signed in as ' + escapeHtml(session.user.email) + '</p>' +
      '<button class="btn btn-outline btn-sm" id="btnSettingsSignOut" style="margin-top:1rem;">Sign out</button>' +
    '</section>';

  var enabledBox = document.getElementById("setReminderEnabled");
  enabledBox.addEventListener("change", function () {
    document.getElementById("reminderTimeField").style.display = enabledBox.checked ? "" : "none";
  });
  var notifBtn = document.getElementById("btnRequestNotif");
  if (notifBtn) notifBtn.addEventListener("click", requestNotifPermission);
  document.getElementById("btnSaveReminder").addEventListener("click", async function () {
    var error = await saveUserSettings({
      daily_reminder_enabled: enabledBox.checked,
      daily_reminder_time: document.getElementById("setReminderTime").value || "09:00"
    });
    if (error) return;
    var saved = document.getElementById("reminderSaved");
    saved.hidden = false;
    setTimeout(function () { saved.hidden = true; }, 2000);
  });

  document.getElementById("prefCalm").addEventListener("change", function (e) { displayPrefs.calmMode = e.target.checked; saveDisplayPrefs(); applyDisplayPrefs(); });
  document.getElementById("prefLargeText").addEventListener("change", function (e) { displayPrefs.largerText = e.target.checked; saveDisplayPrefs(); applyDisplayPrefs(); });
  document.getElementById("prefContrast").addEventListener("change", function (e) { displayPrefs.highContrast = e.target.checked; saveDisplayPrefs(); applyDisplayPrefs(); });
  document.getElementById("prefHideNumbers").addEventListener("change", function (e) { displayPrefs.hideNumbers = e.target.checked; saveDisplayPrefs(); render(); });

  document.getElementById("btnSettingsSignOut").addEventListener("click", signOut);
}

/* ---------------- Review ---------------- */
function renderReview(main) {
  if (recipesLoading) { main.innerHTML = '<p class="sub" style="margin-top:3rem;">Loading your recipes…</p>'; return; }

  var week = lastNDates(7);
  var repsThisWeek = recipes.reduce(function (sum, r) { return sum + week.filter(function (d) { return r.log.includes(d); }).length; }, 0);
  var habitsInPlay = recipes.filter(function (r) { return !r.paused; }).length;
  var longest = recipes.reduce(function (m, r) { return Math.max(m, longestStreak(r.log)); }, 0);

  main.innerHTML =
    '<h1 class="page-title" style="font-size:clamp(2rem,5vw,3rem)">Review</h1>' +
    '<p class="sub">Look at the last week without judging it. If a habit didn\'t happen, the design is off — not you. Make it smaller, or find a better anchor.</p>' +
    '<div class="stat-tiles">' +
      tileHtml("Reps this week", repsThisWeek) +
      tileHtml("Habits in play", habitsInPlay) +
      tileHtml("Longest streak", longest) +
    '</div>' +
    (recipes.length === 0 ? '<p class="card-paper empty-note">Nothing to review yet. Create a recipe first.</p>' : '<div id="reviewList"></div>') +
    (recipes.length > 0 ? '<div class="data-section"><h2 class="h2">Your data</h2><p class="stat-line" style="margin-top:.5rem">Your recipes are saved to your account and sync wherever you sign in.</p><div class="data-actions"><button class="btn btn-outline btn-sm" id="btnExport">Export</button><button class="btn btn-outline btn-sm" id="btnImport">Import</button><input type="file" id="fileImport" accept="application/json" style="display:none"></div></div>' : '');

  function tileHtml(label, value) {
    return '<div class="card-paper stat-tile"><p class="value">' + value + '</p><p class="label">' + label + '</p></div>';
  }

  if (recipes.length) {
    var list = document.getElementById("reviewList");
    recipes.forEach(function (r) { list.appendChild(renderReviewCard(r)); });

    document.getElementById("btnExport").addEventListener("click", function () {
      var blob = new Blob([JSON.stringify(recipes, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "tiny-habits-" + todayStr() + ".json"; a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById("btnImport").addEventListener("click", function () { document.getElementById("fileImport").click(); });
    document.getElementById("fileImport").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      file.text().then(async function (text) {
        try {
          var parsed = JSON.parse(text);
          if (Array.isArray(parsed)) { await importRecipes(parsed); render(); }
        } catch (err) { console.error(err); }
      });
      e.target.value = "";
    });
  }
}

function renderReviewCard(r) {
  var card = document.createElement("section");
  card.className = "card-paper review-card";
  var days84 = lastNDates(84);
  var cols = [];
  for (var i = 0; i < days84.length; i += 7) cols.push(days84.slice(i, i + 7));
  var rate4wk = Math.round(completionRate(r.log, 28) * 100);

  card.innerHTML =
    '<p class="recipe-sentence">After I <span class="anchor-part">' + escapeHtml(r.anchor) + '</span>, I will ' + escapeHtml(r.behavior) + '.</p>' +
    '<p class="recipe-meta-line">' + (displayPrefs.hideNumbers ? (currentStreak(r.log) > 0 ? "On track" : "Just getting started") : (currentStreak(r.log) + ' in a row · ' + rate4wk + '% over 4 weeks · ' + r.log.length + ' total')) + '</p>' +
    '<div class="heatmap">' + cols.map(function (col) {
      return '<div class="heatmap-col">' + col.map(function (d) {
        return '<span class="heatmap-cell' + (r.log.includes(d) ? " filled" : "") + '" title="' + d + '"></span>';
      }).join("") + '</div>';
    }).join("") + '</div>' +
    '<div class="reflection-row"><input type="text" class="input-line" placeholder="What made it easy or hard?" id="note-' + r.id + '"><button class="btn btn-secondary btn-sm" id="saveNote-' + r.id + '" disabled>Save</button></div>' +
    ((r.notes || []).length ? '<ul class="notes-list">' + r.notes.slice().reverse().slice(0, 4).map(function (n) {
      return '<li><span class="note-date">' + new Date(n.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) + '</span> — ' + escapeHtml(n.text) + '</li>';
    }).join("") + '</ul>' : '');

  var input = card.querySelector("#note-" + r.id);
  var saveBtn = card.querySelector("#saveNote-" + r.id);
  input.addEventListener("input", function () { saveBtn.disabled = !input.value.trim(); });
  saveBtn.addEventListener("click", async function () { await addNote(r.id, input.value.trim()); render(); });
  return card;
}

/* ---------------- Troubleshoot ---------------- */
var QUESTIONS = [
  { q: "Did you remember to do it?", no: { title: "It's a prompt problem.", body: "No prompt, no behavior. Choose an anchor that already happens reliably at the right time and place, and match its energy. Add a backup nudge on the habit card if the anchor is still new." } },
  { q: "When you remembered, could you do it easily?", no: { title: "It's an ability problem.", body: "Make it smaller until it takes 30 seconds or less, or remove whatever's in the way. Scale down before you push harder." } },
  { q: "Did you feel good right after doing it?", no: { title: "You're missing the celebration.", body: "Emotions create habits. Find a celebration that genuinely gives you a shot of Shine — say it out loud, move your body, picture someone cheering. It has to feel real." } }
];

function renderTroubleshoot(main) {
  main.innerHTML =
    '<h1 class="page-title" style="font-size:clamp(2rem,5vw,3rem)">Something isn\'t sticking</h1>' +
    '<p class="sub">A habit that fails is a design flaw, not a character flaw. Three questions, in order.</p>' +
    '<div class="card-paper diagnostic-card" id="diagnosticSlot"></div>' +
    '<div class="block"><h2 class="h2">Five things that make anything hard</h2><p class="stat-line" style="margin-top:.35rem">Find your weakest link, then fix that one.</p><div class="factor-grid">' +
      ABILITY_FACTORS.map(function (f) { return '<div class="card-paper factor-card"><p class="fname font-display">' + f.name + '</p><p class="fhint">' + f.hint + '</p></div>'; }).join("") +
    '</div></div>' +
    '<div class="block"><h2 class="h2">Ways to scale it down</h2><ul class="scale-list">' +
      SCALE_DOWN.map(function (s) { return '<li class="card-paper">' + s + '</li>'; }).join("") +
    '</ul></div>';

  renderDiagnosticStep(document.getElementById("diagnosticSlot"));
}

function renderDiagnosticStep(slot) {
  if (troubleAnswer) {
    slot.innerHTML =
      '<h2 class="diagnosis-title">' + troubleAnswer.title + '</h2>' +
      '<p class="diagnosis-body">' + troubleAnswer.body + '</p>' +
      '<button class="btn btn-outline btn-sm" id="btnStartOver" style="margin-top:1.25rem">Start over</button>';
    document.getElementById("btnStartOver").addEventListener("click", function () { troubleAnswer = null; troubleStep = 0; renderDiagnosticStep(slot); });
    return;
  }
  if (troubleStep < QUESTIONS.length) {
    var step = QUESTIONS[troubleStep];
    slot.innerHTML =
      '<p class="q-index">Question ' + (troubleStep + 1) + ' of ' + QUESTIONS.length + '</p>' +
      '<h2 class="q-text">' + step.q + '</h2>' +
      '<div class="q-actions"><button class="btn btn-secondary" id="btnYes">Yes</button><button class="btn btn-primary" id="btnNo">Not really</button></div>';
    document.getElementById("btnYes").addEventListener("click", function () { troubleStep++; renderDiagnosticStep(slot); });
    document.getElementById("btnNo").addEventListener("click", function () { troubleAnswer = step.no; renderDiagnosticStep(slot); });
  } else {
    slot.innerHTML =
      '<h2 class="diagnosis-title">The habit is working.</h2>' +
      '<p class="diagnosis-body">Let it grow on its own. If you want more, add a second tiny habit rather than stretching this one until it breaks.</p>' +
      '<button class="btn btn-outline btn-sm" id="btnStartOver2" style="margin-top:1.25rem">Start over</button>';
    document.getElementById("btnStartOver2").addEventListener("click", function () { troubleStep = 0; renderDiagnosticStep(slot); });
  }
}

/* ---------------- Method ---------------- */
function renderMethod(main) {
  main.innerHTML =
    '<h1 class="page-title" style="font-size:clamp(2rem,5vw,3rem)">The method</h1>' +
    '<p class="sub">“' + QUOTES[1] + '” — the Fogg Behavior Model, B = MAP.</p>' +
    '<div class="method-grid">' +
      METHOD_STEPS.map(function (s) { return '<section class="card-paper method-card"><p class="method-num">' + s.n + '</p><h2 class="method-title">' + s.title + '</h2><p class="method-body">' + s.body + '</p></section>'; }).join("") +
    '</div>' +
    '<section class="card-paper method-card" style="margin-top:1.25rem;">' +
      '<h2 class="h2">The recipe format</h2>' +
      '<p class="recipe-format-sentence">After I <span>[anchor moment]</span>, I will <span>[new tiny behavior]</span>.</p>' +
      '<p class="stat-line" style="margin-top:.5rem">Then celebrate immediately. “' + QUOTES[2] + '”</p>' +
    '</section>' +
    '<div class="block"><h2 class="h2">Go deeper</h2><ul class="deeper-list">' +
      DEEPER_LINKS.map(function (l) { return '<li><a href="' + l[1] + '" target="_blank" rel="noreferrer">' + l[0] + '</a></li>'; }).join("") +
    '</ul></div>';
}

render();
