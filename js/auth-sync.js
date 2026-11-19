/* German Daily - optional Supabase authentication and cloud backup.
 * Local-first: the existing app remains usable when Supabase is not configured
 * or when the user is offline. Cloud data is scoped to auth.uid().
 */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const cfg = window.GD_SUPABASE_CONFIG || {};
  const configured = !!(cfg.url && cfg.anonKey && !cfg.url.includes("YOUR-PROJECT") && !cfg.anonKey.includes("YOUR_SUPABASE"));
  let client = null, currentUser = null, syncTimer = null, syncing = false;

  const status = (message, error = false) => {
    const el = $("auth-status");
    if (el) { el.textContent = message || ""; el.style.color = error ? "#fca5a5" : "#7dd3fc"; }
  };
  const showAccount = () => {
    $("account-panel")?.classList.remove("hidden");
    status(configured ? "" : "ورود ابری هنوز پیکربندی نشده است.");
  };
  const closeAccount = () => $("account-panel")?.classList.add("hidden");
  const localSnapshot = () => ({
    settings: window.GD?.state?.settings || {},
    custom_words: window.GD?.state?.customWords || [],
    updated_at: new Date().toISOString()
  });

  function mergeObjects(local, cloud) {
    // Cloud scalar preferences win on a newly signed-in device; learning maps are merged.
    const merged = { ...(local || {}), ...(cloud || {}) };
    // Combine learned words and Leitner progress instead of discarding either device.
    merged.known = { ...(cloud?.known || {}), ...(local?.known || {}) };
    merged.leitner = { ...(cloud?.leitner || {}), ...(local?.leitner || {}) };
    return merged;
  }
  function mergeCustom(local = [], cloud = []) {
    const map = new Map();
    [...cloud, ...local].forEach(w => {
      const key = String(w?.g || w?.word || JSON.stringify(w)).trim().toLowerCase();
      if (key) map.set(key, w);
    });
    return [...map.values()];
  }

  async function pullCloud() {
    if (!client || !currentUser || !navigator.onLine || syncing) return;
    syncing = true;
    try {
      const { data, error } = await client.from("user_data")
        .select("settings, custom_words, updated_at")
        .eq("user_id", currentUser.id).maybeSingle();
      if (error) throw error;
      if (data && window.GD?.state) {
        const S = window.GD.state;
        S.settings = mergeObjects(S.settings, data.settings || {});
        S.customWords = mergeCustom(S.customWords, data.custom_words || []);
        window.GD.saveSettings(); window.GD.saveCustom();
        // Refresh controls and visible lists without reloading vocabulary/grammar.
        const perDay = $("per-day"), onlyVerbs = $("only-verbs"), chapter = $("filter-chapter");
        if (perDay) perDay.value = S.settings.perDay || 5;
        if (onlyVerbs) onlyVerbs.checked = !!S.settings.onlyVerbs;
        if (chapter) chapter.value = S.settings.chapter || "";
        window.GD.buildDailyList?.(); window.GD.renderCustomList?.();
      }
      status(data ? "اطلاعات ابری دریافت و با داده‌های این دستگاه ادغام شد." : "حساب آماده همگام‌سازی است؛ هنوز نسخه ابری ندارد.");
    } catch (e) {
      console.warn("German Daily cloud pull:", e);
      status("دریافت اطلاعات ابری انجام نشد؛ داده‌های محلی محفوظ‌اند.", true);
    } finally { syncing = false; }
    if (currentUser) await pushCloud();
  }

  async function pushCloud() {
    if (!client || !currentUser || !navigator.onLine || syncing) return;
    syncing = true;
    try {
      const snapshot = localSnapshot();
      const { error } = await client.from("user_data").upsert({
        user_id: currentUser.id,
        settings: snapshot.settings,
        custom_words: snapshot.custom_words,
        updated_at: snapshot.updated_at
      }, { onConflict: "user_id" });
      if (error) throw error;
      status("همگام‌سازی با موفقیت انجام شد.");
    } catch (e) {
      console.warn("German Daily cloud push:", e);
      status("همگام‌سازی ناموفق بود؛ اطلاعات روی دستگاه باقی ماند.", true);
    } finally { syncing = false; }
  }

  function scheduleSync() {
    if (!currentUser || !client) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => pushCloud(), 1600);
  }

  function renderSession(user) {
    currentUser = user || null;
    const signed = !!currentUser;
    $("account-form")?.classList.toggle("hidden", signed);
    $("account-signed")?.classList.toggle("hidden", !signed);
    $("account-open").textContent = signed ? "حساب من" : "ورود";
    if (signed) {
      $("account-user").textContent = `وارد شده‌اید: ${currentUser.email || "حساب Google"}`;
      $("account-summary").textContent = "پیشرفت و لغات شخصی شما با حساب کاربری همگام می‌شود.";
    } else {
      $("account-summary").textContent = "برای همگام‌سازی پیشرفت بین دستگاه‌ها وارد شوید. استفاده آفلاین و مهمان همچنان فعال است.";
    }
  }

  async function runAuth(action) {
    if (!configured || !client) { status("ابتدا URL و anon key پروژه Supabase را در js/supabase-config.js تنظیم کنید.", true); return; }
    const email = $("auth-email").value.trim();
    const password = $("auth-password").value;
    try {
      status("در حال اتصال…");
      let result;
      if (action === "signin") {
        result = await client.auth.signInWithPassword({ email, password });
      } else if (action === "signup") {
        if (password.length < 6) throw new Error("رمز عبور باید حداقل ۶ کاراکتر باشد.");
        result = await client.auth.signUp({ email, password, options: { emailRedirectTo: location.href.split("#")[0] } });
      } else if (action === "google") {
        result = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.href.split("#")[0] } });
      } else if (action === "reset") {
        if (!email) throw new Error("ابتدا ایمیل خود را وارد کنید.");
        result = await client.auth.resetPasswordForEmail(email, { redirectTo: location.href.split("#")[0] });
        status("لینک بازیابی رمز عبور برای ایمیل شما ارسال شد."); return;
      }
      if (result?.error) throw result.error;
      if (action === "signup" && !result.data?.session) status("ثبت‌نام انجام شد. اگر تأیید ایمیل فعال است، صندوق ایمیل خود را بررسی کنید.");
      else status("ورود با موفقیت انجام شد.");
    } catch (e) { status(e.message || "خطا در ورود به حساب.", true); }
  }

  async function init() {
    $("account-open")?.addEventListener("click", showAccount);
    $("account-close")?.addEventListener("click", closeAccount);
    $("account-panel")?.addEventListener("click", e => { if (e.target.id === "account-panel") closeAccount(); });
    $("auth-signin")?.addEventListener("click", () => runAuth("signin"));
    $("auth-signup")?.addEventListener("click", () => runAuth("signup"));
    $("auth-google")?.addEventListener("click", () => runAuth("google"));
    $("auth-reset")?.addEventListener("click", () => runAuth("reset"));
    $("auth-sync")?.addEventListener("click", () => pushCloud());
    $("auth-signout")?.addEventListener("click", async () => {
      if (client) { const { error } = await client.auth.signOut(); if (error) status(error.message, true); else status("از حساب خارج شدید."); }
    });

    // Hook into existing local save functions; no changes to the learning logic.
    if (window.GD) {
      const oldSettings = GD.saveSettings, oldCustom = GD.saveCustom;
      GD.saveSettings = function () { oldSettings.apply(this, arguments); scheduleSync(); };
      GD.saveCustom = function () { oldCustom.apply(this, arguments); scheduleSync(); };
    }
    if (!configured || !window.supabase?.createClient) {
      renderSession(null);
      if (!configured) console.info("German Daily: Supabase is not configured. Guest/local mode remains available.");
      return;
    }
    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    window.GD_AUTH = { get user() { return currentUser; }, sync: pushCloud, signOut: () => client.auth.signOut() };
    const { data, error } = await client.auth.getSession();
    if (error) console.warn(error);
    renderSession(data?.session?.user || null);
    if (currentUser) await pullCloud();
    client.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      renderSession(user);
      if (user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) setTimeout(() => pullCloud(), 0);
    });
    window.addEventListener("online", () => { if (currentUser) pushCloud(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
