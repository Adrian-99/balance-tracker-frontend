import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import React from "react";

interface IProps {
    title: string;
    width?: number;
}

const PageCardComponent: React.FC<IProps> = ({ title, width, children }) => {
    return (
        <Grid container spacing={0} alignItems="center" justifyContent="center">
            <Grid item xs={12} lg={width ?? 8}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5">{title}</Typography>
                        <Divider sx={{ my: '16px' }} />
                        { children }
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default PageCardComponent;