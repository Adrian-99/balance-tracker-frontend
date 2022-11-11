import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { plPL } from "@mui/material/locale";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AutocompleteComponent, { AutocompleteProps } from "./autocomplete.component";

export interface FormAutocompleteProps<T> extends AutocompleteProps<T> {
    formFieldName: string;
    control: Control<any, any>;
    keepSelectOrder?: boolean;
    autoSubmit?: boolean;
    submitFunction?: () => void;
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
    };

    const evaluateComponentValue = (value: any): T | T[] | null => {
        if (componentProps.multiple) {
            const valueIsArray = Array.isArray(value);
            if (componentProps.keepSelectOrder && valueIsArray) {
                let values: T[] = [];
                value.forEach(v => {
                    let option = componentProps.options.find(o => v === componentProps.getOptionValue(o));
                    if (option) {
                        values.push(option);
                    }
                })
                return values;
            } else {
                return componentProps.options.filter(o => valueIsArray ?
                    value.includes(componentProps.getOptionValue(o)) :
                    value === componentProps.getOptionValue(o)
                );
            }
        } else {
            return componentProps.options.find(o => value === componentProps.getOptionValue(o)) || null;
        }
    };

    return (
        <ThemeProvider theme={THEME}>
            <Controller
                name={componentProps.formFieldName}
                control={componentProps.control}
                rules={{ ...(componentProps.required && { required: t("validation.required") as string })}}
                render={({ field: { value, onChange }, fieldState: { error }}) =>
                    <AutocompleteComponent
                        label={componentProps.label}
                        options={componentProps.options}
                        required={componentProps.required}
                        multiple={componentProps.multiple}
                        limitTags={componentProps.limitTags}
                        size={componentProps.size}
                        fullWidth={componentProps.fullWidth}
                        sx={componentProps.sx}
                        value={evaluateComponentValue(value)}
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
                        error={error}
                        renderOption={componentProps.renderOption}
                        getOptionLabel={componentProps.getOptionLabel}
                    />
                }
            />
        </ThemeProvider>
    );
}

export default FormAutocompleteComponent;