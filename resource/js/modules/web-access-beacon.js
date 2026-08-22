const COLLECTOR_ENDPOINT = "https://vinci.lumina-group.jp/api/v1/web-access/beacon";

const VIEWPORT_BUCKETS = [
    [480, "compact"],
    [768, "phone"],
    [1024, "tablet"],
    [1440, "desktop"],
    [Number.POSITIVE_INFINITY, "wide"]
];

function viewportBucket(width) {
    const match = VIEWPORT_BUCKETS.find(([maximum]) => width <= maximum);
    return match ? match[1] : "wide";
}

function referrerHost() {
    if (!document.referrer) return null;
    try {
        return new URL(document.referrer).hostname || null;
    } catch {
        return null;
    }
}

/**
 * The public Lumina site only sends coarse navigation context. The browser
 * never reads cookies or supplies an account, IP address, user agent, token,
 * or tracking identifier; the private Vinci Cloud collector derives and
 * protects those values server-side.
 */
export function initWebAccessBeacon() {
    const body = JSON.stringify({
        site: "lumina",
        page_path: window.location.pathname,
        referrer_host: referrerHost(),
        viewport_bucket: viewportBucket(window.innerWidth)
    });
    void fetch(COLLECTOR_ENDPOINT, {
        method: "POST",
        mode: "cors",
        // The HttpOnly cookie belongs to vinci.lumina-group.jp, not to this
        // public static origin. It is therefore never exposed to site JS.
        credentials: "include",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body
    }).catch(() => undefined);
}
