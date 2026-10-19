#!/usr/bin/env node
/**
 * apm-mcp-bridge — local stdio MCP server for Agent Procurement Manager (APM).
 *
 * Exposes APM's three free tools and forwards them to the live APM API:
 *   apm_quote      POST /quote      {task, input} -> price quote, no charge
 *   apm_preview    POST /preview    {task, input} -> top-3 supplier comparison, no execution
 *   apm_categories GET  /suppliers  -> categories and suppliers currently listed
 *
 * The bridge never handles payments. Ordering is done by the agent itself
 * through APM's x402 flow (POST /task?quote=<id> with an x402 payment header).
 *
 * Env: APM_BASE_URL (default https://humming-moonstone-galleria.ngrok-free.dev)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE = (process.env.APM_BASE_URL || "https://humming-moonstone-galleria.ngrok-free.dev").replace(/\/$/, "");

async function callApi(path, { method = "GET", body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 2000) }; }
  if (!res.ok) throw new Error(`APM API ${path} returned ${res.status}: ${text.slice(0, 300)}`);
  return data;
}

const asText = (data) => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });

const server = new McpServer({ name: "apm-mcp-bridge", version: "1.0.0" });

server.tool(
  "apm_quote",
  "Get a free price quote from Agent Procurement Manager for a data task (categories: token_risk, wallet_onchain, web_search, data_enrichment, market_data, crypto_market, social_data, due_diligence). No charge, no execution.",
  { task: z.string().describe("Task category, e.g. token_risk"), input: z.string().describe("Contract address, wallet address, or search query") },
  async ({ task, input }) => asText(await callApi("/quote", { method: "POST", body: { task, input } }))
);

server.tool(
  "apm_preview",
  "Free taster: compare the top-3 suppliers APM would buy from for a task, with the customer price. No execution, no payment.",
  { task: z.string().describe("Task category, e.g. web_search"), input: z.string().describe("Contract address, wallet address, or search query") },
  async ({ task, input }) => asText(await callApi("/preview", { method: "POST", body: { task, input } }))
);

server.tool(
  "apm_categories",
  "List the categories and verified suppliers currently available through Agent Procurement Manager.",
  {},
  async () => asText(await callApi("/suppliers"))
);

await server.connect(new StdioServerTransport());
console.error(`apm-mcp-bridge connected to ${BASE}`);
