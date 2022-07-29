import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

const Team = () => {
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
        >
          Team
        </Typography>
        <Typography fontWeight={700} variant={"h3"}>
          Meet the experts
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {[
          {
            name: "Clara Bertoletti",
            title: "Junior Designer",
            avatar: "https://assets.maccarianagency.com/avatars/img1.jpg",
          },
          {
            name: "Jhon Anderson",
            title: "Senior Frontend Developer",
            avatar: "https://assets.maccarianagency.com/avatars/img2.jpg",
          },
          {
            name: "Chary Smith",
            title: "SEO at Comoti",
            avatar: "https://assets.maccarianagency.com/avatars/img3.jpg",
          },
          {
            name: "Clara Bertoletti",
            title: "Junior Designer",
            avatar: "https://assets.maccarianagency.com/avatars/img4.jpg",
          },
          {
            name: "Jhon Anderson",
            title: "Senior Frontend Developer",
            avatar: "https://assets.maccarianagency.com/avatars/img5.jpg",
          },
          {
            name: "Chary Smith",
            title: "SEO at Comoti",
            avatar: "https://assets.maccarianagency.com/avatars/img6.jpg",
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <ListItem component="div" disableGutters data-aos={"fade-up"}>
              <ListItemAvatar>
                <Box component={Avatar} width={120} height={120} src={item.avatar} marginRight={2} />
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={item.title} />
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Team;
