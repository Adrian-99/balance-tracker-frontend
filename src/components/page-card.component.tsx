import { MoreVert as MoreIcon } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Divider, Grid, IconButton, Menu, MenuItem, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import React from "react";

interface IProps {
    title: string;
    width?: number;
    actions?: {
        name: string;
        action: () => void;
    }[];
}

const PageCardComponent: React.FC<IProps> = ({ title, width, actions, children }) => {
    const theme = useTheme();
    const isSMScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMDScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [moreActionsAnchor, setMoreActionsAnchor] = React.useState<null | HTMLElement>(null);
    const moreActionsOpen = Boolean(moreActionsAnchor);

    const handleMoreActionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMoreActionsAnchor(event.currentTarget);
    };

    const handleMoreActionsClose = (callback?: (() => void) | undefined) => {
        if (callback) {
            callback();
        }
        setMoreActionsAnchor(null);
    };

    return (
        <Grid container spacing={0} alignItems="center" justifyContent="center">
            <Grid item xs={12} lg={width ?? 8}>
                <Card variant="outlined">
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5">{title}</Typography>
                            {actions && actions.length > 0 &&
                                <Box>
                                    {(isSMScreen || (isMDScreen && actions.length > 1) || actions.length > 2) &&
                                        <>
                                            <IconButton sx={{ mx: "4px" }} onClick={handleMoreActionsClick}>
                                                <MoreIcon />
                                            </IconButton>
                                            <Menu anchorEl={moreActionsAnchor}
                                                open={moreActionsOpen}
                                                onClose={() => handleMoreActionsClose()}>
                                                {actions.slice(isSMScreen ? 0 : isMDScreen ? 1 : 2).map(action => 
                                                    <MenuItem key={action.name} onClick={() => handleMoreActionsClose(action.action)}>{action.name}</MenuItem>
                                                )}
                                            </Menu>
                                        </>
                                    }
                                    {!isMDScreen && actions.length > 1 &&
                                        <Button variant="outlined" onClick={actions[1].action} sx={{ mx: "4px" }}>{actions[1].name}</Button>
                                    }
                                    {!isSMScreen && 
                                        <Button variant="contained" disableElevation onClick={actions[0].action} sx={{ mx: "4px" }}>{actions[0].name}</Button>
                                    }
                                </Box>
                            }
                        </Box>
                        <Divider sx={{ my: '16px' }} />
                        { children }
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default PageCardComponent;