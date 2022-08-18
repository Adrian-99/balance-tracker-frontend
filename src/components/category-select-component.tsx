import { Autocomplete, Checkbox, Chip, createTheme, SxProps, TextField, Theme, ThemeProvider, useTheme } from "@mui/material";
import { plPL } from "@mui/material/locale";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Category from "../data/category";
import { useUtils } from "../hooks/utils.hook";

interface IProps {
    formFieldName: string;
    control: Control<any, any>;
    label: string;
    categories: Category[];
    multiple?: boolean;
    autoSubmit?: boolean;
    submitFunction?: () => void;
    size?: "small" | "medium";
    sx?: SxProps<Theme>;
}

const CategorySelectComponent: React.FC<IProps> = ({ formFieldName, control, label, categories, multiple,
        autoSubmit, submitFunction, size, sx }) => {
    const { t } = useTranslation();
    const { renderCategory } = useUtils();

    const THEME = createTheme(useTheme(), plPL);

    const triggerAutoSubmit = () => {
        if (autoSubmit && submitFunction) {
            submitFunction();
        }
    }

    return (
        <ThemeProvider theme={THEME}>
            <Controller
                name={formFieldName}
                control={control}
                render={({ field: { value, onChange }}) => 
                    <Autocomplete
                        options={categories}
                        multiple={multiple}
                        disableCloseOnSelect={multiple}
                        autoHighlight
                        renderInput={params =>
                            <TextField {...params} size={size} label={label} />
                        }
                        renderOption={(props, option, { selected }) =>
                            <li {...props}>
                                { multiple && 
                                    <Checkbox checked={selected} size={size} />
                                }
                                { renderCategory(option) }
                            </li>
                        }
                        getOptionLabel={option => t("categories." + option.keyword)}
                        limitTags={2}
                        getLimitTagsText={more => <Chip label={`+${more}`} size={size} />}
                        size={size}
                        sx={sx}
                        value={categories.filter(c => Array.isArray(value) ? value.includes(c.keyword) : value === c.keyword)}
                        onChange={(event, value) => {
                            let convertedValue: string[] = [];
                            if (value) {
                                if (Array.isArray(value)) {
                                    convertedValue = value.map(c => c.keyword);
                                } else {
                                    convertedValue.push(value.keyword);
                                }
                            }
                            onChange({...event, target: {...event.target, value: convertedValue}});
                            triggerAutoSubmit();
                        }}
                    />
                }
            />
        </ThemeProvider>
    );
}

export default CategorySelectComponent;