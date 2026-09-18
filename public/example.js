const iframeWindow = document.getElementById("iframeWindow");
const requestedSite = new URLSearchParams(window.location.search).get("r");

if (requestedSite && requestedSite.trim()) {
    let url = requestedSite.trim();

    // Allow both ?r=example.com and ?r=https://example.com.
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }

    try {
        const target = new URL(url);
        iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(target.href);
    } catch {
        // Do not navigate when the r parameter is not a valid URL.
        iframeWindow.removeAttribute("src");
    }
}
