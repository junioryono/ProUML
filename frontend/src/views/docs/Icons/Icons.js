/* eslint-disable react/no-unescaped-entities */

import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "common/Container";

const Icons = () => {
  return (
    <Box>
      <Container>
        <Box>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            Icons
          </Typography>
          <Typography gutterBottom>There two types of icons used in the theme:</Typography>
          <ul>
            <Box component={"li"} marginY={1 / 2} marginX={0}>
              <Typography>
                Hero Icons: Please{" "}
                <Link href={"https://heroicons.com/"} target={"_blank"}>
                  visit here
                </Link>
              </Typography>
            </Box>
            <Box component={"li"} marginY={1 / 2} marginX={0}>
              <Typography>
                Material-UI Icons: Please{" "}
                <Link href={"https://material-ui.com/components/material-icons/"} target={"_blank"}>
                  visit here
                </Link>
              </Typography>
            </Box>
          </ul>
        </Box>
      </Container>
    </Box>
  );
};

export default Icons;
