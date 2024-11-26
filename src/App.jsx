import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Home from "./pages/Home";
import { Toaster } from "./components/ui/toaster";
import Booking from "./components/caar/Booking";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import { useAuth } from "./hook/useAuth.jsx";
import CarUploadForm from "./addListing/CarUploadForm";
import CarList from "./components/caar/CarList";
import CarDetails from "./components/caar/CarDetail";
import BookingPaymentForm from "./components/caar/BookingPaymentForm";
import About from "./pages/About";
import ContactUsForm from "./pages/Contact";

// PrivateRoute component for route protection
const PrivateRoute = ({ user, element }) => {
  return user ? element : <LoginForm />;
};

const AdminRoute = ({ user, element }) => {
  return user?.isAdmin ? element : <Home />;
};

// Layout component for wrapping Navbar, Footer, and main content
const Layout = ({ user, logout }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar user={user} logout={logout} />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <Toaster /> {/* ShadCN Toaster setup */}
  </div>
);

const App = () => {
  const { user, logout } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout user={user} logout={logout} />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <LoginForm /> },
        { path: "/register", element: <RegisterForm /> },
        { path: "/cars/:carId", element: <CarDetails /> },
        { path: "/booking/:carId", element: <Booking /> },
        { path: "/addListing/addCar", element: <CarUploadForm /> },
        { path: "/api/cars", element: <CarList /> },
        { path: "/api/stripe/create-payment-intent", element: <BookingPaymentForm /> },
        { path: "/about", element: <About/> },
        { path: "/contact", element: <ContactUsForm/> },
        {
          path: "/profile",
          element: <PrivateRoute user={user} element={<Profile />} />,
        },
        {
          path: "/admin",
          element: <AdminRoute user={user} element={<Admin />} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
