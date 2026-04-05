# 🧭 Eve Scraper API

Simple, fast web scraping API. Send a URL, get structured data back.

## Quick Start

```bash
# Get page title
curl "https://your-server:7890/scrape?url=https://example.com&selector=title&key=YOUR_KEY"

# Get clean text
curl "https://your-server:7890/scrape?url=https://example.com&selector=text&key=YOUR_KEY"

# Get all links
curl "https://your-server:7890/scrape?url=https://example.com&selector=links&key=YOUR_KEY"
```

## Selectors

| Selector | Output |
|----------|--------|
| `text` | Clean page text (scripts/styles removed) |
| `title` | Page title |
| `meta` | Meta tags (name + content) |
| `links` | All links with anchor text |
| `headings` | H1-H6 headings with levels |
| `p`, `div`, `span` | Content of specific HTML tags |

## Response Format

```json
{
  "url": "https://example.com",
  "selector": "title",
  "status": 200,
  "results": ["Example Domain"],
  "count": 1
}
```

## Pricing

| Plan | Requests/Day | Price |
|------|-------------|-------|
| Free | 10 | $0/mo |
| Basic | 500 | $10/mo |
| Pro | 5,000 | $30/mo |

## Self-Host

```bash
npm install
node server.js
# Runs on port 7890 by default
```

## API Key

Get your API key: message [@json_kiss](https://t.me/json_kiss) on Telegram.

## License

MIT
