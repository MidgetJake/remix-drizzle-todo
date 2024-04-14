import {authenticator, type ReturnUser} from "~/services/auth.server";
import {db} from "~/drizzle/config.server";
import {posts} from "~/drizzle/schema.server";
import {and, eq} from "drizzle-orm";
import {redirect} from "@remix-run/node";

export const deletePost = async (request: Request, id: string) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  }) as ReturnUser;

  const parsedId = parseInt(id, 10);
  if(isNaN(parsedId)) {
    return null;
  }

  const res = await db.delete(posts).where(
    and(eq(posts.id, parsedId), eq(posts.authorId, session.id))
  ).returning({
    id: posts.id,
  });

  if(res.length === 0) {
    return null
  }

  const currentURL = request.url.split('/');
  const selectedPost = parseInt(currentURL[currentURL.length - 1], 10);

  if(!isNaN(selectedPost)) {
    if(parsedId === selectedPost) {
      return redirect('/home');
    }
  }

  return true;
};

export const updatePost = async (request: Request, id: string) => {
  const formData = await request.json();
  const title = formData.title as string;
  const content = formData.content as string;

  if(!title || ! content) {
    return 'Missing title or content';
  }

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  }) as ReturnUser;

  const parsedId = parseInt(id, 10);
  if(isNaN(parsedId)) {
    return null;
  }

  const res = await db.update(posts).set({
    title,
    text: content,
  }).where(and(eq(posts.id, parsedId), eq(posts.authorId, session.id))).returning();

  return res[0];
}
