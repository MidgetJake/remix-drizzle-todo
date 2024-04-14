import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Auth" }];
};

export default function AuthLayout() {
  return <Outlet />;
}