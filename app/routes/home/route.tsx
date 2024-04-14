import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {Outlet, useFetcher, useLoaderData, useNavigate, useNavigation} from "@remix-run/react";
import {CreateNote} from "~/routes/home/CreateNote";
import {db} from "~/drizzle/config.server";
import {posts} from "~/drizzle/schema.server";
import type {ReturnUser} from "~/services/auth.server";

import {createPost} from "~/routes/home/routeActions";
import {useCallback, type MouseEvent as RMouseEvent} from "react";


export const loader: LoaderFunction = async ({ request }) => {
  const loggedIn = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  }) as ReturnUser;

  if(loggedIn) {
    return await db.query.users.findFirst({
      where: (users, {eq}) => eq(users.id, loggedIn.id),
      columns: {
        password: false,
      },
      with: {
        posts: {
          columns: {
            authorId: false,
          }
        }
      }
    });
  }

  return null;
};

export const action: ActionFunction = async ({request}) => {
  switch(request.method) {
    case 'POST':
      return await createPost(request);
  }
}

export default function Home({children}: any) {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const fetcher = useFetcher();

  const deletePost = useCallback((id: number, e: RMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    fetcher.submit({}, {
      method: 'DELETE', action: `${id}`, navigate: false,
    })
  } ,[fetcher])

  return (
    <div className='w-screen min-h-screen flex flex-row bg-slate-900 p-2 gap-2'>
      <div className='flex flex-col bg-slate-800 rounded border-slate-500 w-[300px] items-end'>
        <CreateNote />
        <div className='flex flex-col gap-2 px-2 w-full overflow-hidden'>
          {loaderData.posts.map((post: typeof posts.$inferSelect) => (
            <div onClick={() => navigate(`/home/${post.id}`)} key={`post_${post.id}`} className='flex flex-col p-2 cursor-pointer hover:bg-slate-700 rounded-lg items-end'>
              <h4 className='text-slate-50 text-lg w-full truncate'>{post.title}</h4>
              <span className='text-slate-500 text-sm text-nowrap truncate w-full'>{post.text}</span>
              <button onClick={(e) => deletePost(post.id, e)} className=' p-1 mt-2 rounded bg-red-500/50 text-slate-300 text-sm hover:bg-red-500/30 cursor-pointer'>
                delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className='flex-1 bg-slate-800 border-slate-500 p-2 rounded'>
        {navigation.state === 'loading' ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 max-w-96 space-y-6 py-1">
              <div className="h-6 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        ) : <Outlet/>}
      </div>
    </div>
  )
}