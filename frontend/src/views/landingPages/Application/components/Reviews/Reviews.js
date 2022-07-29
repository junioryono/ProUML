/* eslint-disable react/no-unescaped-entities */

import Slider from "react-slick";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "common/Container";

const Reviews = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.up("xs"), {
    defaultMatches: true,
  });
  const isSm = useMediaQuery(theme.breakpoints.up("sm"), {
    defaultMatches: true,
  });
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });
  const isLg = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true,
  });

  let slidesToShow = 1;
  if (isXs) {
    slidesToShow = 1;
  }
  if (isSm) {
    slidesToShow = 2;
  }
  if (isMd) {
    slidesToShow = 3;
  }
  if (isLg) {
    slidesToShow = 4;
  }

  const sliderOpts = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  return (
    <Box>
      <Container paddingY={"0 !important"}>
        <Box marginBottom={4}>
          <Typography
            sx={{
              textTransform: "uppercase",
              fontWeight: "medium",
            }}
            gutterBottom
            color={"secondary"}
            align={"center"}
          >
            TESTIMONIALS
          </Typography>
          <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"}>
            Don't take word for it
          </Box>
          <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
            See what our amazing past clients have to say about the work done by us
          </Typography>
        </Box>
      </Container>
      <Box>
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
            {
              feedback: "Working with Materialist is fantastic! Simple, re-usable components all in one platform.",
              image: "https://assets.maccarianagency.com/avatars/img4.jpg",
              name: "Clara Bertoletti",
              title: "Material-UI lover",
            },
            {
              feedback: "This is great bundle. I can contruct anything in just 10 minuts. Absolutelly love it! 10 out of 10.",
              image: "https://assets.maccarianagency.com/avatars/img5.jpg",
              name: "Jhon Anderson",
              title: "Senior Frontend Developer",
            },
            {
              feedback: "Love the app for cash back, reward points and fraud protection – just like when you're swiping your card.",
              image: "https://assets.maccarianagency.com/avatars/img6.jpg",
              name: "Chary Smith",
              title: "SEO at Comoti",
            },
          ].map((item, i) => (
            <Box paddingX={{ xs: 1, md: 2, lg: 3 }} paddingBottom={{ xs: 1, md: 2, lg: 3 }} key={i}>
              <Box component={Card} boxShadow={{ xs: 1, sm: 3 }} borderRadius={5}>
                <Box component={CardContent}>
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
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default Reviews;
