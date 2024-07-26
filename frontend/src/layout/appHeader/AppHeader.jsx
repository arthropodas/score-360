import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";

const settings = ["Profile", "Change password"];
const icons = [
  <AccountCircleIcon key="account-circle" />,
  <SettingsIcon key="settings" />,
  <DashboardIcon key="dashboard" />,
];

function AppHeader() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(null);
  const location = useLocation();

  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  const handleMenuItemClick = (setting) => {
    if (currentPage === location.pathname) {
      handleCloseUserMenu();
      return;
    }
    switch (setting) {
      case "Profile":
        handleCloseUserMenu();
        setCurrentPage("/profile");
        navigate("/profile");
        break;
      case "Change password":
        handleCloseUserMenu();
        setCurrentPage("/changePassword");
        navigate("/changePassword");
        break;
      case "Logout":
        logout();
        break;

      default:
        break;
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#bf360c" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsCricketIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Link
            to="/tournament"
            style={{ textDecoration: "none", color: "white" }}
          >
            <Typography
              variant="h6"
              noWrap
              component="a"
              color="black"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Times New Roman",
                fontWeight: 700,

                color: "inherit",
                textDecoration: "none",
              }}
            >
              Score360
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}></Box>
          <SportsCricketIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Score360
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onMouseEnter={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon sx={{ fontSize: 40, color: "white" }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onMouseLeave={handleCloseUserMenu}
              onClick={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleMenuItemClick(setting)}
                >
                  {icons[index]} {/* Icon */}
                  <Typography sx={{ ml: 1 }}> {setting}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={() => logout()}>
                <LogoutIcon key="logout" /> {/* Icon */}
                <Typography sx={{ ml: 1 }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppHeader;
