import { Routes as ReactRoutes, Route } from "react-router-dom";
import WithLayout from "./WithLayout";
// Available layouts
import { Main as MainLayout, Fluid as FluidLayout, Fixed as FixedLayout, Graph as GraphLayout } from "./layouts";

import DashboardView from "./views/dashboard/Dashboard";
import GraphView from "./views/graph/Graph";
import UnauthorizedView from "./views/unauthorized/Unauthorized";
import HomeView from "./views/home/Home";

// Landing pages
import {
  Home as HomeView2,
  Advertisement as AdvertisementView,
  PaymentApp as PaymentAppView,
  Marketing as MarketingView,
  Course as CourseView,
  Crypto as CryptoView,
  DesignAgency as DesignAgencyView,
  Consulting as ConsultingView,
  Application as ApplicationView,
  DomainHosting as DomainHostingView,
  Travel as TravelView,
  Event as EventView,
} from "./views/landingPages";

// Supporting pages
import {
  About as AboutView,
  Services as ServicesView,
  Contact as ContactView,
  Pricing as PricingView,
  Customers as CustomersView,
  HireUs as HireUsView,
  Faq as FaqView,
  Privacy as PrivacyView,
  ComingSoon as ComingSoonView,
  MaintenanceMode as MaintenanceModeView,
  Cover as CoverView,
  NotFound as NotFoundView,
} from "./views/supportingPages";

// Authentication pages
import {
  LoginSimple as LoginSimpleView,
  SignupSimple as SignupSimpleView,
  ForgotPassword as ForgotPasswordView,
  ForgotPasswordSimple as ForgotPasswordSimpleView,
} from "./views/authPages";

// Documentation pages
import {
  Introduction as IntroductionView,
  QuickStart as QuickStartView,
  Colors as ColorsView,
  TypographyComponent as TypographyComponentView,
  Shadows as ShadowsView,
  ContainerComponent as ContainerComponentView,
  Layouts as LayoutsView,
  Plugins as PluginsView,
  Support as SupportView,
  Icons as IconsView,
  Illustrations as IllustrationsView,
  ChangeLog as ChangeLogView,
} from "./views/docs";

import { AuthProvider } from "supabase/Auth";

const Routes = () => {
  return (
    <AuthProvider>
      <ReactRoutes>
        <Route
          exact
          path="/"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={HomeView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/dashboard"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={DashboardView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/document/:id"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={GraphView} layout={GraphLayout} />
          ))()}
        />

        <Route
          exact
          path="/document/:id/unauthorized"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={UnauthorizedView} layout={GraphLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-advertisement"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={AdvertisementView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-payment-app"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={PaymentAppView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-course"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={CourseView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-crypto"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={CryptoView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-design-agency"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={DesignAgencyView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-consulting"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ConsultingView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-application"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ApplicationView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-domain-hosting"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={DomainHostingView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-travel"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={TravelView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/landing-event"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={EventView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-about"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={AboutView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-services"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ServicesView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-contact"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ContactView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-pricing"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={PricingView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-customers"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={CustomersView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-hire-us"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={HireUsView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-faq"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={FaqView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-privacy"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={PrivacyView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-coming-soon"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ComingSoonView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-maintenance-mode"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={MaintenanceModeView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-cover"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={CoverView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/login"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={LoginSimpleView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/signup"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={SignupSimpleView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-forgot-password"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ForgotPasswordView} layout={FluidLayout} />
          ))()}
        />
        <Route
          exact
          path="/forgot-password"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ForgotPasswordSimpleView} layout={MainLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-introduction"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={IntroductionView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-quick-start"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={QuickStartView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-colors"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ColorsView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-typography"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={TypographyComponentView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-shadows"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ShadowsView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-container"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ContainerComponentView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-layouts"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={LayoutsView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-plugins"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={PluginsView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-icons"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={IconsView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-illustrations"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={IllustrationsView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-support"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={SupportView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/docs-change-log"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={ChangeLogView} layout={FixedLayout} />
          ))()}
        />
        <Route
          exact
          path="/page-not-found"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={NotFoundView} layout={MainLayout} />
          ))()}
        />
        <Route
          path="*"
          element={((matchProps) => (
            <WithLayout {...matchProps} component={NotFoundView} layout={MainLayout} />
          ))()}
        />
      </ReactRoutes>
    </AuthProvider>
  );
};

export default Routes;
