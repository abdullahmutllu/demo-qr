import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { OrderProvider } from './context/OrderContext';
import { VenueFilterProvider } from './context/VenueFilterContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CustomerOrder from './pages/CustomerOrder';
import Kitchen from './pages/Kitchen';
import Bar from './pages/Bar';
import Waiter from './pages/Waiter';
import Patron from './pages/Patron';
import Admin from './pages/Admin';

const router = createBrowserRouter(
  [
    {
      path: '/v/:venueSlug/m/:tableId',
      element: <CustomerOrder />,
    },
    {
      path: '/siparis',
      element: <Navigate to="/v/bora-beach/m/7" replace />,
    },
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'mutfak', element: <Kitchen /> },
        { path: 'bar', element: <Bar /> },
        { path: 'garson', element: <Waiter /> },
        { path: 'patron', element: <Patron /> },
        { path: 'admin', element: <Admin /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export default function App() {
  return (
    <ToastProvider>
      <OrderProvider>
        <VenueFilterProvider>
          <RouterProvider router={router} />
        </VenueFilterProvider>
      </OrderProvider>
    </ToastProvider>
  );
}
