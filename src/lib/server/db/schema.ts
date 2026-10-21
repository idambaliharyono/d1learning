import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';
export * from './auth.schema.ts';
import { sql } from 'drizzle-orm';

const timestamp = {
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	deleted: integer('deleted', { mode: 'timestamp_ms' })
};
// --------------------------------------------------------------------------------------------------------------------------
export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

// --------------------------------------------------------------------------------------------------------------------------
export const gym = sqliteTable('gym', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	location: text('location').notNull(),
	name: text('name').notNull(),
	...timestamp
});
export type Gym = typeof gym.$inferSelect;
export type NewGym = typeof gym.$inferInsert;

// --------------------------------------------------------------------------------------------------------------------------
export const coach = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	role: text('role').notNull(),
	gymId: text('gymId').references(() => gym.id),
	...timestamp
});
export type User = typeof coach.$inferSelect;
export type newUser = typeof coach.$inferInsert;

// --------------------------------------------------------------------------------------------------------------------------
export const customer = sqliteTable('customer', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	coachId: text('coachId').references(() => coach.id),
	...timestamp
});
export type Customer = typeof customer.$inferSelect;
export type newCustomer = typeof customer.$inferInsert;

// --------------------------------------------------------------------------------------------------------------------------
