import {useState, useCallback, useEffect} from "react";
import {useFetcher} from "@remix-run/react";
import { Dialog } from '@headlessui/react'

export const CreateNote = () => {
  const fetcher = useFetcher();
  const [isCreating, setIsCreating] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const createNote = useCallback(() => {
    const res = fetcher.submit({
      title: postTitle,
      content: postContent,
    }, {
      method: 'POST',
      encType: 'application/json',
    });

  }, [fetcher, postTitle, postContent, setPostTitle, setPostContent]);

  useEffect(() => {
    if(fetcher.state === 'idle' && isCreating) {
      setIsCreating(false);
    }
  }, [fetcher.state])

  return (
    <div className='p-2'>
      <button
        className='p-2 bg-teal-500 text-white rounded cursor-pointer'
        onClick={() => setIsCreating(true)}>
        New Note
      </button>
      <Dialog open={isCreating} onClose={() => setIsCreating(false)} className='relative z-10 p-2'>
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
                onClick={() => setIsCreating(false)}>
                Cancel
              </button>
              <button
                disabled={fetcher.state !== 'idle'}
                className='bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-300 cursor-pointer disabled:bg-teal-300 disabled:cursor-not-allowed'
                onClick={createNote}>
                Create
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}