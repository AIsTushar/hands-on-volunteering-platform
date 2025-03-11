import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import HelpRequestDetails from "./pages/HelpRequestDetails";
import Layout from "./layout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Loading from "./components/Loading";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AllEvent from "./pages/AllEvent";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="help-requests/:id" element={<HelpRequestDetails />} />
          <Route path="/events" element={<AllEvent />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
