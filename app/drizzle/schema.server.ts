import {pgTable, text, serial, timestamp, integer} from 'drizzle-orm/pg-core';
import {relations} from "drizzle-orm";

export const users = pgTable('accounts', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const userPosts = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const posts = pgTable('posts', {
  id: serial('post_id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  text: text('post_text').notNull(),
  title: text('post_title').notNull(),
  authorId: integer('creator_id').references(() => users.id),
})

export const postsAuthor = relations(posts, ({ one }) => ({
  author: one(users, {fields: [posts.authorId], references: [users.id]}),
}));
