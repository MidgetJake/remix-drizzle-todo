import {authenticator, type ReturnUser} from "~/services/auth.server";
import {db} from "~/drizzle/config.server";
import {posts} from "~/drizzle/schema.server";

type NewPost = typeof posts.$inferInsert;

export const createPost = async (request: Request) => {
  const formData = await request.json();
  const title = formData.title as string;
  const content = formData.content as string;

  if(!title || ! content) {
    return 'Missing title or content';
  }

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  }) as ReturnUser;

  const newPost: NewPost = {
    text: content,
    title,
    authorId: session.id,
  }

  const res = await db.insert(posts).values(newPost).returning();

  if(res.length > 0) {
    return res[0];
  }

  return false;
}
