import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './shared.ts';
import { user } from '../auth.schema.ts';
export const client = sqliteTable('customer', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    ...timestamps
});
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
