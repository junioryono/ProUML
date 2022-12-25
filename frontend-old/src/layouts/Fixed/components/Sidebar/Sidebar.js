import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { SidebarNav } from "./components";

const Sidebar = (props) => {
  const { pages, open, variant, onClose } = props;

  return (
    <Drawer
      anchor="left"
      onClose={() => onClose()}
      open={open}
      variant={variant}
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: 256,
          top: { xs: 0, md: 64 },
          height: { xs: "100%", md: "calc(100% - 64px)" },
        },
      }}
    >
      <Box padding={2}>
        <SidebarNav pages={pages} onClose={onClose} />
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired,
};

export default Sidebar;
