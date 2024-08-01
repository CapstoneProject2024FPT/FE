import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./routes/AppRoutes";
import { FitlerProvider } from "./context/FilterContext";
import NotificationComponent from "./components/NotificationComponent";

const App: React.FC = () => {
  return (
    <Router>
      <FitlerProvider>
        <NotificationComponent />
        <AppRoute />
      </FitlerProvider>
    </Router>
  );
};

export default App;
