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

import ProtectedRoute from "./components/ProtectedRoute";
import AllEvent from "./pages/AllEvent";
import AllHelpRequests from "./pages/AllHelpRequests";
import ProfileLayout from "./components/profile/ProfileLayout";
import DashBoard from "./components/profile/DashBoard";
import MyEvents from "./components/profile/MyEvents";
import MyHelpRequests from "./components/profile/MyHelpRequests";
import MyTeams from "./components/profile/MyTeams";
import Settings from "./components/profile/Settings";
import ImpactStats from "./components/profile/ImpactStats";
import CreateNewEvent from "./components/profile/CreateNewEvent";
import EditEvent from "./components/profile/EditEvent";
import CreateNewRequest from "./components/profile/CreateNewRequest";
import EditRequest from "./components/profile/EditRequest";

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
        {/* Public Routes - Uses Main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="help-requests/:id" element={<HelpRequestDetails />} />
          <Route path="events" element={<AllEvent />} />
          <Route path="help-requests" element={<AllHelpRequests />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        {/* Protected Profile Section (Does NOT use Layout) */}

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<DashBoard />} />
            <Route path="events" element={<MyEvents />} />
            <Route path="events/new" element={<CreateNewEvent />} />
            <Route path="events/edit-event/:id" element={<EditEvent />} />
            <Route path="help-requests" element={<MyHelpRequests />} />
            <Route path="help-requests/new" element={<CreateNewRequest />} />
            <Route path="help-requests/edit/:id" element={<EditRequest />} />
            <Route path="teams" element={<MyTeams />} />
            <Route path="impact-stats" element={<ImpactStats />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all for Undefined Routes */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
