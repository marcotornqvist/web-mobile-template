export {};
// import { ReactNode, useEffect } from 'react';
// import { useSnapshot } from 'valtio';
// import { authState } from 'store';
// import { useRouter } from 'next/router';

// interface IProps {
//   protectedRoutes: string[];
//   children: any;
// }

// export default function PrivateRoute({ protectedRoutes, children }: IProps) {
//   const { loading, isAuth } = useSnapshot(authState);
//   const router = useRouter();

//   const firstPath = router.pathname.split('/')[1];

//   const pathIsProtected = protectedRoutes.indexOf('/' + firstPath) !== -1;

//   useEffect(() => {
//     if (!loading && !isAuth && pathIsProtected) {
//       // Redirect route, you can point this to /login
//       router.push('/');
//     }
//   }, [loading, isAuth, pathIsProtected]);

//   if ((loading || !isAuth) && pathIsProtected) {
//     return null;
//   }

//   return children;
// }
