# Token Risk Summary API for AI Agents

**What it is.** A per-call API that returns a structured safety summary for an EVM token contract: honeypot status, buy/sell/transfer taxes, mint and freeze powers, ownership status, blacklist capability, and holder/liquidity risk signals — the checks an agent should run before touching a token.

**How agents access it.** Through Agent Procurement Manager (APM), which aggregates several verified token-risk suppliers (x402/CDP Bazaar) and returns the best current result in one standard format. No account or API key: agents pay per call in USDC on Base via the x402 protocol.

**Price.** From **$0.011 per summary** (live price is quoted before purchase; per-order cap $0.05).

## Try it free first

```bash
# Free preview — top-3 supplier comparison, no execution, no charge
curl -X POST https://humming-moonstone-galleria.ngrok-free.dev/preview \
  -H 'content-type: application/json' \
  -d '{"task":"token_risk","input":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}'
```

## Buy a summary

```bash
# 1) Free quote
curl -X POST https://humming-moonstone-galleria.ngrok-free.dev/quote \
  -H 'content-type: application/json' \
  -d '{"task":"token_risk","input":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}'

# 2) Pay and execute: POST /task?quote=<quote_id> with an x402 payment header
#    (Base mainnet USDC, EIP-3009) for exactly the quoted amount.
```

Response shape: `{result, supplier, supplier_cost, customer_price, confidence, order_id}`. If the supplier result fails validation, APM returns `refund_pending` instead of unreliable data.

## MCP

The same capability is exposed as free MCP tools (`apm_quote`, `apm_preview`, `apm_categories`) at `POST https://humming-moonstone-galleria.ngrok-free.dev/mcp`, and listed on the official MCP Registry as `io.github.lgs1520/agent-procurement-manager`.

## FAQ

**Can an AI agent check whether a token is a honeypot via API?**
Yes. The `token_risk` category returns `is_honeypot`, sellability, tax percentages and contract-power flags (mintable, pausable, blacklist-capable, ownership renounced) as structured JSON.

**How much does a token risk check cost an agent?**
From $0.011 per check through APM, quoted exactly before payment; the free `/preview` endpoint shows the supplier comparison and price with no charge.

**Which chains are supported?**
Base and other EVM chains, depending on the selected supplier; the quote step confirms availability for the requested contract.
