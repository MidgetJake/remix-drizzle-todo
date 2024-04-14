import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {db} from '~/drizzle/config.server';
import {ShouldRevalidateFunction, useLoaderData} from "@remix-run/react";
import {authenticator, type ReturnUser} from "~/services/auth.server";
import {deletePost, updatePost} from "~/routes/home.$id/routeActions";
import {UpdateNote} from "~/routes/home.$id/UpdateNote";

export const loader: LoaderFunction = async (request) => {
  const id = parseInt(request.params.id as string, 10);
  if(isNaN(id)) {
    return null;
  }

  const session = await authenticator.isAuthenticated(request.request, {
    failureRedirect: "/auth/login",
  }) as ReturnUser;

  const data = await db.query.posts.findFirst({
    where: (posts, {eq, and}) => and(eq(posts.id, id), eq(posts.authorId, session.id)),
  });

  if(data) {
    return data;
  }

  return null;
}

export const action: ActionFunction = async ({request, params}) => {
  if(!params.id) {
    return null;
  }

  switch(request.method) {
    case 'DELETE':
      return await deletePost(request, params.id);
    case 'POST':
      return await updatePost(request, params.id);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
}) => {
  return actionResult !== null;
}

export default function TaskItem() {
  const loaderData = useLoaderData<typeof loader>();

  if(!loaderData) {
    return (
      <div className='text-white'>
        <h1>No Such Note</h1>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>
        <h1 className='text-3xl text-slate-50 mb-2 flex-1'>{loaderData.title}</h1>
        <UpdateNote post={loaderData} />
      </div>
      <p className='text-slate-200 whitespace-pre'>{loaderData.text}</p>
    </div>
  )
}