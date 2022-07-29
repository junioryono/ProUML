/* eslint-disable react/no-unescaped-entities */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box>
      <Typography
        sx={{
          textTransform: "uppercase",
          fontWeight: "medium",
        }}
        gutterBottom
        color={"textSecondary"}
        align={"center"}
      >
        Get Started
      </Typography>
      <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"} color={"currentColor"}>
        Get started with Webbee today
      </Box>
      <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
        Build a beautiful, modern website with flexible, fully customizable, atomic Material-UI components.
      </Typography>
      <Box marginTop={3} display={"flex"} justifyContent={"center"}>
        <Button
          component={"a"}
          href={"https://material-ui.com/store/items/webbee-landing-page/"}
          target={"_blank"}
          variant="contained"
          color="primary"
          size="large"
          endIcon={
            <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          }
        >
          Purchase now
        </Button>
      </Box>
    </Box>
  );
};

export default Footer;
