import PropsTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "common/Container";

const BlockItem = ({ versionTitle, date, list }) => (
  <Box>
    <Typography variant="h4" component="h4" sx={{ fontWeight: 700 }}>
      {versionTitle}
    </Typography>
    <Typography
      variant="body2"
      component="p"
      color="textSecondary"
      sx={{
        marginTop: 1,
        marginBottom: 2,
        fontWeight: 700,
      }}
    >
      {date}
    </Typography>
    <ul>
      {list.map((item, i) => (
        <Box component={"li"} key={i} marginY={1 / 2} marginX={0}>
          <Typography variant="body1" component="p">
            {item}
          </Typography>
        </Box>
      ))}
    </ul>
  </Box>
);

BlockItem.propTypes = {
  versionTitle: PropsTypes.string.isRequired,
  date: PropsTypes.string.isRequired,
  list: PropsTypes.array.isRequired,
};

const ChangeLog = () => {
  return (
    <Box>
      <Container>
        <BlockItem
          versionTitle="v2.0.0"
          date="May 28, 2022"
          list={["Update MUI v5", "Update React v18", "Update routing", "Update npm libraries to their latest stable versions", "Code cleanup"]}
        />
        <BlockItem
          versionTitle="v1.3.0"
          date="March 21, 2022"
          list={[
            "Remove `node-sass`",
            "Remove `./src/scss/*.scss` files, as they are no longer used in the theme",
            "Remove `react-typed` as it does not support higher versions of `react`",
            "Replace `react-images` with `react-image-lightbox` as the library is deprecated",
          ]}
        />
        <BlockItem versionTitle="v1.2.0" date="September 28, 2021" list={["Upgrade MUI dependency to v5.0.1"]} />
        <BlockItem
          versionTitle="v1.1.0"
          date="June 21, 2021"
          list={["Material-UI version update", "The <Hidden> component is removed", "The function createMuiTheme was renamed to createTheme"]}
        />
        <BlockItem versionTitle="v1.0.0" date="April 18, 2021" list={["Initial release"]} />
      </Container>
    </Box>
  );
};

export default ChangeLog;
