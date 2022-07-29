import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const Roadmap = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"), {
    defaultMatches: true,
  });

  const timeline = [
    {
      date: "October 2016",
      title: "Secured Series-A funding",
    },
    {
      date: "April 2017",
      title: "New CTO: Joe Schultz",
    },
    {
      date: "October 2017",
      title: "v1.0 Ships",
    },
    {
      date: "February 2018",
      title: "Featured in Wired",
    },
    {
      date: "September 2018",
      title: "v.20 Ships",
    },
  ];

  const TimeLineMobileView = ({ timeline = [] }) => (
    <Grid container spacing={2}>
      {timeline.map((item, i) => (
        <Grid item xs={12} key={i}>
          <Box display={"flex"} alignItems={"center"} data-aos={"fade-up"}>
            <Box width={10} height={10} borderRadius={"100%"} bgcolor={theme.palette.primary.main} marginRight={2} />
            <Box>
              <Typography variant={"subtitle1"} color={"textSecondary"} gutterBottom>
                {item.date}
              </Typography>
              <Typography variant={"h6"}>{item.title}</Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  TimeLineMobileView.propTypes = {
    timeline: PropTypes.array.isRequired,
  };

  const TimeLineDesktopView = ({ timeline = [] }) => (
    <Grid container spacing={2}>
      {timeline.map((item, i) => (
        <Grid item xs={12} key={i}>
          <Box
            paddingBottom={4}
            display={"flex"}
            alignItems={"center"}
            flexDirection={i % 2 === 1 ? "row-reverse" : "row"}
            marginRight={i % 2 === 1 ? "calc(50% - 5px)" : 0}
            marginLeft={i % 2 !== 1 ? "calc(50% - 5px)" : 0}
            data-aos={i % 2 === 1 ? "fade-right" : "fade-left"}
          >
            <Box width={10} height={10} borderRadius={"100%"} bgcolor={theme.palette.primary.main} marginRight={i % 2 !== 1 ? 5 : 0} marginLeft={i % 2 === 1 ? 5 : 0} />
            <Box>
              <Typography variant={"subtitle1"} color={"textSecondary"} gutterBottom>
                {item.date}
              </Typography>
              <Typography variant={"h6"}>{item.title}</Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  TimeLineDesktopView.propTypes = {
    timeline: PropTypes.array.isRequired,
  };

  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"secondary"}
          align={isSm ? "center" : "left"}
        >
          Roadmap
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={isSm ? "center" : "left"} gutterBottom>
          Sync your banking data anywhere.
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={isSm ? "center" : "left"}>
          Compliance, financial reviews, tax auditing, and any financial task has never been easier.
        </Typography>
      </Box>
      {isSm ? <TimeLineDesktopView timeline={timeline} /> : <TimeLineMobileView timeline={timeline} />}
    </Box>
  );
};

export default Roadmap;
