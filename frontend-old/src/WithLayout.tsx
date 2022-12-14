import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme from "theme";
import AOS from "aos";
import { useAuth } from "supabase/Auth";

export const useDarkMode = () => {
  const [themeMode, setTheme] = useState("light");
  const [mountedComponent, setMountedComponent] = useState(false);

  const paletteType = "blue";

  const setMode = (mode: any) => {
    window.localStorage.setItem("themeMode", mode);
    setTheme(mode);
  };

  const themeToggler = () => {
    themeMode === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("themeMode");
    localTheme && setTheme(localTheme);
    setMountedComponent(true);
  }, []);

  return [themeMode, themeToggler, paletteType, mountedComponent];
};

export default function WithLayout({ component: Component, layout: Layout, authRequired, ...rest }: { component: any; layout: any; authRequired?: boolean }) {
  const { session: authSession, signIn } = useAuth();

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    AOS.init({
      once: true,
      delay: 50,
      duration: 500,
      easing: "ease-in-out",
    });
  }, []);

  const [themeMode, themeToggler, paletteType, mountedComponent] = useDarkMode();

  useEffect(() => {
    AOS.refresh();
  }, [mountedComponent, themeMode, paletteType]);

  if (authRequired && authSession === undefined) {
    return null;
  }

  if (authRequired && !authSession) {
    signIn();
    return null;
  }

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Paper elevation={0}>
        <Layout themeMode={themeMode} themeToggler={themeToggler} paletteType={paletteType}>
          <Component themeMode={themeMode} paletteType={paletteType} {...rest} />
        </Layout>
      </Paper>
    </ThemeProvider>
  );
}

WithLayout.propTypes = {
  component: PropTypes.elementType.isRequired,
  layout: PropTypes.elementType.isRequired,
  authRequired: PropTypes.bool,
};
