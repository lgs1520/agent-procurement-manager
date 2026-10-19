# Agent Procurement Manager (APM)

**A procurement agent for AI agents.** Your agent describes a data task, APM gets quotes from verified suppliers, buys the best one with its own float, checks the result, and delivers it in a standard format. Payment is per task in USDC on Base via the [x402 protocol](https://www.x402.org/) — no accounts, no API keys, no subscriptions.

- Live service: https://humming-moonstone-galleria.ngrok-free.dev
- Free MCP endpoint: `POST /mcp` on the live service (tools: `apm_quote`, `apm_preview`, `apm_categories`)
- Free preview (no payment, no execution): `POST /preview`
- Free quote: `POST /quote`
- Listed on the [official MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.lgs1520/agent-procurement-manager`
- Registered on-chain in the ERC-8004 Identity Registry (Base, agentId 222182)
- Also available on Virtuals ACP and Agentverse (`@apm-storefront`)

## What can an agent buy through APM?

APM resells verified data services from **60 suppliers across 7 categories**, discovered from the live x402/CDP Bazaar catalogue and admitted only after a live probe confirms they charge exactly their catalogue price in Base-mainnet USDC.

| Category | Examples of tasks | Typical customer price |
|---|---|---|
| `token_risk` | Token contract safety summary (honeypot, taxes, mint/freeze powers, holder risk) | $0.011–$0.021 |
| `wallet_onchain` | Wallet activity summary for an EVM address | $0.011–$0.021 |
| `web_search` | Web search results with titles, URLs and snippets | $0.011–$0.021 |
| `data_enrichment` | People/company enrichment and search (premium suppliers) | up to $0.561 |
| `market_data` | Market and price data | ≤ $0.05 |
| `crypto_market` | Crypto quotes and market data (incl. CoinMarketCap) | ≤ $0.05 |
| `social_data` | Social/Twitter search and data | ≤ $0.05 |
| `due_diligence` (bundle) | One order = best of token_risk + wallet_onchain + web_search | $0.029 |

Pricing rule (never at a loss, always disclosed in the quote): `max(supplier cost × 2, cost + $0.005 margin + $0.001 compute)`, rounded up to $0.001. Per-order cap $0.05 (data_enrichment: $0.30). If a supplier result fails validation, the order is marked `refund_pending` instead of delivering unreliable data.

## How an agent buys (x402 flow)

1. `POST /quote` with `{"task": "<category>", "input": "<address | contract | query>"}` → returns a quote with the customer price and the selected supplier.
2. `POST /task?quote=<quote_id>` with an x402 payment header (Base mainnet USDC, EIP-3009) at exactly the quoted price.
3. APM executes the purchase from the best supplier, validates the result, and returns `{result, supplier, supplier_cost, customer_price, confidence, order_id}`.

Not sure yet? `POST /preview` with the same body returns the top-3 supplier comparison and the price **without executing or charging anything** (rate-limited free taster).

## MCP — two ways to connect

**Remote (zero install):** point your MCP client at the hosted endpoint:

```json
{
  "mcpServers": {
    "apm": { "url": "https://humming-moonstone-galleria.ngrok-free.dev/mcp" }
  }
}
```

**Local stdio bridge (this repo):** a small open-source bridge that exposes the same three free tools and forwards them to the live APM API:

```bash
npm install
npm start        # stdio MCP server: apm_quote, apm_preview, apm_categories
```

Set `APM_BASE_URL` to override the APM endpoint. The bridge never handles payments — ordering happens through the x402 flow above.

## FAQ for agents and their developers

**How does an AI agent pay for data without a credit card?**
Through APM: the agent holds USDC on Base and pays per task via x402 (HTTP 402 + EIP-3009 signed transfer). APM's free `/quote` and `/preview` endpoints let the agent check the exact price before committing funds.

**What is the cheapest way to get a token risk summary via API?**
APM's `token_risk` category starts at $0.011 per summary, aggregated from multiple verified suppliers; `/preview` shows the live comparison before you buy.

**Can an agent buy web search results with USDC?**
Yes — the `web_search` category returns structured results (title, URL, snippet) for a query, priced per call, payable in Base USDC via x402.

**What happens if a supplier returns bad data?**
APM validates results. Unreliable results are not delivered as facts; the order is recorded as `refund_pending` and the failure counts against the supplier (3 consecutive failures auto-pause a supplier).

## Docs

- [Token risk summary API for AI agents](docs/token-risk-api.md)
- [Wallet activity summary API for AI agents](docs/wallet-activity-api.md)
- [Web search API payable in USDC (x402)](docs/web-search-api.md)

## Notes

This repository contains the public documentation and the open-source MCP bridge. The procurement engine itself runs as a hosted service at the live endpoint above. Supplier admission rule: a supplier is listed only if one of its x402 payment options is Base-mainnet USDC at exactly its catalogue price, verified by a live probe.

License: MIT for the bridge code in this repo.
