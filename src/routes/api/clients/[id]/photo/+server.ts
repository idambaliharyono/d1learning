import { getDb } from "#lib/server/db/index.ts";
import {env} from 'cloudflare:workers'
import type { RequestHandler } from "./$types";
import * as s from '#lib/server/db/schema.ts';
import { and, eq } from "drizzle-orm";

export const GET: RequestHandler = async({ params, locals}) {
  if(!locals.user) error(401, 'unauthorize');

const db = getDb(env.DB);
  const [clients] = await db
  .select({ photoKey: s.client.photoKey, photoDtype: s.client.photoDtype })
  .from(s.client)
  .where(and(eq(s.client.id, params.id), eq(s.client.userId, locals.user.id)))

  if (!clients?.photoKey) error(404, 'no photo');

}
