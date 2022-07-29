/* eslint-disable react/no-unescaped-entities */

import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { colors } from "@mui/material";

const Overview = ({ themeMode = "light" }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });
  return (
    <Box>
      <Box marginBottom={4}>
        <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"}>
          What you'll learn
        </Box>
        <Typography align={"center"} color="textSecondary" variant={"h6"}>
          We design & develop amazing websites and digital products
          <br />
          for startups, companies and ourselves.
        </Typography>
      </Box>
      <Grid container spacing={isMd ? 8 : 4}>
        {[
          {
            title: "Automation",
            subtitle: "We help your business gain leverage and efficiency through automation using simple, yet powerful NoCode tools.",
            icon: (
              <svg width={32} height={32} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            ),
            color: colors.blueGrey,
            lessons: [
              "Lesson 1: Doloremque laudantium, totam error.",
              "Lesson 2: Natus error sit voluptatem",
              "Lesson 3: Totam rem aperiam, eaque ipsa.",
              "Lesson 4: Accusantium doloremque laudantium, totam rem",
            ],
          },
          {
            title: "Funnel Optimization",
            subtitle: "We help you optimize your website or mobile app flow to increase conversion rates and retention to drive growth.",
            icon: (
              <svg width={32} height={32} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            ),
            color: colors.lightBlue,
            lessons: [
              "Lesson 1: Doloremque laudantium, totam error.",
              "Lesson 2: Natus error sit voluptatem",
              "Lesson 3: Totam rem aperiam, eaque ipsa.",
              "Lesson 4: Accusantium doloremque laudantium, totam rem",
            ],
          },
          {
            title: "Idea Creation",
            subtitle: "We meet with your team to know more about your project idea and goals.",
            icon: (
              <svg width={32} height={32} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            ),
            color: colors.pink,
            lessons: [
              "Lesson 1: Doloremque laudantium, totam error.",
              "Lesson 2: Natus error sit voluptatem",
              "Lesson 3: Totam rem aperiam, eaque ipsa.",
              "Lesson 4: Accusantium doloremque laudantium, totam rem",
            ],
          },
        ].map((item, i) => (
          <Grid item xs={12} key={i}>
            <Grid container spacing={isMd ? 4 : 2} flexDirection={i % 2 === 1 ? "row-reverse" : "row"}>
              <Grid item xs={12} md={6} data-aos={isMd ? "fade-right" : "fade-up"}>
                <Box
                  component={Card}
                  display={"flex"}
                  alignItems={"center"}
                  width={"100%"}
                  height={"100%"}
                  bgcolor={item.color[themeMode === "light" ? 50 : 900]}
                  boxShadow={0}
                >
                  <CardContent>
                    <Box component={Avatar} width={60} height={60} marginBottom={6} bgcolor={item.color[themeMode === "light" ? 900 : 50]} boxShadow={4}>
                      <Box color={item.color[themeMode === "light" ? 50 : 900]}>{item.icon}</Box>
                    </Box>
                    <Box component={Typography} variant={"h6"} gutterBottom fontWeight={500}>
                      {item.title}
                    </Box>
                    <Typography color="text.secondary">{item.subtitle}</Typography>
                  </CardContent>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} data-aos={isMd ? "fade-left" : "fade-up"}>
                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} width={"100%"} height={"100%"}>
                  <Box marginBottom={2}>
                    <Box component={Typography} variant={"h4"} gutterBottom fontWeight={600}>
                      {item.title}
                    </Box>
                    <Typography color="text.secondary">{item.subtitle}</Typography>
                  </Box>
                  <Grid container spacing={1}>
                    {item.lessons.map((lesson, j) => (
                      <Grid item xs={12} key={j}>
                        <Box component={ListItem} disableGutters width={"auto"} padding={0}>
                          <Box component={ListItemAvatar} minWidth={"auto !important"} marginRight={2}>
                            <Box component={Avatar} bgcolor={theme.palette.secondary.main} width={20} height={20}>
                              <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Box>
                          </Box>
                          <ListItemText primary={lesson} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

Overview.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Overview;
