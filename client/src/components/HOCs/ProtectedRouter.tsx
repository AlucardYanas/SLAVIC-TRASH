import React, { Outlet, Navigate } from 'react-router-dom';

type ProtectedRouterProps = {
  children?: JSX.Element;
  isAllowed: boolean;
};
export default function ProtectedRouter({
  children,
  isAllowed,
}: ProtectedRouterProps): JSX.Element {
  if (!isAllowed) return <Navigate replace to="/" />;
  return children || <Outlet />;
}
