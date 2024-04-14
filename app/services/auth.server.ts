import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import {db} from "~/drizzle/config.server";
import { FormStrategy } from "remix-auth-form";
import { users } from "~/drizzle/schema.server";
import {hash, verify} from 'argon2';

export const EMAIL_STRATEGY = 'EMAIL_STRATEGY';
export let authenticator = new Authenticator(sessionStorage);

export type ReturnUser = {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  displayName: string | null;
  password?: string;
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email: string = form.get("email") as string;
    const password = form.get("password");
    if(!password) {
      throw new Error('Password not supplied');
    }


    const user = await db.query.users.findFirst({
      where: (users, {eq}) => eq(users.email, email)
    })
    if(!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await verify(user.password, password as string);

    if(!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // We don't want to send out the password once we have validated it
    const returnUser: ReturnUser = user;
    delete returnUser.password;

    return returnUser;
}),
  EMAIL_STRATEGY,
);

export const registerUser = async (email: string, password: string) => {
  const exists = await db.query.users.findFirst({
    where: (users, {eq}) => eq(users.email, email)
  })

  if(exists) {
    throw new Error('User with email already exists');
  }

  const hashedPassword = await hash(password);
  const record = await db.insert(users).values({email, password: hashedPassword}).returning().execute();

  if(!record || !record[0].id) {
    throw new Error('Unable to register');
  }

  return {id: record[0].id};
}

