/* eslint-disable react/jsx-key */
/* eslint-disable quotes */
/* eslint-disable react/no-unescaped-entities */

import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { colors } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "common/Container";
import Chart1 from "svg/illustrations/Chart1";
import Chart2 from "svg/illustrations/Chart2";
import Chart3 from "svg/illustrations/Chart3";
import Chart4 from "svg/illustrations/Chart4";
import City from "svg/illustrations/City";
import CloudHosting from "svg/illustrations/CloudHosting";
import CreditCards from "svg/illustrations/CreditCards";
import CreditCards2 from "svg/illustrations/CreditCards2";
import Cycling from "svg/illustrations/Cycling";
import Designer from "svg/illustrations/Designer";
import Globe from "svg/illustrations/Globe";
import Innovation from "svg/illustrations/Innovation";
import NotFound from "svg/illustrations/NotFound";
import TeamWorking from "svg/illustrations/TeamWorking";
import Travel from "svg/illustrations/Travel";
import Rocket from "svg/illustrations/Rocket";

const Illustrations = () => {
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
        <Box>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            Illustrations
          </Typography>
          <Typography
            gutterBottom
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            The illustrations in the theme are simple React components stored in <code>src/svg/illustrations</code>. They can be used as normail React components. Form
            example:
          </Typography>
          <Box marginY={2}>
            {renderCodeBlock(`import Box from '@mui/material/Box';
import CreditCardsIllustration from 'svg/illustrations/CreditCards';

<Box height={'100%'} width={'100%'} maxWidth={600}>
  <CreditCardsIllustration width={'100%'} height={'100%'} />
</Box>`)}
          </Box>
          <Typography gutterBottom>
            Illustrations are created using{" "}
            <Link href={"https://www.manypixels.co/gallery"} target={"_blank"}>
              Many Pixels
            </Link>
          </Typography>
        </Box>
      </Container>
      <Container paddingTop={"0 !important"}>
        <Grid container spacing={4}>
          {[
            <City width={"100%"} height={"100%"} />,
            <Rocket width={"100%"} height={"100%"} />,
            <CloudHosting width={"100%"} height={"100%"} />,
            <CreditCards width={"100%"} height={"100%"} />,
            <CreditCards2 width={"100%"} height={"100%"} />,
            <Cycling width={"100%"} height={"100%"} />,
            <Designer width={"100%"} height={"100%"} />,
            <Globe width={"100%"} height={"100%"} />,
            <Innovation width={"100%"} height={"100%"} />,
            <NotFound width={"100%"} height={"100%"} />,
            <TeamWorking width={"100%"} height={"100%"} />,
            <Travel width={"100%"} height={"100%"} />,
            <Chart1 width={"100%"} height={"100%"} />,
            <Chart2 width={"100%"} height={"100%"} />,
            <Chart3 width={"100%"} height={"100%"} />,
            <Chart4 width={"100%"} height={"100%"} />,
          ].map((item, i) => (
            <Grid item alignItems={"center"} justifyContent={"center"} key={i} xs={12} sm={6} md={4}>
              <Box component={Card} width={"100%"} height={"100%"} borderRadius={4} boxShadow={3}>
                <Box component={CardContent} padding={4} display={"flex"} alignItems={"center"} height={"100%"}>
                  {item}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Illustrations;
