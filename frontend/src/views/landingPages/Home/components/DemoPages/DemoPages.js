/* eslint-disable react/no-unescaped-entities */

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { pages } from "layouts/navigation";

const DemoPages = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"textSecondary"}
          align={"center"}
        >
          Demo pages
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"} color={"currentColor"}>
          Webbee in action
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
          All examples you find below are included in the download package.
        </Typography>
        <Box marginTop={3} display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretched", sm: "flex-start" }} justifyContent={"center"}>
          <Button
            component={"a"}
            variant="contained"
            color="primary"
            size="large"
            fullWidth={isMd ? false : true}
            href={"https://material-ui.com/store/items/webbee-landing-page/"}
            target={"_blank"}
            endIcon={
              <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            }
          >
            Purchase now
          </Button>
          <Box marginTop={{ xs: 2, sm: 0 }} marginLeft={{ sm: 2 }} width={{ xs: "100%", md: "auto" }}>
            <Button component={"a"} href={"/docs-introduction"} variant="outlined" color="primary" size="large" fullWidth={isMd ? false : true}>
              View documentation
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        {pages.map((p, i) => (
          <Box key={p.id} marginBottom={i === pages.length - 1 ? 0 : { xs: 4, sm: 6, md: 8 }}>
            <Typography
              variant={"h5"}
              sx={{
                marginBottom: { xs: 2, sm: 3, md: 4 },
                fontWeight: 700,
              }}
              color={"currentColor"}
            >
              {p.title}
            </Typography>
            <Box component={Grid} container borderRight={`1px solid ${theme.palette.divider}`} borderBottom={`1px solid ${theme.palette.divider}`}>
              {p.pages.map((sp) => (
                <Grid item xs={12} sm={6} md={4} key={sp.title} component={Link} underline={"none"} color={"unset"} href={sp.href}>
                  <Box
                    width={"100%"}
                    height={"100%"}
                    borderLeft={`1px solid ${theme.palette.divider}`}
                    borderTop={`1px solid ${theme.palette.divider}`}
                    padding={{ xs: 2, md: 4 }}
                  >
                    <Typography
                      variant={"subtitle1"}
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                      }}
                      color={"currentColor"}
                    >
                      {sp.title}
                    </Typography>
                    <Typography color="text.secondary">{sp.title} page</Typography>
                    <Box marginTop={1} align={"right"}>
                      <Typography color={"primary"} variant={"subtitle2"}>
                        View demo
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DemoPages;
