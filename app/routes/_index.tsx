import {LoaderFunction, MetaFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {useNavigate} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
    successRedirect: '/home',
  });

  return null;
}

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className='w-screen h-screen flex items-center justify-center p-4 bg-slate-900'>
      <div className='bg-slate-700 rounded-lg flex flex-col gap-2 p-2'>
        <button onClick={() => navigate(`/auth/login`)} className='bg-slate-600 text-slate-50 p-2 rounded-lg hover:bg-slate-400 cursor-pointer'>Login</button>
        <button onClick={() => navigate(`/auth/register`)} className='bg-slate-600 text-slate-50 p-2 rounded-lg hover:bg-slate-400 cursor-pointer'>Sign up</button>
      </div>
    </div>
  );
}
