import db from "./db.js";

async function get(sid: string) {
  const session = await db.session.findUnique({ where: { sid } });

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.expires < new Date()) {
    throw new Error("Session has expired.");
  }

  return session;
}

async function create(sid: string, userId: string, expires: Date) {
  const session = await db.session.create({ data: { expires, sid, userId } });

  return session;
}

async function set(userId: string, sid: string, expires: Date) {
  const session = await db.session.upsert({
    create: { userId, sid, expires },
    update: { expires },
    where: { sid },
  });

  return session;
}

async function destroy(sid: string) {
  await db.session.delete({ where: { sid } });
}

export { get, create, set, destroy };
