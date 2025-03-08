import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import HelpRequestDetails from "./pages/HelpRequestDetails";
import Layout from "./layout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="help-requests/:id" element={<HelpRequestDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
