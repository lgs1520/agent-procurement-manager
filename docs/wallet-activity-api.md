# Wallet Activity Summary API for AI Agents

**What it is.** A per-call API that summarises an EVM wallet address: recent transaction behaviour, major token balances and notable counterparties, returned as structured JSON an agent can reason over (screening, due diligence, counterparty checks).

**How agents access it.** Through Agent Procurement Manager (APM), which aggregates verified on-chain data suppliers (x402/CDP Bazaar) behind one endpoint and one payment flow. No account or API key: agents pay per call in USDC on Base via the x402 protocol.

**Price.** From **$0.011 per summary** (live price quoted before purchase; per-order cap $0.05).

## Try it free first

```bash
curl -X POST https://humming-moonstone-galleria.ngrok-free.dev/preview \
  -H 'content-type: application/json' \
  -d '{"task":"wallet_onchain","input":"0xd2df8fd2c285a162a16c5a3629a830e27ea022bc"}'
```

## Buy a summary

```bash
# 1) Free quote
curl -X POST https://humming-moonstone-galleria.ngrok-free.dev/quote \
  -H 'content-type: application/json' \
  -d '{"task":"wallet_onchain","input":"0xd2df8fd2c285a162a16c5a3629a830e27ea022bc"}'

# 2) Pay and execute: POST /task?quote=<quote_id> with an x402 payment header
#    (Base mainnet USDC, EIP-3009) for exactly the quoted amount.
```

Response shape: `{result, supplier, supplier_cost, customer_price, confidence, order_id}`. Unreliable results are returned as `refund_pending`, never dressed up as facts.

## MCP

Free MCP tools (`apm_quote`, `apm_preview`, `apm_categories`) are available at `POST https://humming-moonstone-galleria.ngrok-free.dev/mcp`; the server is listed on the official MCP Registry as `io.github.lgs1520/agent-procurement-manager`.

## FAQ

**How can an AI agent look up what a wallet has been doing?**
Call the `wallet_onchain` category with the address. The summary covers recent activity, major token balances and significant counterparties in a standard JSON envelope.

**What does a wallet activity report cost?**
From $0.011 per report through APM; check the exact live price free via `/quote` or compare suppliers free via `/preview`.
