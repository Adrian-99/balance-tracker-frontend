import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import React from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'

interface IProps {
    menuOpen: boolean,
    icon: JSX.Element,
    label: string,
    path: string
}

const MenuItem: React.FC<IProps> = ({ menuOpen, icon, label, path }) => {
    const { pathname } = useLocation();

    return (
        <Tooltip title={label} placement='right' arrow={true} disableHoverListener={menuOpen}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: menuOpen ? 'initial' : 'center',
                    px: 2.5,
                }}
                selected={matchPath(path, pathname) != null}
                to={path} component={Link}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: menuOpen ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label} sx={{ opacity: menuOpen ? 1 : 0 }} />
            </ListItemButton>
        </Tooltip>
    )
}

export default MenuItem