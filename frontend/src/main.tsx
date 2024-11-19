import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layouts/public-layout/Layout'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import ErrorPage from './pages/error/ErrorPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Reservation from './pages/reservation/Reservation'
import Tournaments from './pages/tournaments/Tournaments'
import Objects from './pages/objects/Objects'
import ClientLayout from './components/layouts/client-layout/ClientLayout'
import ClientProfile from './pages/dashboards/client_profile/ClientProfile'
import EmployeeLayout from './components/layouts/employee-layout/EmployeeLayout'
import EmployeeDashboard from './pages/dashboards/employee_dashboard/EmployeeDashboard'
import AddTournament from './pages/dashboards/employee_dashboard/add-tournament/AddTournament'
import AddTimesheet from './pages/dashboards/employee_dashboard/add-timesheet/AddTimesheet'
import AdminLayout from './components/layouts/admin-layout/AdminLayout'
import AdminDashboard from './pages/dashboards/admin_dashboard/AdminDashboard'
import CreateEmployee from './pages/dashboards/admin_dashboard/create-employee/CreateEmployee'
import BlockAccount from './pages/dashboards/admin_dashboard/block-account/BlockAccount'

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
    element: <ClientLayout/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/profile",
        element: <ClientProfile />,
      }
    ]
  }, //todo add more client routes
  {
    element: <EmployeeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/employee-dashboard",
        element: <EmployeeDashboard />,
        children: [
          {
            path: "/employee-dashboard/add-tournament",
            element: <AddTournament />
          },
          {
            path: "/employee-dashboard/add-timesheet",
            element: <AddTimesheet />
          },
        ]
      },
    ]
  },
  {
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin-dashboard",
        element: <AdminDashboard />,
        children: [
          {
            path: "/admin-dashboard/create-employee",
            element: <CreateEmployee />
          },
          {
            path: "/admin-dashboard/block-account",
            element: <BlockAccount />
          },
        ]
      },
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
