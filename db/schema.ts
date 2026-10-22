import { sql } from 'drizzle-orm';
import { check, index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const enquiries = sqliteTable('enquiries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  topic: text('topic').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  organization: text('organization').notNull().default(''),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
  consentAt: text('consent_at').notNull(),
}, table => [
  index('enquiries_user_created_idx').on(table.userId, table.createdAt),
  check('enquiries_topic_check', sql`${table.topic} IN ('pilot', 'deployment', 'support', 'contribution')`),
  check('enquiries_name_length', sql`length(${table.name}) BETWEEN 1 AND 100`),
  check('enquiries_email_length', sql`length(${table.email}) BETWEEN 3 AND 254`),
  check('enquiries_organization_length', sql`length(${table.organization}) <= 160`),
  check('enquiries_message_length', sql`length(${table.message}) BETWEEN 20 AND 4000`),
]);

// Separate counters keep enquiry deletion from resetting the hourly limit.
export const contactRate = sqliteTable('contact_rate', {
  userId: text('user_id').primaryKey(),
  windowStart: integer('window_start').notNull(),
  count: integer('count').notNull(),
}, table => [
  check('contact_rate_count_check', sql`${table.count} BETWEEN 1 AND 3`),
]);

export const ctaDaily = sqliteTable('cta_daily', {
  day: text('day').notNull(),
  event: text('event').notNull(),
  count: integer('count').notNull().default(1),
}, table => [
  primaryKey({ columns: [table.day, table.event] }),
  check('cta_daily_event_check', sql`${table.event} IN ('hero_get_started', 'hero_showcase', 'pilot_open', 'review_download', 'github', 'contact_saved')`),
  check('cta_daily_count_check', sql`${table.count} > 0`),
]);
