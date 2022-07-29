/* eslint-disable react/no-unescaped-entities */

import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "@mui/material/styles";
import { colors } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "common/Container";

const QuickStart = () => {
  const theme = useTheme();

  const renderCodeBlock = (code = "", language = "jsx") => {
    return (
      <Box
        component={SyntaxHighlighter}
        language={language}
        style={vs2015}
        padding={`${theme.spacing(2)} !important`}
        borderRadius={2}
        margin={`${theme.spacing(0)} !important`}
      >
        {code}
      </Box>
    );
  };

  return (
    <Box>
      <Container>
        <Box marginBottom={4}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
            }}
          >
            Quick Start
          </Typography>
        </Box>
        <Box marginBottom={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            1. Requirements
          </Typography>
          <Typography>
            Before proceeding you'll need to have the latest stable{" "}
            <Link component={"a"} href={"https://nodejs.org/en/"} target={"blank"}>
              nodejs
            </Link>
            .
          </Typography>
        </Box>
        <Box marginBottom={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            2. Install
          </Typography>
          <Typography>
            Open the project folder and install its dependencies. You can use any package manager you want. We recommend{" "}
            <Link component={"a"} href={"https://yarnpkg.com/"} target={"blank"}>
              yarn
            </Link>
            . But you can use also{" "}
            <Link component={"a"} href={"https://www.npmjs.com/"} target={"blank"}>
              npm
            </Link>
            .
          </Typography>
          <Box marginTop={2}>
            {renderCodeBlock(
              `cd project-folder
yarn install`,
              "bash",
            )}
          </Box>
        </Box>
        <Box marginBottom={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            3. Start
          </Typography>
          <Typography
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            Once the installation is done, you can now start your app by running <code>npm start</code> or <code>yarn start</code>.
          </Typography>
          <Box marginY={2}>{renderCodeBlock("yarn start", "bash")}</Box>
          <Typography
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            This starts a local webserver at <code>http://localhost:3000</code> and auto detect file changes:
          </Typography>
          <Box marginY={2}>
            {renderCodeBlock(
              `Compiled successfully!

You can now view webbee-js--react-scripts in the browser. in the browser.

Local:            http://localhost:3000
On Your Network:  http://192.168.1.6:3000

Note that the development build is not optimized.
To create a production build, use npm run build.`,
              "bash",
            )}
          </Box>
        </Box>
        <Box marginBottom={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            3. Build
          </Typography>
          <Box marginY={2}>{renderCodeBlock("yarn build", "bash")}</Box>
          <Typography
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            You can also use <code>npm run build</code>.
          </Typography>
          <Box marginTop={2}>
            <Box padding={1.5} borderLeft={`${theme.spacing(0.5)} solid ${theme.palette.divider}`}>
              <Typography variant={"subtitle2"}>
                This project doesn’t handle backend logic or databases; it is just a frontend, so you can use it with any backend you want.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default QuickStart;
