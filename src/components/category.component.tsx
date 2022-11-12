import { SvgIcon, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import Category from "../data/category";

interface IProps {
    category: Category;
    typographyVariant?: "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "inherit" | "subtitle1" | "subtitle2" | "body1" | "body2" | "overline";
}

const CategoryComponent: React.FC<IProps> = ({ category, typographyVariant }) => {
    const { t } = useTranslation();

    return (
        <Box display="flex" flexWrap="wrap" columnGap="4px" alignItems="center">
            <SvgIcon sx={{ color: category.iconColor }}>
                <path d={category.icon}></path>
            </SvgIcon>
            <Typography variant={typographyVariant}>
                { t("categories." + category.keyword) }
            </Typography>
        </Box>
    );
}

export default CategoryComponent;