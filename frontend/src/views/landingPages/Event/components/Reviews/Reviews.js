import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const Reviews = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box marginBottom={4}>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"left"} gutterBottom>
          Loved by business and individuals
          <br />
          across the globe.
        </Box>
      </Box>
      <Grid container spacing={2}>
        {[
          {
            feedback: "Working with Materialist is fantastic! Simple, re-usable components all in one platform.",
            name: "Clara Bertoletti",
            title: "Material-UI lover",
            avatar: "https://assets.maccarianagency.com/avatars/img1.jpg",
          },
          {
            feedback: "This is great bundle. I can contruct anything in just 10 minuts. Absolutelly love it! 10 out of 10.",
            name: "Jhon Anderson",
            title: "Senior Frontend Developer",
            avatar: "https://assets.maccarianagency.com/avatars/img2.jpg",
          },
          {
            feedback: "Love the app for cash back, reward points and fraud protection – just like when you're swiping your card.",
            name: "Chary Smith",
            title: "SEO at Comoti",
            avatar: "https://assets.maccarianagency.com/avatars/img3.jpg",
          },
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Box width={"100%"} height={"100%"} data-aos={"fade-up"} component={Card} display={"flex"} flexDirection={"column"}>
              <Box component={CardContent} display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
                <Box marginBottom={1} display={"flex"}>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Box key={item} color={theme.palette.secondary.main}>
                      <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </Box>
                  ))}
                </Box>
                <Typography align={"left"} color="textSecondary">
                  {item.feedback}
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <CardActions>
                <ListItem component="div" disableGutters sx={{ padding: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={item.avatar} />
                  </ListItemAvatar>
                  <ListItemText sx={{ margin: 0 }} primary={item.name} secondary={item.title} />
                </ListItem>
              </CardActions>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reviews;
