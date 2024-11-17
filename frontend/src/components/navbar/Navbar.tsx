import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from 'react-router-dom';

const pages = ['Reservations', 'Tournaments', 'Objects'];
const clientSettings = ['Profile', 'Logout'];
const employeeSettings = ['Dashboard', 'Logout'];
const adminSettings = ['Dashboard', 'Logout'];

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#111827' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link to="/" className="flex items-center">
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => {
                                const pageLink = page.toLowerCase();

                                return (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>
                                            <Link to={`${pageLink}`}>{page}</Link>
                                        </Typography>
                                    </MenuItem>
                                );
                            })}
                        </Menu>
                    </Box>
                    <Link to="/" className="flex justify-start items-start">
                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => {
                            const pageLink = page.toLowerCase();

                            return (
                                <Link to={`${pageLink}`}>
                                    <Button
                                        key={page}
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page}
                                    </Button>
                                </Link>
                            );
                        })}
                    </Box>
                    {localStorage.getItem("token") ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px', padding: "100px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {localStorage.getItem("role") === "CLIENT" && (
                                    clientSettings.map((setting) => (
                                        <MenuItem
                                            key={setting}
                                            onClick={
                                                setting === 'Logout' ? handleLogout : handleCloseUserMenu
                                            }
                                        >
                                            <Typography sx={{ textAlign: 'center' }}>
                                                {setting}
                                            </Typography>
                                        </MenuItem>
                                    ))
                                )}
                                {localStorage.getItem("role") === "ADMIN" && (
                                    adminSettings.map((setting) => (
                                        <MenuItem
                                            key={setting}
                                            onClick={
                                                setting === 'Logout' ? handleLogout : handleCloseUserMenu
                                            }
                                        >
                                            <Typography sx={{ textAlign: 'center' }}>
                                                {setting}
                                            </Typography>
                                        </MenuItem>
                                    ))
                                )}
                                {localStorage.getItem("role") === "EMPLOYEE" && (
                                    employeeSettings.map((setting) => (
                                        <MenuItem
                                            key={setting}
                                            onClick={
                                                setting === 'Logout' ? handleLogout : handleCloseUserMenu
                                            }
                                        >
                                            <Typography sx={{ textAlign: 'center' }}>
                                                {setting}
                                            </Typography>
                                        </MenuItem>
                                    ))
                                )}
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link to="login">LOGIN</Link>
                            </Button>
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link to="register">REGISTER</Link>
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
