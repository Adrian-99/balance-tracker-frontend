import { SxProps, TextField, Theme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { Control, Controller, Validate } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
    formFieldName: string;
    control: Control<any, any>;
    label: string;
    dateFormat: string;
    minDate?: Date;
    maxDate?: Date;
    autoSubmit?: boolean;
    submitFunction?: () => void;
    size?: "medium" | "small";
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}

const DatePickerComponent: React.FC<IProps> = componentProps => {
    const { t } = useTranslation();

    const translatedDateFormat = componentProps.dateFormat.replaceAll('Y', t("general.date.formatLetters.year"))
        .replaceAll('M', t("general.date.formatLetters.month"))
        .replaceAll('D', t("general.date.formatLetters.day"));

    const getDateValidationRules = (): Record<string, Validate<Date>> => {
        return {
            validDate: value => value === null || moment(value, componentProps.dateFormat, true).isValid() || t("validation.incorrectDate") as string,
            ...(componentProps.minDate && {
                pastMinDate: value => value === null || moment(value).isSameOrAfter(componentProps.minDate) ||
                    t("validation.minDate", { date: moment(componentProps.minDate).format(componentProps.dateFormat) }) as string
            }),
            ...(componentProps.maxDate && {
                beforeMaxDate: value => value === null || moment(value).isSameOrBefore(componentProps.maxDate) ||
                    t("validation.maxDate", { date: moment(componentProps.maxDate).format(componentProps.dateFormat) }) as string
            })
        }
    }

    const triggerAutoSubmit = () => {
        if (componentProps.autoSubmit && componentProps.submitFunction) {
            componentProps.submitFunction();
        }
    }

    return (
        <Controller
            name={componentProps.formFieldName}
            control={componentProps.control}
            rules={{ validate: getDateValidationRules() }}
            render={({ field: { value, onChange }, fieldState: { error } }) =>
                <DatePicker
                    label={componentProps.label}
                    onChange={newValue => onChange(newValue?.toString().length ? moment(newValue).toDate() : null)}
                    onAccept={() => triggerAutoSubmit()}
                    renderInput={props => 
                        <TextField
                            {...props}
                            size={componentProps.size || "medium"}
                            fullWidth={componentProps.fullWidth}
                            sx={componentProps.sx}
                            inputProps={{
                                ...props.inputProps,
                                placeholder: translatedDateFormat
                            }}
                            onChange={event => {
                                if (props.onChange) {
                                    props.onChange(event);
                                }
                                let parsedDate = moment(event.target.value, componentProps.dateFormat, true);
                                if (parsedDate.isValid()) {
                                    onChange(parsedDate.toDate());
                                    triggerAutoSubmit();
                                } else if (!event.target.value.length) {
                                    onChange(null);
                                    triggerAutoSubmit();
                                }
                            }}
                            helperText={error?.message}
                        />
                    }
                    value={value}
                    minDate={componentProps.minDate ? moment(componentProps.minDate) : undefined}
                    maxDate={componentProps.maxDate ? moment(componentProps.maxDate) : undefined}
                    inputFormat={componentProps.dateFormat}
                />
            }
        />
    );
}

export default DatePickerComponent;