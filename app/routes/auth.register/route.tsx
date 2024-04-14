import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import { json } from '@remix-run/node';
import {authenticator, EMAIL_STRATEGY, registerUser} from "~/services/auth.server";
import {Form, useLoaderData} from "@remix-run/react";
import {Input} from "~/components/Input";

export const loader: LoaderFunction = () => {
  const defaultValues = {
    email: "",
    password: "",
  };
  return json({ defaultValues });
};

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if(!email || !password) {
    return 'Missing email or password';
  }

  try {
    const register = await registerUser(email, password);

    if (register) {
      return await authenticator.authenticate(EMAIL_STRATEGY, request, {
        successRedirect: '/home',
        context: {
          email,
        }
      })
    }
  } catch (e: any) {
    return e.message;
  }
}

const SignupPage = () => {
  const {defaultValues} = useLoaderData<typeof loader>();

  return (
    <div className='w-screen min-h-screen bg-slate-900 flex items-center justify-center'>
      <div className='p-3 bg-slate-800 border-slate-500 flex flex-col min-w-[300px]'>
        <Form className='flex flex-col gap-3' method='post'>
          <Input name='email' type='text' label='Email'/>
          <Input name='password' type='password' label='Password'/>
          <button className='p-2 bg-cyan-600 text-white rounded cursor-pointer hover:bg-cyan-500' type='submit'>
            Sign Up
          </button>
        </Form>
      </div>
    </div>
  )
}

export default SignupPage;