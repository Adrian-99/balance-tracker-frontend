import React, { useState } from 'react';
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { useAuthentication } from '../../hooks/authentication.hook';
import { useUserService } from '../../hooks/user-service.hook';
import { useCustomToast } from '../../hooks/custom-toast.hook';

interface UserOption {
    name: string;
    action: () => void;
}

interface IProps {
    isMenuOpen: boolean,
    isSmallScreen: boolean,
    isUserLoggedIn: boolean,
    setMenuOpen: (open: boolean) => void
}

const NavbarComponent: React.FC<IProps> = ({ isMenuOpen, isSmallScreen, isUserLoggedIn, setMenuOpen }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { clearUserInfo, getUsername } = useAuthentication();
    const { revokeUserTokens } = useUserService();
    const { successToast, errorToast } = useCustomToast();
    
    const USER_OPTIONS: UserOption[] = [
        { 
            name: t("navbar.user.profile"),
            action: () => {
                handleCloseUserMenu();
                navigate("/user-profile");
            }
        }, 
        {
            name: t("navbar.user.changePassword"),
            action: () => {
                handleCloseUserMenu();
                navigate("/change-password");
            }
        },
        {
            name: t("navbar.user.logout"),
            action: () => {
                revokeUserTokens()
                    .then(() => {
                        clearUserInfo();
                        successToast(t("navbar.logout.successToast"));
                        navigate("/");
                    })
                    .catch(() => {
                        errorToast();
                    })
                    .finally(() => {
                        handleCloseUserMenu();
                    });
            }
        }
    ];
    
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="fixed" open={!isSmallScreen && isMenuOpen}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => setMenuOpen(!(isSmallScreen && isMenuOpen))}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(!isSmallScreen && isMenuOpen && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Link variant="h6" noWrap color="inherit" underline="none" to='/' component={RouterLink}>
                    {t("appName")}
                </Link>
                {isUserLoggedIn &&
                    <>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title={t("navbar.user.tooltip") as string}>
                                <Button color="inherit" onClick={handleOpenUserMenu}>{ getUsername() }</Button>
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
                                {USER_OPTIONS.map((option) => (
                                    <MenuItem key={option.name} onClick={option.action}>
                                        <Typography textAlign="center">{option.name}</Typography>
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
