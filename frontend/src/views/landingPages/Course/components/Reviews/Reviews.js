import Slider from "react-slick";
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

const Reviews = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const GridItemHeadlineBlock = () => (
    <Box>
      <Box marginBottom={2}>
        <Box component={Typography} variant="h3" fontWeight={"700"} data-aos={isMd ? "fade-right" : "fade-up"}>
          Loved by business and individuals
          <br />
          across the globe.
        </Box>
      </Box>
      <Box marginBottom={{ xs: 2, sm: 4 }}>
        <Box component={Typography} variant="h6" data-aos={isMd ? "fade-right" : "fade-up"}>
          We design & develop amazing websites and digital products
          <br />
          for startups, companies and ourselves.
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap">
        {[
          "https://assets.maccarianagency.com/svg/logos/airbnb-original.svg",
          "https://assets.maccarianagency.com/svg/logos/amazon-original.svg",
          "https://assets.maccarianagency.com/svg/logos/fitbit-original.svg",
        ].map((item, i) => (
          <Box maxWidth={90} marginTop={2} marginRight={4} key={i} data-aos={isMd ? "fade-right" : "fade-up"}>
            <Box
              component="img"
              height={"100%"}
              width={"100%"}
              src={item}
              alt="..."
              sx={{
                filter: theme.palette.mode === "dark" ? "brightness(0) invert(0.7)" : "none",
              }}
            />
          </Box>
        ))}
      </Box>
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
              feedback: "Working with Materialist is fantastic! Simple, re-usable components all in one platform.",
              image: "https://assets.maccarianagency.com/avatars/img1.jpg",
              name: "Clara Bertoletti",
              title: "Material-UI lover",
            },
            {
              feedback: "This is great bundle. I can contruct anything in just 10 minuts. Absolutelly love it! 10 out of 10.",
              image: "https://assets.maccarianagency.com/avatars/img2.jpg",
              name: "Jhon Anderson",
              title: "Senior Frontend Developer",
            },
            {
              feedback: "Love the app for cash back, reward points and fraud protection – just like when you're swiping your card.",
              image: "https://assets.maccarianagency.com/avatars/img3.jpg",
              name: "Chary Smith",
              title: "SEO at Comoti",
            },
          ].map((item, i) => (
            <Box padding={{ xs: 0, sm: 1, md: 2 }} key={i}>
              <Box component={Card} boxShadow={0} border={`1px solid ${theme.palette.divider}`}>
                <CardContent>
                  <Box marginBottom={1}>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Box key={item} color={theme.palette.secondary.main} display={"inline"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={24} height={24}>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </Box>
                    ))}
                  </Box>
                  <Box component={Typography} variant={"h6"} fontWeight={400} marginBottom={2}>
                    {item.feedback}
                  </Box>
                  <Box width={1}>
                    <Box component={ListItem} disableGutters width={"auto"} padding={0}>
                      <ListItemAvatar>
                        <Avatar src={item.image} />
                      </ListItemAvatar>
                      <Box component={ListItemText} primary={item.name} secondary={item.title} margin={0} />
                    </Box>
                  </Box>
                </CardContent>
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

export default Reviews;
