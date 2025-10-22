import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Recipes", path: "/recipes" },
  { name: "Categories", path: "/categories" }
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Mobile Navigation Drawer
  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        background: 'linear-gradient(135deg, #ff6f61 0%, #ff8e53 100%)',
        color: 'white',
        position: 'relative'
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FlavorCraft
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ padding: '1rem 0' }}>
        {navItems.map((item, index) => (
          <ListItem
            key={index}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              margin: '0.5rem 1rem',
              borderRadius: '12px',
              background: isActiveRoute(item.path)
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.25)',
                transform: 'translateX(8px)',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Footer in drawer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.75rem'
          }}
        >
          Craft delicious recipes with love ❤️
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed"
        sx={{ 
          background: 'linear-gradient(135deg, #ff6f61 0%, #ff8e53 100%)',
          boxShadow: '0 2px 20px rgba(255, 111, 97, 0.3)',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ 
          padding: { xs: '0.5rem 1rem', sm: '1rem 2rem' },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: { xs: '64px', sm: '70px' }
        }}>
          {/* Logo/Brand */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              FlavorCraft
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {navItems.map((item, index) => (
                <Link
                  to={item.path}
                  key={index}
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: isActiveRoute(item.path)
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = isActiveRoute(item.path)
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                width: 48,
                height: 48,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'transparent',
            border: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '70px' } }} />
    </>
  );
};

export default Navbar;