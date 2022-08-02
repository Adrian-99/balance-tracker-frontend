import { Search as SearchIcon } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
    label: string,
    useFormRegister: UseFormRegisterReturn,
    onSubmit: () => void,
    size?: "small" | "medium"
}

const SearchFieldComponent: React.FC<IProps> = ({ label, useFormRegister, onSubmit, size }) => {
    const { t } = useTranslation();

    return (
        <FormControl variant="outlined" size={size}>
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
            />
        </FormControl>
    );
}

export default SearchFieldComponent;