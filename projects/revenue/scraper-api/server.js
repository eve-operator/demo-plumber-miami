const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.SCRAPER_PORT || 7890;
const API_KEY = process.env.SCRAPER_API_KEY || 'demo-key';

// Rate limiting
const requests = new Map();
const RATE_LIMIT = { free: 10, basic: 500, pro: 5000 };
const RATE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

function checkRateLimit(key, tier = 'free') {
  const now = Date.now();
  if (!requests.has(key)) requests.set(key, []);
  const reqs = requests.get(key).filter(t => now - t < RATE_WINDOW);
  requests.set(key, reqs);
  return reqs.length < RATE_LIMIT[tier];
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { 
      timeout: 15000,
      rejectUnauthorized: false,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; EveScraper/1.0)',
        'Accept': 'text/html,application/xhtml+xml,*/*'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function extractData(html, selector) {
  // Simple regex-based extraction (no cheerio dependency)
  const results = [];
  
  if (selector.startsWith('title')) {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
    if (match) results.push(match[1].trim());
  } else if (selector.startsWith('meta')) {
    const matches = html.matchAll(/<meta[^>]*(?:name|property)=["']([^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi);
    for (const m of matches) results.push({ name: m[1], content: m[2] });
  } else if (selector === 'links') {
    const matches = html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi);
    for (const m of matches) results.push({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() });
  } else if (selector === 'text') {
    const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                     .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                     .replace(/<[^>]+>/g, ' ')
                     .replace(/\s+/g, ' ').trim();
    results.push(text.substring(0, 5000));
  } else if (selector === 'headings') {
    const matches = html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi);
    for (const m of matches) results.push({ level: parseInt(m[1]), text: m[2].replace(/<[^>]+>/g, '').trim() });
  } else {
    // Generic tag extraction
    const regex = new RegExp(`<${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>(.*?)</${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}>`, 'gi');
    const matches = html.matchAll(regex);
    for (const m of matches) results.push(m[1].replace(/<[^>]+>/g, '').trim());
  }
  return results;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // Health check
  if (url.pathname === '/health') {
    res.end(JSON.stringify({ status: 'ok', version: '1.0.0' }));
    return;
  }
  
  // Pricing
  if (url.pathname === '/pricing') {
    res.end(JSON.stringify({
      plans: [
        { name: 'Free', requests_per_day: 10, price: '$0/mo' },
        { name: 'Basic', requests_per_day: 500, price: '$10/mo' },
        { name: 'Pro', requests_per_day: 5000, price: '$30/mo' }
      ]
    }));
    return;
  }
  
  // API endpoint
  if (url.pathname === '/scrape') {
    const targetUrl = url.searchParams.get('url');
    const selector = url.searchParams.get('selector') || 'text';
    const apiKey = url.searchParams.get('key') || req.headers['x-api-key'];
    
    if (!targetUrl) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Missing url parameter' }));
      return;
    }
    
    if (!apiKey) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Missing API key (?key=xxx or X-Api-Key header)' }));
      return;
    }
    
    if (!checkRateLimit(apiKey)) {
      res.writeHead(429);
      res.end(JSON.stringify({ error: 'Rate limit exceeded' }));
      return;
    }
    
    try {
      requests.get(apiKey).push(Date.now());
      const page = await fetchPage(targetUrl);
      const data = extractData(page.body, selector);
      res.end(JSON.stringify({
        url: targetUrl,
        selector,
        status: page.status,
        results: data,
        count: data.length
      }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }
  
  // Landing page
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html>
<html><head><title>Eve Scraper API</title>
<style>body{font-family:system-ui;max-width:600px;margin:50px auto;padding:20px}
code{background:#f4f4f4;padding:2px 6px;border-radius:3px}
pre{background:#f4f4f4;padding:15px;border-radius:8px;overflow-x:auto}
.price{display:flex;gap:20px;margin:20px 0}
.plan{border:1px solid #ddd;padding:20px;border-radius:8px;flex:1;text-align:center}
.plan h3{margin-top:0}</style></head>
<body>
<h1>🧭 Eve Scraper API</h1>
<p>Simple web scraping API. Send a URL, get structured data back.</p>
<h2>Usage</h2>
<pre>GET /scrape?url=https://example.com&selector=text&key=YOUR_KEY</pre>
<h3>Selectors</h3>
<ul>
<li><code>text</code> — Clean page text</li>
<li><code>title</code> — Page title</li>
<li><code>meta</code> — Meta tags</li>
<li><code>links</code> — All links with text</li>
<li><code>headings</code> — H1-H6 headings</li>
<li><code>p</code>, <code>div</code>, <code>span</code> — Tag content</li>
</ul>
<h2>Pricing</h2>
<div class="price">
<div class="plan"><h3>Free</h3><p>10 req/day</p><p><strong>$0</strong></p></div>
<div class="plan"><h3>Basic</h3><p>500 req/day</p><p><strong>$10/mo</strong></p></div>
<div class="plan"><h3>Pro</h3><p>5,000 req/day</p><p><strong>$30/mo</strong></p></div>
</div>
<p>Get your API key: message <a href="https://t.me/json_kiss">@json_kiss</a></p>
</body></html>`);
});

server.listen(PORT, () => {
  console.log(`Eve Scraper API running on port ${PORT}`);
});
