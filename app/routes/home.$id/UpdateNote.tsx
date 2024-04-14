import {useState, useCallback, useEffect} from "react";
import {useFetcher} from "@remix-run/react";
import { Dialog } from '@headlessui/react'
import {posts} from "~/drizzle/schema.server";

type UpdatePostProps = {
  post: typeof posts.$inferSelect;
};

export const UpdateNote = ({post}: UpdatePostProps) => {
  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false);
  const [postTitle, setPostTitle] = useState(post.title);
  const [postContent, setPostContent] = useState(post.text);

  const updateNote = useCallback(() => {
    fetcher.submit({
      title: postTitle,
      content: postContent,
    }, {
      method: 'POST',
      encType: 'application/json',
    });
  }, [fetcher, postTitle, postContent, setPostTitle, setPostContent]);

  useEffect(() => {
    if(fetcher.state === 'idle' && isUpdating) {
      setIsUpdating(false);
    }
  }, [fetcher.state])

  return (
    <div className='p-2'>
      <button
        className='p-2 bg-teal-500 text-white rounded cursor-pointer'
        onClick={() => setIsUpdating(true)}>
        Edit Note
      </button>
      <Dialog open={isUpdating} onClose={() => setIsUpdating(false)} className='relative z-10 p-2'>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel
            className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all gap-4 flex flex-col'>
            <Dialog.Title>Create new note</Dialog.Title>
            <div className='flex flex-col gap-1'>
              <input disabled={fetcher.state !== 'idle'}
                     className='p-2 rounded border-slate-300 disabled:opacity-75 disabled:cursor-not-allowed'
                     placeholder='Post title' value={postTitle} onChange={e => setPostTitle(e.target.value)}/>
              <textarea disabled={fetcher.state !== 'idle'}
                        className='p-2 rounded border-slate-300 disabled:opacity-75 disabled:cursor-not-allowed'
                        placeholder='Insert your text...' value={postContent}
                        onChange={e => setPostContent(e.target.value)}/>
            </div>
            <div className='flex justify-between'>
              <button
                disabled={fetcher.state !== 'idle'}
                className='bg-red-400 text-white py-2 px-4 rounded hover:bg-red-300 cursor-pointer disabled:bg-red-300 disabled:cursor-not-allowed'
                onClick={() => setIsUpdating(false)}>
                Cancel
              </button>
              <button
                disabled={fetcher.state !== 'idle'}
                className='bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-300 cursor-pointer disabled:bg-teal-300 disabled:cursor-not-allowed'
                onClick={updateNote}>
                Update
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}