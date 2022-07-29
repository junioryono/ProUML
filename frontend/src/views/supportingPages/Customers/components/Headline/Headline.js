/* eslint-disable react/no-unescaped-entities */

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Headline = () => {
  const theme = useTheme();
  return (
    <Box>
      <Box>
        <Box marginBottom={2}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: theme.palette.common.white,
            }}
          >
            You're in good company.
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h2"
            color={"primary"}
            sx={{
              fontWeight: 700,
            }}
          >
            Join millions of businesses today.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Headline;
