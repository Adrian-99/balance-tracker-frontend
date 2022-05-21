import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledDrawer, DrawerHeader } from './layout-helpers';
import { Drawer, useTheme } from '@mui/material';
import NavbarComponent from './navbar.component';
import MenuItemsListComponent from './menu-items-list.component';
import { ApplicationContext } from '../application-context.provider';
import { useUtils } from '../../hooks/utils.hook';

const LayoutComponent: React.FC = ({ children }) => {
    const theme = useTheme();
    const { isSmallScreen } = useUtils();
    const [open, setOpen] = useState(false);
    
    const { user: { isUserLoggedIn } } = useContext(ApplicationContext);

    return (
        <Box sx={{ display: 'flex' }}>
            <NavbarComponent isMenuOpen={open} isUserLoggedIn={isUserLoggedIn} isSmallScreen={isSmallScreen} setMenuOpen={setOpen} />
            {isSmallScreen ? 
                <Drawer open={open} onClose={() => setOpen(false)}>
                    <MenuItemsListComponent isMenuOpen={open}
                        setMenuOpen={setOpen}
                        isSmallScreen={isSmallScreen}
                        isUserLoggedIn={isUserLoggedIn}
                    />
                </Drawer>
                :
                <StyledDrawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={() => setOpen(false)}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <MenuItemsListComponent isMenuOpen={open}
                        setMenuOpen={setOpen}
                        isSmallScreen={isSmallScreen}
                        isUserLoggedIn={isUserLoggedIn}
                    />
                </StyledDrawer>
            }
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}

export default LayoutComponent;
