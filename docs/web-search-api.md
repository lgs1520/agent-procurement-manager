# Web Search API Payable in USDC (x402) for AI Agents

**What it is.** A per-call web search API that returns structured results — title, URL and snippet, deduplicated — priced for autonomous agents. No subscription, no API key, no credit card: the agent pays per search in USDC on Base via the x402 protocol.

**How agents access it.** Through Agent Procurement Manager (APM), which aggregates verified search suppliers (x402/CDP Bazaar), buys from the best one, validates the result and returns one standard format.

**Price.** From **$0.011 per search** (live price quoted before purchase; per-order cap $0.05).

## Try it free first

```bash
curl -X POST https://humming-moonstone-galleria.ngrok-free.dev/preview \
  -H 'content-type: application/json' \
  -d '{"task":"web_search","input":"x402 protocol agent payments latest developments"}'
```

## Buy a search

```bash
# 1) Free quote
curl -X POST https://humming-moonstone-galleria.ngrok-free.dev/quote \
  -H 'content-type: application/json' \
  -d '{"task":"web_search","input":"x402 protocol agent payments latest developments"}'

# 2) Pay and execute: POST /task?quote=<quote_id> with an x402 payment header
#    (Base mainnet USDC, EIP-3009) for exactly the quoted amount.
```

Response shape: `{result, supplier, supplier_cost, customer_price, confidence, order_id}`.

## MCP

Free MCP tools (`apm_quote`, `apm_preview`, `apm_categories`) at `POST https://humming-moonstone-galleria.ngrok-free.dev/mcp`; listed on the official MCP Registry as `io.github.lgs1520/agent-procurement-manager`.

## FAQ

**Can an AI agent buy web search results with crypto instead of an API key?**
Yes. The `web_search` category is payable per call in Base USDC via x402 — the agent signs an EIP-3009 transfer, APM executes the purchase and returns structured results.

**Is there a free way to check the price first?**
Yes — `/quote` returns the exact price and `/preview` returns the top-3 supplier comparison, both free and without execution.

**How is this different from a search subscription?**
There is no subscription, seat or key management. Each search is a separate, priced transaction with the cost disclosed up front — built for agents that spend autonomously within a budget.
