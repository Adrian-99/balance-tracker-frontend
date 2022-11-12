import { TrendingUp as IncomeIcon, TrendingDown as CostIcon } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { EntryType } from "../data/statistics-enums";
import { useUtils } from "../hooks/utils.hook";

interface IProps {
    entryType: EntryType;
    typographyVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | "inherit";
}

const EntryTypeComponent: React.FC<IProps> = ({ entryType, typographyVariant }) => {
    const { t } = useTranslation();
    const { firstLetterToLower } = useUtils();

    const entryTypeToLower = firstLetterToLower(entryType);

    let icon: JSX.Element = <></>;

    switch (entryTypeToLower) {
        case EntryType.INCOME:
            icon = <IncomeIcon sx={{ color: "#37cf08" }} />
            break;

        case EntryType.COST:
            icon = <CostIcon sx={{ color: "#eb0e0e" }} />
            break;
    }

    return (
        <Box display="flex" flexWrap="wrap" columnGap="4px" alignItems="center">
            { icon }
            <Typography variant={typographyVariant}>
                { t("general.statistics.entryTypeValue." + entryTypeToLower) }
            </Typography>
        </Box>
    );
}

export default EntryTypeComponent;