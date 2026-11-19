/* Install prompt and iOS Add-to-Home-Screen guidance. */
(function () {
  let installPrompt = null;
  const button = document.getElementById("pwa-install");
  if (!button) return;
  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  if (isStandalone()) return;
  if (isIOS) {
    button.hidden = false;
    button.textContent = "راهنمای نصب";
    button.addEventListener("click", () => alert("برای نصب German Daily در آیفون: دکمه Share را در Safari بزنید، سپس Add to Home Screen را انتخاب کنید."));
  }
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault(); installPrompt = event; button.hidden = false;
    button.textContent = "＋ نصب برنامه";
  });
  button.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null; button.hidden = true;
  });
  window.addEventListener("appinstalled", () => { button.hidden = true; installPrompt = null; });
})();
