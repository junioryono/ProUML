import { BrowserRouter } from "react-router-dom";
import { Routes as ReactRoutes, Route } from "react-router-dom";
import { AuthProvider } from "supabase/Auth";

import WithLayout from "./WithLayout";

// Available layouts
import { Main as MainLayout, Fluid as FluidLayout, Fixed as FixedLayout, Graph as GraphLayout } from "./layouts";

import {
  Dashboard as DashboardView,
  Document as DocumentView,
  Graph as GraphView,
  Home as HomeView,
  NotFound as NotFoundView,
  Unauthorized as UnauthorizedView,
} from "./views";

import "react-lazy-load-image-component/src/effects/blur.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "aos/dist/aos.css";

import "react-image-lightbox/style.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReactRoutes>
          <Route
            path="/"
            element={(() => (
              <WithLayout component={HomeView} layout={MainLayout} />
            ))()}
          />
          <Route
            path="/dashboard"
            element={(() => (
              <WithLayout component={DashboardView} layout={MainLayout} />
            ))()}
          />
          <Route
            path="/document-old/:id"
            element={(() => (
              <WithLayout component={GraphView} layout={GraphLayout} />
            ))()}
          />
          <Route
            path="/document/:documentId"
            element={(() => (
              <WithLayout component={DocumentView} layout={GraphLayout} />
            ))()}
          />
          <Route
            path="/document/:id/unauthorized"
            element={(() => (
              <WithLayout component={UnauthorizedView} layout={GraphLayout} />
            ))()}
          />
          <Route
            path="*"
            element={(() => (
              <WithLayout component={NotFoundView} layout={MainLayout} />
            ))()}
          />
        </ReactRoutes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
