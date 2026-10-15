import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
	createdAt: text('createdAt')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	deletedAt: text('deletedAt'),
	modifiedAt: text('modifiedAt')
});
export type Gym = typeof gym.$inferSelect;
export type NewGym = typeof gym.$inferInsert;

// --------------------------------------------------------------------------------------------------------------------------
export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	role: text('role').notNull(),
	gymId: text('gymId').references(() => gym.id),
	createdAt: text('createdAt')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	deletedAt: text('deletedAt'),
	modifiedAt: text('modifiedAt')
});
export type User = typeof user.$inferSelect;
export type newUser = typeof user.$inferInsert;
