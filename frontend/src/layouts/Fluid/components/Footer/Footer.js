import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import WebbeeLogo from "svg/logos/Webbee";

const Footer = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} width={"100%"} flexDirection={{ xs: "column", sm: "row" }}>
        <Box display={"flex"} component="a" underline="none" href="/" title="webbee" height={24} width={35}>
          <WebbeeLogo height={"100%"} width={"100%"} />
        </Box>
        <Box display="flex" flexWrap={"wrap"} alignItems={"center"}>
          <Box marginTop={1} marginRight={2}>
            <Link underline="none" component="a" href="/" color="textPrimary" variant={"subtitle2"}>
              Home
            </Link>
          </Box>
          <Box marginTop={1} marginRight={2}>
            <Link underline="none" component="a" href="/docs-introduction" color="textPrimary" variant={"subtitle2"}>
              Documentation
            </Link>
          </Box>
          <Box marginTop={1}>
            <Button variant="outlined" color="primary" component="a" target="blank" href="https://material-ui.com/store/items/webbee-landing-page/" size="small">
              Purchase now
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12}>
      <Typography align={"center"} variant={"subtitle2"} color="textSecondary" gutterBottom>
        &copy; Webbee. 2021, Maccarian. All rights reserved
      </Typography>
      <Typography align={"center"} variant={"caption"} color="textSecondary" component={"p"}>
        When you visit or interact with our sites, services or tools, we or our authorised service providers may use cookies for storing information to help provide you
        with a better, faster and safer experience and for marketing purposes.
      </Typography>
    </Grid>
  </Grid>
);

export default Footer;
