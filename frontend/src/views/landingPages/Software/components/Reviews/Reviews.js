import Slider from "react-slick";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const Reviews = () => {
  const sliderOpts = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
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
          align={"center"}
        >
          Reviews
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"} gutterBottom>
          Developers love Webbee
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
          Loved by business and individuals across the globe
        </Typography>
      </Box>
      <Box maxWidth={600} margin={"0 auto"}>
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
            <Box key={i}>
              <Box component={Typography} variant={"h6"} fontWeight={400} align={"center"} gutterBottom>
                {item.feedback}
              </Box>
              <Box component={"ul"} display={"flex"} justifyContent={"center"} width={"100%"}>
                <Box component={ListItem} disableGutters width={"auto"}>
                  <ListItemAvatar>
                    <Avatar src={item.image} />
                  </ListItemAvatar>
                  <ListItemText primary={item.name} secondary={item.title} />
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
