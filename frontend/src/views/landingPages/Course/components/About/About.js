import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const About = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item container alignItems={"center"} xs={12} md={6}>
          <Box>
            <Box marginBottom={2}>
              <Typography variant={"h4"} sx={{ fontWeight: 700 }} gutterBottom>
                Change the way you build wesites. Forever.
              </Typography>
              <Typography variant={"h6"} component={"p"} color="textSecondary">
                <Box component={"span"} fontWeight={400}>
                  With Webbee you get components and examples, including tons of variables that will help you customize this theme with ease.
                </Box>
              </Typography>
            </Box>
            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretched", sm: "flex-start" }}>
              <Box component={Button} variant="outlined" color="primary" size="large" fullWidth={!isMd}>
                Contact sales
              </Box>
              <Box component={Button} variant="contained" color="primary" size="large" fullWidth={!isMd} marginTop={{ xs: 1, sm: 0 }} marginLeft={{ sm: 2 }}>
                Subscribe
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            height={"100%"}
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            sx={{
              backgroundColor: "transparent",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='1' y2='0' gradientTransform='rotate(0,0.5,0.5)'%3E%3Cstop offset='0' stop-color='%230FF'/%3E%3Cstop offset='1' stop-color='%23CF6'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0' x2='0' y1='0' y2='1' gradientTransform='rotate(0,0.5,0.5)'%3E%3Cstop offset='0' stop-color='%23F00'/%3E%3Cstop offset='1' stop-color='%23FC0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23FFF' fill-opacity='0' stroke-miterlimit='10'%3E%3Cg stroke='url(%23a)' stroke-width='21.12'%3E%3Cpath d='M1409 581 1450.35 511 1490 581z'/%3E%3Ccircle stroke-width='7.040000000000001' transform='' cx='500' cy='100' r='40'/%3E%3Cpath transform='' d='M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z'/%3E%3C/g%3E%3Cg stroke='url(%23b)' stroke-width='6.4'%3E%3Cpath transform='' d='M149.8 345.2 118.4 389.8 149.8 434.4 181.2 389.8z'/%3E%3Crect stroke-width='14.080000000000002' transform='' x='1039' y='709' width='100' height='100'/%3E%3Cpath transform='' d='M1426.8 132.4 1405.7 168.8 1363.7 168.8 1342.7 132.4 1363.7 96 1405.7 96z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "contain",
            }}
          >
            <Box
              component={"img"}
              src={"https://assets.maccarianagency.com/backgrounds/img1.jpg"}
              alt="..."
              width={160}
              height={160}
              marginLeft={"calc(60% - 160px)"}
              zIndex={3}
              borderRadius={"100%"}
              boxShadow={4}
              data-aos={"fade-up"}
              sx={{
                objectFit: "cover",
                filter: theme.palette.mode === "dark" ? "brightness(0.5)" : "none",
              }}
            />
            <Box
              component={"img"}
              width={200}
              height={200}
              src={"https://assets.maccarianagency.com/backgrounds/img2.jpg"}
              alt="..."
              marginTop={"-8%"}
              zIndex={2}
              borderRadius={"100%"}
              boxShadow={4}
              data-aos={"fade-up"}
              sx={{
                objectFit: "cover",
                filter: theme.palette.mode === "dark" ? "brightness(0.5)" : "none",
              }}
            />
            <Box
              component={"img"}
              width={300}
              height={300}
              src={"https://assets.maccarianagency.com/backgrounds/img4.jpg"}
              alt="..."
              marginTop={"-20%"}
              marginLeft={"calc(100% - 300px)"}
              zIndex={1}
              borderRadius={"100%"}
              boxShadow={4}
              data-aos={"fade-up"}
              sx={{
                objectFit: "cover",
                filter: theme.palette.mode === "dark" ? "brightness(0.5)" : "none",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
