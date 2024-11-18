import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import ErrorPage from './pages/error/ErrorPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Reservation from './pages/reservation/Reservation'
import Tournaments from './pages/tournaments/Tournaments'
import Objects from './pages/objects/Objects'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/reservations",
        element: <Reservation />
      },
      {
        path: "/tournaments",
        element: <Tournaments />
      },
      {
        path: "/objects",
        element: <Objects />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
])

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
