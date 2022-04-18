import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={0} alignItems="center" justifyContent="center">
            <Grid item xs={12} lg={8}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h2" sx={{ textAlign: "center" }}>{t("appName")}</Typography>
                        <Typography variant="h5" sx={{ textAlign: "center", mb: "16px" }}>{t("pages.home.text")}</Typography>
                        <Box sx={{ textAlign: "center" }}>
                            <Button variant="contained" disableElevation to="/login" component={Link} sx={{ mx: "8px" }}>
                                {t("menu.login")}
                            </Button>
                            <Button variant="outlined" to="/register" component={Link} sx={{ mx: "8px" }}>
                                {t("menu.register")}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default HomePage;