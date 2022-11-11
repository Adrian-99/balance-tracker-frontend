import { Autocomplete, Checkbox, Chip, SxProps, TextField, Theme } from "@mui/material";
import { SyntheticEvent } from "react";
import { FieldError } from "react-hook-form";

export interface AutocompleteProps<T> {
    label: string;
    options: T[];
    required?: boolean;
    multiple?: boolean;
    limitTags?: number;
    size?: "small" | "medium";
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}

interface IProps<T> extends AutocompleteProps<T> {
    value: T | T[] | null;
    onChange: (event: SyntheticEvent<Element, Event>, value: T | T[] | null) => void;
    error?: FieldError;
    renderOption: (option: T) => JSX.Element;
    getOptionLabel: (option: T) => string;
}

const AutocompleteComponent = <T extends unknown>(componentProps: IProps<T>) => {
    return (
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
                    error={componentProps.error !== undefined}
                    helperText={componentProps.error?.message}
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
            limitTags={componentProps.limitTags || 2}
            getLimitTagsText={more => <Chip label={`+${more}`} size={componentProps.size} />}
            size={componentProps.size}
            fullWidth={componentProps.fullWidth}
            sx={componentProps.sx}
            value={componentProps.value}
            onChange={componentProps.onChange}
        />
    );
}

export default AutocompleteComponent;