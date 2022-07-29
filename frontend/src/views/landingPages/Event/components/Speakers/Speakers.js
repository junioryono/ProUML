import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

const Speakers = () => {
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
          Our speakers
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"}>
          The Most Importent Speakers
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"} data-aos="fade-up">
          There arge many variations ohf passages of sorem gpsum ilable,
          <br />
          but the majority have suffered alteration in.
        </Typography>
        <Box marginTop={2} display={"flex"} justifyContent={"center"}>
          <Button color={"primary"} variant={"contained"} size={"large"}>
            View all
          </Button>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {[
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
          <Grid item xs={12} sm={6} md={3} key={i} data-aos={"fade-up"}>
            <Box component={Card} boxShadow={0} bgcolor={"transparent"}>
              <Box component={CardMedia} borderRadius={2} width={"100%"} height={"100%"} minHeight={320} image={item.avatar} />
              <Box component={CardContent} bgcolor={"transparent"} marginTop={-5}>
                <Box component={Card} borderRadius={2}>
                  <CardContent>
                    <ListItemText primary={item.name} secondary={item.title} />
                    <Box marginTop={2}>
                      <IconButton aria-label="facebook" size={"small"}>
                        <FacebookIcon />
                      </IconButton>
                      <IconButton aria-label="twitter" size={"small"}>
                        <TwitterIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Speakers;
