const iframeWindow = document.getElementById("iframeWindow");
const splashScreen = document.getElementById("splashScreen");
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
    // Show the branding splash before loading the requested proxy target.
    splashScreen.hidden = false;

    window.setTimeout(() => {
        splashScreen.hidden = true;
        loadTargetSite();
    }, 3000);
}
