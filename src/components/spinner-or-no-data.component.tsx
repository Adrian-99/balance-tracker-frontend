import { EventBusy as NoDataIcon } from "@mui/icons-material";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";

interface IProps {
    showSpinner: boolean;
    showNoData: boolean;
}

const SpinnerOrNoDataComponent: React.FC<IProps> = ({ showSpinner, showNoData }) => {
    const { t } = useTranslation();

    if (showSpinner) {
        return <CircularProgress size={64} sx={{ display: "block", mx: "auto", my: "16px" }} />;
    } else if (showNoData) {
        return (
            <Box display="flex" justifyContent="center" flexWrap="wrap">
                <NoDataIcon sx={{ flexBasis: "100%", mt: "8px" }} fontSize="large" />
                <Typography variant="h5">{t("general.noData")}</Typography>
            </Box>
        );
    } else {
        return <></>;
    }
}

export default SpinnerOrNoDataComponent;
