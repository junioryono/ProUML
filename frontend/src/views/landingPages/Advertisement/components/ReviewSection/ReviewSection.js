/* eslint-disable react/no-unescaped-entities */

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Container from "common/Container";

const ReviewSection = () => {
  const theme = useTheme();

  return (
    <Box
      borderRadius={1.5}
      sx={{
        position: "relative",
        backgroundColor: theme.palette.alternate.main,
        "&::after": {
          position: "absolute",
          content: '""',
          width: "30%",
          zIndex: 1,
          top: 0,
          right: 0,
          height: "100%",
          backgroundSize: "18px 18px",
          backgroundImage: `radial-gradient(${theme.palette.primary.light} 20%, transparent 20%)`,
          opacity: 0.2,
        },
      }}
    >
      <Container position="relative" zIndex={2} paddingX={{ xs: 2, sm: 6, md: 12 }}>
        <Box data-aos={"fade-up"}>
          <Typography
            sx={{
              textTransform: "uppercase",
              fontWeight: "medium",
            }}
            gutterBottom
            color={"secondary"}
            align={"center"}
          >
            Case Study
          </Typography>
          <Typography variant={"h3"} gutterBottom align={"center"}>
            <Box fontWeight={700} component={"span"}>
              webbee
            </Box>
          </Typography>
          <Box component={Typography} variant={"h6"} fontWeight={400} align={"center"} gutterBottom>
            "In case you are starting a business or launching any product in the market, Using the availbale pages you can quickly get started in a day with your
            website(some coding experience also required). The desgin quality is polished very well, it looks very professional."
          </Box>
          <Box component={"ul"} display={"flex"} justifyContent={"center"} width={"100%"}>
            <Box component={ListItem} disableGutters width={"auto"}>
              <ListItemAvatar>
                <Avatar src={"https://assets.maccarianagency.com/avatars/img2.jpg"} />
              </ListItemAvatar>
              <ListItemText primary={"Jhon Anderson"} secondary={"Senior Frontend Developer"} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ReviewSection;
