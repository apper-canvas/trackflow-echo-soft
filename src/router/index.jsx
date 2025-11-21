import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { getRouteConfig } from '@/router/route.utils';
import Root from '@/layouts/Root';
import Layout from '@/components/organisms/Layout';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

// Lazy load components
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const Login = lazy(() => import('@/components/pages/Login'));
const Signup = lazy(() => import('@/components/pages/Signup'));
const ListView = lazy(() => import('@/components/pages/ListView'));
const BoardView = lazy(() => import('@/components/pages/BoardView'));
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

// Create route configuration
function createRoute({ path, index, element, children, errorElement, ...rest }) {
  const route = {
    path,
    index,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        {element}
      </Suspense>
    ),
    errorElement,
    ...rest
  };
  
  if (children) {
    route.children = children.map(child => createRoute(child));
  }
  
  return route;
}

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Login />
              </Suspense>
            )
          },
          {
            path: 'signup', 
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Signup />
              </Suspense>
            )
          }
        ]
      },
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            )
          },
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            )
          },
          {
            path: 'issues',
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <ListView />
                  </Suspense>
                )
              },
              {
                path: 'list',
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <ListView />
                  </Suspense>
                )
              },
              {
                path: 'board',
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <BoardView />
                  </Suspense>
                )
              }
            ]
          }
        ]
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  }
]);