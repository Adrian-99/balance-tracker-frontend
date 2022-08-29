import { Search as SearchIcon } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, SxProps, Theme, Tooltip } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
    label: string;
    useFormRegister: UseFormRegisterReturn;
    onSubmit: () => void;
    size?: "small" | "medium";
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}

const SearchFieldComponent: React.FC<IProps> = ({ label, useFormRegister, onSubmit, size, fullWidth, sx }) => {
    const { t } = useTranslation();

    return (
        <FormControl variant="outlined" size={size} fullWidth={fullWidth}>
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                type="text"
                {...useFormRegister}
                endAdornment={
                    <InputAdornment position="end">
                        <Tooltip title={t("general.search") as string} arrow>
                            <IconButton
                                onClick={onSubmit}
                                edge="end"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                }
                label={label}
                size={size}
                sx={sx}
            />
        </FormControl>
    );
}

export default SearchFieldComponent;