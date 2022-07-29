import PropTypes from "prop-types";
import Slider from "react-slick";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { colors } from "@mui/material";

const Process = ({ themeMode = "light" }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const GridItemHeadlineBlock = () => (
    <Box>
      <Typography
        sx={{
          textTransform: "uppercase",
          fontWeight: "medium",
        }}
        gutterBottom
        color={"secondary"}
      >
        Our process
      </Typography>
      <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom data-aos={isMd ? "fade-right" : "fade-up"}>
        A simple, yet powerful process
      </Box>
      <Typography variant={"h6"} component={"p"} color={"textSecondary"} data-aos={isMd ? "fade-right" : "fade-up"}>
        We are a small agency with a talented team of designers & developers. Unlike huge agencies, we will treat your project as ours, and will walk you through our
        process by hand.
      </Typography>
    </Box>
  );

  const GridItemReviewBlock = () => {
    const sliderOpts = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
    };

    return (
      <Box maxWidth={"100%"} data-aos={isMd ? "fade-left" : "fade-up"}>
        <Slider {...sliderOpts}>
          {[
            {
              title: "Idea",
              subtitle:
                "We meet with your team to know more about your project idea and goals. After that, our team will work together to create an action plan and proposal for your project.",
              icon: (
                <svg width={48} height={48} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              ),
              color: colors.amber,
            },
            {
              title: "Design",
              subtitle:
                "We start by designing a mockup or prototype of your website, and present it to you. Once with the initial mockup, we start the revision process to perfect it.",
              icon: (
                <svg width={48} height={48} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              ),
              color: colors.purple,
            },
            {
              title: "Development",
              subtitle:
                "We develop your website using the best practices and standards, so you have a perfectly responsive, lightning fast, SEO-friendly, and super scalable website.",
              icon: (
                <svg width={48} height={48} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
              color: colors.green,
            },
          ].map((item, i) => (
            <Box padding={{ xs: 1, sm: 2 }} key={i}>
              <Box component={Card} boxShadow={{ xs: 1, sm: 3 }} borderRadius={5} padding={{ xs: 1, sm: 2, md: 3 }}>
                <Box component={CardContent} display={"flex"} flexDirection={"column"}>
                  <Box
                    component={Avatar}
                    variant="rounded"
                    width={84}
                    height={84}
                    marginBottom={2}
                    bgcolor={themeMode === "light" ? item.color[50] : item.color[200]}
                    borderRadius={5}
                  >
                    <Box color={item.color[themeMode === "light" ? 500 : 700]}>{item.icon}</Box>
                  </Box>
                  <Box component={Typography} variant={"h6"} gutterBottom fontWeight={500}>
                    {item.title}
                  </Box>
                  <Typography color="text.secondary">{item.subtitle}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    );
  };

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box width={1} height="100%" display="flex" alignItems="center">
            <GridItemHeadlineBlock />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box width={1} height="100%" display="flex" alignItems="center">
            <GridItemReviewBlock />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Process.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Process;
