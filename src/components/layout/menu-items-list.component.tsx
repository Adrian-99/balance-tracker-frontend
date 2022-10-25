import { List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import React from 'react';
import { Home as HomeIcon,
    List as HistoryIcon,
    LocalOffer as TagsIcon,
    StackedLineChart as StatisticsIcon,
    Login as LoginIcon,
    HowToReg as RegisterIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, matchPath, useLocation } from 'react-router-dom';

interface MenuItemProps {
    icon: JSX.Element,
    label: string,
    path: string
}

interface IProps {
    isMenuOpen: boolean,
    setMenuOpen: (open: boolean) => void,
    isSmallScreen: boolean,
    isUserLoggedIn: boolean,
}

const MenuItemsListComponent: React.FC<IProps> = ({ isMenuOpen, setMenuOpen, isSmallScreen, isUserLoggedIn }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const menuItemsProps: MenuItemProps[] = isUserLoggedIn ?
        [ 
            { icon: <HistoryIcon />, label: t("menu.history"), path: "/history" },
            { icon: <TagsIcon />, label: t("menu.tags"), path: "/tags" },
            { icon: <StatisticsIcon />, label: t("menu.statistics"), path: "/statistics" }
        ]
        :
        [
            { icon: <HomeIcon />, label: t("menu.home"), path: "/" },
            { icon: <LoginIcon />, label: t("menu.login"), path: "/login" },
            { icon: <RegisterIcon />, label: t("menu.register"), path: "/register" }
        ];

    return (
        <List sx={{ mt: isSmallScreen ? "56px" : "0px" }}>
            {menuItemsProps.map(menuItem => (
                <Tooltip title={menuItem.label} placement='right' arrow={true} disableHoverListener={isMenuOpen} key={menuItem.path}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isMenuOpen ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        selected={matchPath(menuItem.path, pathname) != null}
                        to={menuItem.path} component={Link}
                        onClick={() => isSmallScreen && setMenuOpen(false)}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isMenuOpen ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            {menuItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={menuItem.label} sx={{ opacity: isSmallScreen || isMenuOpen ? 1 : 0 }} />
                    </ListItemButton>
                </Tooltip>
            ))
            }
        </List>
    );
}

export default MenuItemsListComponent;
