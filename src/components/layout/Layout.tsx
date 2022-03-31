import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuItem from './MenuItem';
import { List as HistoryIcon,
    StackedLineChart as StatisticsIcon,
    Login as LoginIcon,
    HowToReg as RegisterIcon
} from '@mui/icons-material'
import { Drawer, DrawerHeader } from './LayoutHelpers';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

interface IProps { }

const Layout: React.FC<IProps> = ({ children }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [userLoggedIn, setUserLoggedIn] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar menuOpen={open} userLoggedIn={userLoggedIn} handleDrawerOpen={handleDrawerOpen} />
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    { userLoggedIn ? 
                        <>
                            <MenuItem menuOpen={open} icon={<HistoryIcon />} label={t("menu.history")} path="/history" />
                            <MenuItem menuOpen={open} icon={<StatisticsIcon />} label={t("menu.statistics")} path="/statistics" />
                        </>
                        :
                        <>
                            <MenuItem menuOpen={open} icon={<LoginIcon />} label={t("menu.login")} path="/login" />
                            <MenuItem menuOpen={open} icon={<RegisterIcon />} label={t("menu.register")} path="/register" />
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

export default Layout
