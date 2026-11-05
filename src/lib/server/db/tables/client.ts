import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './shared.ts';
import { user } from '../auth.schema.ts';

export const client = sqliteTable('client', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	fullName: text('full_name'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	gender: text('gender', { enum: ['male', 'female'] }),
	birthDate: text('birth_date'),
	whatsapp: text('whatsapp'),
	photoKey: text('photo_key'),
	photoDtype: text('photo_dtype'),
	...timestamps
});
export type Client = typeof client.$inferSelect;
export type NewClient = typeof client.$inferInsert;

// -----------------------------------------------------------------------------------------
export const clientNote = sqliteTable('client_note', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	clientId: text('client_id')
		.notNull()
		.references(() => client.id),
	content: text('content'),
	...timestamps
});
