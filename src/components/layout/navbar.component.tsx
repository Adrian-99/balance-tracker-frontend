import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { AppBar } from './layout-helpers';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

interface IProps {
    menuOpen: boolean,
    userLoggedIn: boolean,
    handleDrawerOpen: () => void
}

const NavbarComponent: React.FC<IProps> = ({ menuOpen, userLoggedIn, handleDrawerOpen }) => {
    const { t } = useTranslation();
    const userOptions = [t("navbar.user.editProfile"), t("navbar.user.changePassword"), t("navbar.user.logout")];

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="fixed" open={menuOpen}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(menuOpen && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Link variant="h6" noWrap color="inherit" underline="none" to='/' component={RouterLink}>
                    {t("appName")}
                </Link>
                {userLoggedIn &&
                    <>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title={t("navbar.user.tooltip") as string}>
                                <Button color="inherit" onClick={handleOpenUserMenu}>jan_kowalski</Button>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
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
                                {userOptions.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </>
                }
            </Toolbar>
        </AppBar>
    );
};
export default NavbarComponent;
