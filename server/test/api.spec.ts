import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import http from "http";
import express from "express";
import { registerRoutes } from "../routes";

describe("API happy path", () => {
  beforeAll(() => {
    process.env.USE_DB = "false"; // Ensure in-memory storage during tests
  });
  it("POST /api/leads then GET /api/leads", async () => {
    const app = express();
    app.use(express.json());
    const server = await registerRoutes(app);
    const agent = request(http.createServer(app));

    const leadBody = {
      name: "Alice",
      company: "ACME",
      industry: "SaaS",
      email: "alice@example.com"
    };

    const postRes = await agent.post("/api/leads").send(leadBody);
    expect(postRes.status).toBe(200);
    expect(postRes.body.success).toBe(true);

    const getRes = await agent.get("/api/leads");
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(Array.isArray(getRes.body.data)).toBe(true);

    server.close();
  });
});


