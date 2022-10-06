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

interface IProps<Option, Value> extends FormAutocompleteProps<Option> {
    renderOption: (option: Option) => JSX.Element;
    getOptionLabel: (option: Option) => string;
    getOptionValue: (option: Option) => Value;
    allowAdding?: boolean;
    getNewOption?: (inputValue: string) => Option;
}

const FormAutocompleteComponent = <Option extends object, Value extends unknown>(componentProps: IProps<Option, Value>) => {
    type NewOption = Option & { isNotAdded?: boolean };
    
    const { t } = useTranslation();
    const THEME = createTheme(useTheme(), plPL);

    const triggerAutoSubmit = () => {
        if (componentProps.autoSubmit && componentProps.submitFunction) {
            componentProps.submitFunction();
        }
    };

    const convertAnyOptionToValue = (option: Option | string): Value | undefined => {
        if (typeof option !== "string") {
            return componentProps.getOptionValue(option);
        } else if (componentProps.allowAdding && componentProps.getNewOption) {
            return componentProps.getOptionValue(componentProps.getNewOption(option));
        } else {
            return undefined;
        }
    };

    const convertAnyOptionsToValue = (options: (Option | string)[]): Value[] => {
        return options.map(convertAnyOptionToValue).filter(v => v) as Value[];
    };

    const evaluateSelectedOptions = (value: any): Option[] | Option | null => {
        let valueArray: (Value | string)[] = Array.isArray(value) ? Array.from(value) : [value];
        const filteredOptions = componentProps.options.filter(o => {
            let valueIndex = valueArray.findIndex(v => v === componentProps.getOptionValue(o));
            if (valueIndex !== -1) {
                valueArray = valueArray.splice(valueIndex, 1);
                return true;
            } else {
                return false;
            }
        });
        if (valueArray.length > 0 && componentProps.allowAdding && componentProps.getNewOption !== undefined) {
            valueArray.map(v => componentProps.getNewOption(v))
        }
    };

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
                                {/* { componentProps.allowAdding && componentProps.getNewOption && option instanceof NewOption ?

                                    :
                                
                                } */}
                                { componentProps.multiple && 
                                    <Checkbox checked={selected} size={componentProps.size} />
                                }
                                { componentProps.renderOption(option) }
                            </li>
                        }
                        filterOptions={(options, props) => {
                            if (props.inputValue.length) {
                                const filteredOptions = options.filter(
                                    o => componentProps.getOptionLabel(o).toLocaleLowerCase().includes(props.inputValue.toLocaleLowerCase())
                                );
                                if (componentProps.allowAdding && componentProps.getNewOption) {
                                    const isExactMatch = filteredOptions.some(
                                        o => componentProps.getOptionLabel(o).toLocaleLowerCase() === props.inputValue.toLocaleLowerCase()
                                    );
                                    if (!isExactMatch) {
                                        let addOption: NewOption = { ...componentProps.getNewOption(props.inputValue), isNotAdded: true };
                                        filteredOptions.push(addOption);
                                    }
                                }
                                return filteredOptions;
                            } else {
                                return options;
                            }
                        }}
                        getOptionLabel={componentProps.getOptionLabel}
                        limitTags={2}
                        getLimitTagsText={more => <Chip label={`+${more}`} size={componentProps.size} />}
                        freeSolo={componentProps.allowAdding && componentProps.getNewOption !== undefined}
                        size={componentProps.size}
                        fullWidth={componentProps.fullWidth}
                        sx={componentProps.sx}
                        value={evaluateSelectedOptions(value)}
                        onChange={(event, value) => {
                            let convertedValue: Value[] | Value | undefined;
                            if (componentProps.multiple) {
                                convertedValue = [];
                                if (value) {
                                    if (Array.isArray(value)) {
                                        convertedValue = convertAnyOptionsToValue(value);
                                    } else {
                                        convertedValue.push(...convertAnyOptionsToValue([value]));
                                    }
                                }
                            } else {
                                if (value && !Array.isArray(value)) {
                                    convertedValue = convertAnyOptionToValue(value);
                                } else {
                                    convertedValue = undefined;
                                }
                            }
                            console.log(convertedValue);
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