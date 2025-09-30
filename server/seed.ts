import { db, ensureDbConnected, pool } from "./db/client";
import * as schema from "@shared/schema";

async function main() {
  await ensureDbConnected();

  // Use same demo identity as server/routes.ts ensureDemoUser()
  const demoEmail = "demo@aidevelo.ai";

  // Find or create demo user
  const { eq, desc } = await import("drizzle-orm");
  let user = (await db.select().from(schema.users).where(eq(schema.users.email, demoEmail)).limit(1))[0];
  if (!user) {
    user = (await db.insert(schema.users).values({
      username: "demo",
      password: "demo",
      email: demoEmail,
      firstName: "Demo",
      lastName: "User",
      company: "AIDevelo.AI"
    }).returning())[0];
  }

  // Ensure one chat subscription exists for demo
  const existingSubs = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.userId, user.id));
  if (!existingSubs.find((s) => s.moduleId === "chat")) {
    await db.insert(schema.subscriptions).values({
      userId: user.id,
      moduleId: "chat",
      price: 4900,
      status: "active"
    });
  }

  // Ensure one chat agent config exists for demo
  const existingConfigs = await db
    .select()
    .from(schema.agentConfigs)
    .where(eq(schema.agentConfigs.userId, user.id));
  let chatConfig = existingConfigs.find((c) => c.moduleId === "chat");
  if (!chatConfig) {
    chatConfig = (await db.insert(schema.agentConfigs).values({
      userId: user.id,
      moduleId: "chat",
      isActive: true,
      configuration: { name: "Seed Chat Agent", model: "gpt-4" },
      knowledgeBase: { companyInfo: "AIDevelo.AI", services: ["AI Chat"], faq: [], businessHours: "Mon-Fri" }
    }).returning())[0];
  }

  // Optionally create one demo session if none exists
  const existingSessions = await db
    .select()
    .from(schema.chatSessions)
    .where(eq(schema.chatSessions.agentConfigId, chatConfig.id));
  if (existingSessions.length === 0) {
    await db.insert(schema.chatSessions).values({
      agentConfigId: chatConfig.id,
      visitorId: "seed-visitor"
    });
  }

  console.log("Seed completed:", { user: user.email, chatConfig: chatConfig.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    try { await pool.end(); } catch {}
  });


