import type {ActionFunction} from "@remix-run/node";
import {authenticator, EMAIL_STRATEGY} from "~/services/auth.server";
import {Form} from "@remix-run/react";
import {Input} from "~/components/Input";

export const action: ActionFunction = async ({request}) => {
  return await authenticator.authenticate(EMAIL_STRATEGY, request, {
    successRedirect: '/home',
    context: {}
  })
}

export default function LoginPage() {
  return (
    <div className='w-screen min-h-screen bg-slate-900 flex items-center justify-center'>
      <div className='p-3 bg-slate-800 border-slate-500 flex flex-col min-w-[300px]'>
        <Form className='flex flex-col gap-3' method='post'>
          <Input name='email' type='text' label='Email'/>
          <Input name='password' type='password' label='Password'/>
          <button className='p-2 bg-cyan-600 text-white rounded cursor-pointer hover:bg-cyan-500' type='submit'>
            Sign In
          </button>
        </Form>
      </div>
    </div>
  )
}
