import { Autocomplete, Checkbox, Chip, createTheme, SxProps, TextField, Theme, ThemeProvider, useTheme } from "@mui/material";
import { plPL } from "@mui/material/locale";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface FormAutocompleteProps<T> {
    formFieldName: string;
    control: Control<any, any>;
    label: string;
    options: T[];
    required?: boolean;
    multiple?: boolean;
    autoSubmit?: boolean;
    submitFunction?: () => void;
    size?: "small" | "medium";
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}

interface IProps<T> extends FormAutocompleteProps<T> {
    renderOption: (option: T) => JSX.Element;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => any;
}

const FormAutocompleteComponent = <T extends unknown>(componentProps: IProps<T>) => {
    const { t } = useTranslation();
    const THEME = createTheme(useTheme(), plPL);

    const triggerAutoSubmit = () => {
        if (componentProps.autoSubmit && componentProps.submitFunction) {
            componentProps.submitFunction();
        }
    }

    return (
        <ThemeProvider theme={THEME}>
            <Controller
                name={componentProps.formFieldName}
                control={componentProps.control}
                rules={{ ...(componentProps.required && { required: t("validation.required") as string })}}
                render={({ field: { value, onChange }, fieldState: { error }}) => 
                    <Autocomplete
                        options={componentProps.options}
                        multiple={componentProps.multiple}
                        disableCloseOnSelect={componentProps.multiple}
                        autoHighlight
                        renderInput={params =>
                            <TextField {...params}
                                size={componentProps.size}
                                label={componentProps.required && !componentProps.label.endsWith("*") ?
                                    componentProps.label + " *" :
                                    componentProps.label
                                }
                                error={error !== undefined}
                                helperText={error?.message}
                            />
                        }
                        renderOption={(props, option, { selected }) =>
                            <li {...props}>
                                { componentProps.multiple && 
                                    <Checkbox checked={selected} size={componentProps.size} />
                                }
                                { componentProps.renderOption(option) }
                            </li>
                        }
                        getOptionLabel={componentProps.getOptionLabel}
                        limitTags={2}
                        getLimitTagsText={more => <Chip label={`+${more}`} size={componentProps.size} />}
                        size={componentProps.size}
                        fullWidth={componentProps.fullWidth}
                        sx={componentProps.sx}
                        value={
                            componentProps.multiple ?
                                componentProps.options.filter(o => Array.isArray(value) ?
                                    value.includes(componentProps.getOptionValue(o)) :
                                    value === componentProps.getOptionValue(o)
                                ) :
                                componentProps.options.find(o => value === componentProps.getOptionValue(o)) || null
                        }
                        onChange={(event, value) => {
                            let convertedValue: string[] | string | undefined;
                            if (componentProps.multiple) {
                                convertedValue = [];
                                if (value) {
                                    if (Array.isArray(value)) {
                                        convertedValue = value.map(componentProps.getOptionValue);
                                    } else {
                                        convertedValue.push(componentProps.getOptionValue(value));
                                    }
                                }
                            } else {
                                if (value && !Array.isArray(value)) {
                                    convertedValue = componentProps.getOptionValue(value);
                                } else {
                                    convertedValue = undefined;
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

export default FormAutocompleteComponent;