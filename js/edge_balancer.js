/**
 * OmniScope OSINT // Tri-Cloud Edge Balancer & Smart Quota Failover Ring (v2.8.0)
 * -------------------------------------------------------------------------------
 * Automatic failover and anti-loop circuit breaker across:
 * 1. Cloudflare Pages (Primary Production): https://omniscope-web.pages.dev
 * 2. Vercel Edge (Secondary Relay):         https://omniscope-web.vercel.app
 * 3. Netlify Edge (Tertiary Safety Net):    https://omniscope-web.netlify.app
 * 
 * Prevents 100k daily request quota exhaustion during viral traffic spikes.
 * Zero infinite redirect loops guaranteed via chain tracking & circuit breaking.
 */

(function () {
    'use strict';

    // 1. Multi-Cloud Node Registry
    var NODES = [
        { id: 'cloudflare', name: 'Cloudflare Pages', hostPattern: /pages\.dev|workers\.dev/, origin: 'https://omniscope-web.pages.dev' },
        { id: 'vercel',     name: 'Vercel Edge',       hostPattern: /vercel\.app/,              origin: 'https://omniscope-web.vercel.app' },
        { id: 'netlify',    name: 'Netlify Edge',      hostPattern: /netlify\.app/,             origin: 'https://omniscope-web.netlify.app' }
    ];

    var STORAGE_KEY_CHAIN = 'omni_failover_chain';
    var STORAGE_KEY_DEGRADED = 'omni_degraded_nodes_ttl';
    var TTL_MS = 10 * 60 * 1000; // 10 minutes degradation cache

    // 2. Localhost & Development Guard
    var hostname = window.location.hostname || '';
    if (hostname === 'localhost' || hostname === '127.0.0.1' || window.location.protocol === 'file:') {
        console.log('[OmniEdgeBalancer] Local development environment detected. Failover bypassed.');
        return;
    }

    // 3. Resolve Current Provider
    var currentNode = null;
    for (var i = 0; i < NODES.length; i++) {
        if (NODES[i].hostPattern.test(hostname)) {
            currentNode = NODES[i];
            break;
        }
    }
    if (!currentNode) {
        // Fallback default if custom domain or unknown
        currentNode = NODES[0];
    }

    // 4. Parse Chain from URL or SessionStorage
    var urlParams = new URLSearchParams(window.location.search || '');
    var urlChainParam = urlParams.get('fb_chain') || '';
    var sessionChainParam = '';
    try {
        sessionChainParam = sessionStorage.getItem(STORAGE_KEY_CHAIN) || '';
    } catch (_) {}

    var rawChain = (urlChainParam + ',' + sessionChainParam).split(',');
    var visitedNodes = [];
    for (var j = 0; j < rawChain.length; j++) {
        var trimmed = rawChain[j].trim();
        if (trimmed && visitedNodes.indexOf(trimmed) === -1) {
            visitedNodes.push(trimmed);
        }
    }

    // 5. Anti-Loop Circuit Breaker: If all 3 nodes were already visited
    if (visitedNodes.length >= NODES.length && visitedNodes.indexOf('circuit_breaker') !== -1) {
        console.warn('[OmniEdgeBalancer] CIRCUIT BREAKER ACTIVE: All 3 cloud nodes visited. Redirection halted to prevent loops.');
        showDegradedBanner('ALL MULTI-CLOUD EDGES AT CAPACITY // STANDALONE CACHED MODE ACTIVE');
        return;
    }

    // 6. Function: Failover to Next Available Node
    function failoverToNextNode(reason) {
        if (visitedNodes.indexOf(currentNode.id) === -1) {
            visitedNodes.push(currentNode.id);
        }

        // Find candidate not yet visited
        var candidate = null;
        for (var k = 0; k < NODES.length; k++) {
            if (visitedNodes.indexOf(NODES[k].id) === -1) {
                candidate = NODES[k];
                break;
            }
        }

        if (!candidate) {
            // All nodes exhausted! Engage Circuit Breaker (NO REDIRECT!)
            visitedNodes.push('circuit_breaker');
            try {
                sessionStorage.setItem(STORAGE_KEY_CHAIN, visitedNodes.join(','));
            } catch (_) {}
            console.warn('[OmniEdgeBalancer] All failover candidates exhausted (' + reason + '). Circuit breaker engaged.');
            showDegradedBanner('MULTI-CLOUD QUOTA EXHAUSTED (' + reason + ') // RUNNING IN LOCAL OFFLINE MODE');
            return;
        }

        // Record failover chain in session
        try {
            sessionStorage.setItem(STORAGE_KEY_CHAIN, visitedNodes.join(','));
            var degradedMap = JSON.parse(sessionStorage.getItem(STORAGE_KEY_DEGRADED) || '{}');
            degradedMap[currentNode.id] = Date.now() + TTL_MS;
            sessionStorage.setItem(STORAGE_KEY_DEGRADED, JSON.stringify(degradedMap));
        } catch (_) {}

        // Construct destination URL preserving path, search and hash
        var targetUrl = new URL(candidate.origin + window.location.pathname);
        urlParams.set('fb_chain', visitedNodes.join(','));
        urlParams.set('fb_from', currentNode.id);
        urlParams.set('fb_ts', Date.now().toString());
        targetUrl.search = urlParams.toString();
        targetUrl.hash = window.location.hash || '';

        console.warn('[OmniEdgeBalancer] Quota/health trigger on [' + currentNode.name + ']: ' + reason + ' -> Redirecting to [' + candidate.name + ']');
        window.location.replace(targetUrl.toString());
    }

    // 7. Check if Current Node was recently marked degraded
    try {
        var degradedMap = JSON.parse(sessionStorage.getItem(STORAGE_KEY_DEGRADED) || '{}');
        if (degradedMap[currentNode.id] && degradedMap[currentNode.id] > Date.now()) {
            failoverToNextNode('Known Cached Degradation TTL');
            return;
        }
    } catch (_) {}

    // 8. Manual Simulation / Testing Hooks
    if (urlParams.get('test_quota') === '1' || urlParams.get('simulate_failover') === currentNode.id) {
        failoverToNextNode('Simulated Quota Trigger (?test_quota=1)');
        return;
    }

    // 9. Lightweight Early Health & Quota Probe
    // Fires instantly before DOM parsing; aborts after 1400ms
    var probeController = new AbortController();
    var probeTimeout = setTimeout(function () {
        probeController.abort();
    }, 1400);

    fetch('/api/health?_probe=1', {
        method: 'GET',
        cache: 'no-store',
        signal: probeController.signal
    }).then(function (res) {
        clearTimeout(probeTimeout);
        if (res.status === 429 || res.status === 503 || res.status === 1027 || res.status === 1015) {
            failoverToNextNode('HTTP ' + res.status + ' (Rate Limit / Quota Exceeded)');
            return;
        }
        // Healthy response! Clean up URL parameters if landed after failover
        if (urlParams.has('fb_chain')) {
            urlParams.delete('fb_chain');
            urlParams.delete('fb_from');
            urlParams.delete('fb_ts');
            var cleanUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, cleanUrl);
            }
        }
        // Expose telemetry
        console.log('[OmniEdgeBalancer] Active node [' + currentNode.name + '] Healthy (200 OK).');
    }).catch(function (err) {
        clearTimeout(probeTimeout);
        if (err && err.name === 'AbortError') {
            console.warn('[OmniEdgeBalancer] Health probe timeout (1400ms). Node may be congested, continuing with local execution.');
        }
    });

    // 10. Degraded HUD Banner Helper
    function showDegradedBanner(text) {
        document.addEventListener('DOMContentLoaded', function () {
            var banner = document.createElement('div');
            banner.id = 'omni-edge-balancer-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:linear-gradient(90deg, #991b1b, #7f1d1d);color:#fff;padding:4px 10px;font-family:monospace;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ef4444;box-shadow:0 0 14px rgba(239,68,68,0.7);';
            banner.innerHTML = '<span>⚡ [MULTI-CLOUD RESILIENCE] ' + text + '</span><button onclick="this.parentElement.remove()" style="background:#450a0a;border:1px solid #ef4444;color:#fca5a5;padding:1px 6px;cursor:pointer;font-family:monospace;font-size:10px;border-radius:2px;">✕ SCHLIESSEN</button>';
            document.body.appendChild(banner);
        });
    }

    // 11. Expose Global Controller
    window.OmniEdgeBalancer = {
        currentNode: currentNode,
        visitedNodes: visitedNodes,
        nodes: NODES,
        triggerFailover: failoverToNextNode,
        resetChain: function () {
            try {
                sessionStorage.removeItem(STORAGE_KEY_CHAIN);
                sessionStorage.removeItem(STORAGE_KEY_DEGRADED);
            } catch (_) {}
            console.log('[OmniEdgeBalancer] Failover chain and degradation TTL cleared.');
        }
    };

})();
