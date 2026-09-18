const iframeWindow = document.getElementById("iframeWindow");
const welcomePopup = document.getElementById("welcomePopup");
const closePopup = document.getElementById("closePopup");
const requestedSite = new URLSearchParams(window.location.search).get("r");
let targetUrl = null;

if (requestedSite && requestedSite.trim()) {
    let url = requestedSite.trim();

    // Allow both ?r=example.com and ?r=https://example.com.
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }

    try {
        const target = new URL(url);
        if (target.protocol === "http:" || target.protocol === "https:") {
            targetUrl = target.href;
        }
    } catch {
        targetUrl = null;
    }
}

function loadTargetSite() {
    if (!targetUrl) return;
    iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(targetUrl);
}

if (targetUrl) {
    // Keep the target out of the iframe until the user dismisses the popup.
    welcomePopup.hidden = false;
    closePopup.focus();
}

closePopup.addEventListener("click", () => {
    welcomePopup.hidden = true;
    loadTargetSite();
});
