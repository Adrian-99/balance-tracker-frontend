import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuItemComponent from './menu-item.component';
import { Home as HomeIcon,
    List as HistoryIcon,
    StackedLineChart as StatisticsIcon,
    Login as LoginIcon,
    HowToReg as RegisterIcon
} from '@mui/icons-material'
import { Drawer, DrawerHeader } from './layout-helpers';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NavbarComponent from './navbar.component';
import { useAuthentication } from '../../hooks/authentication.hook';

interface IProps { }

const LayoutComponent: React.FC<IProps> = ({ children }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    
    const { isUserLoggedIn } = useAuthentication();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <NavbarComponent menuOpen={open} userLoggedIn={isUserLoggedIn()} handleDrawerOpen={handleDrawerOpen} />
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    { isUserLoggedIn() ? 
                        <>
                            <MenuItemComponent menuOpen={open} icon={<HistoryIcon />} label={t("menu.history")} path="/history" />
                            <MenuItemComponent menuOpen={open} icon={<StatisticsIcon />} label={t("menu.statistics")} path="/statistics" />
                        </>
                        :
                        <>
                            <MenuItemComponent menuOpen={open} icon={<HomeIcon />} label={t("menu.home")} path="/" />
                            <MenuItemComponent menuOpen={open} icon={<LoginIcon />} label={t("menu.login")} path="/login" />
                            <MenuItemComponent menuOpen={open} icon={<RegisterIcon />} label={t("menu.register")} path="/register" />
                        </>
                    }
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}

export default LayoutComponent
