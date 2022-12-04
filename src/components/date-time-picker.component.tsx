import { SxProps, TextField, TextFieldProps, Theme } from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { Control, Controller, FieldError, Validate } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IProps {
    type: "date" | "datetime";
    formFieldName: string;
    control: Control<any, any>;
    label: string;
    dateTimeFormat: string;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    autoSubmit?: boolean;
    submitFunction?: () => void;
    size?: "medium" | "small";
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}

const DateTimePickerComponent: React.FC<IProps> = componentProps => {
    const { t } = useTranslation();

    const translatedDateFormat = componentProps.dateTimeFormat.replaceAll('Y', t("general.date.formatLetters.year"))
        .replaceAll('M', t("general.date.formatLetters.month"))
        .replaceAll('D', t("general.date.formatLetters.day"))
        .replaceAll('h', t("general.date.formatLetters.hour"))
        .replaceAll('H', t("general.date.formatLetters.hour"))
        .replaceAll('m', t("general.date.formatLetters.minute"))
        .replaceAll('s', t("general.date.formatLetters.second"));

    const getDateValidationRules = (): Record<string, Validate<Date>> => {
        return {
            ...(componentProps.required && {
                required: (value => value !== null && value !== undefined) || t("validation.required") as string
            }),
            validDate: value => value === null || moment(value, componentProps.dateTimeFormat, true).isValid() || t("validation.incorrectDate") as string,
            ...(componentProps.minDate && {
                pastMinDate: value => value === null || moment(value).isSameOrAfter(componentProps.minDate) ||
                    t("validation.minDate", { date: moment(componentProps.minDate).format(componentProps.dateTimeFormat) }) as string
            }),
            ...(componentProps.maxDate && {
                beforeMaxDate: value => value === null || moment(value).isSameOrBefore(componentProps.maxDate) ||
                    t("validation.maxDate", { date: moment(componentProps.maxDate).format(componentProps.dateTimeFormat) }) as string
            })
        }
    }

    const triggerAutoSubmit = () => {
        if (componentProps.autoSubmit && componentProps.submitFunction) {
            componentProps.submitFunction();
        }
    }

    const getPickerProps = (value: any, onChange: (...event: any[]) => void, error?: FieldError) => {
        return {
            label: componentProps.required && !componentProps.label.endsWith("*") ?
                componentProps.label + " *" :
                componentProps.label,
            onChange: (newValue: moment.Moment | null) => onChange(newValue?.toString().length ? moment(newValue) : null),
            onAccept: () => triggerAutoSubmit(),
            renderInput: (props: TextFieldProps) => 
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
                        let parsedDate = moment(event.target.value, componentProps.dateTimeFormat, true);
                        if (parsedDate.isValid()) {
                            onChange(parsedDate.toDate());
                            triggerAutoSubmit();
                        } else if (!event.target.value.length) {
                            onChange(null);
                            triggerAutoSubmit();
                        }
                    }}
                    error={error?.message !== undefined}
                    helperText={error?.message}
                />,
            value: value ? value : null,
            minDate: componentProps.minDate ? moment(componentProps.minDate) : undefined,
            maxDate: componentProps.maxDate ? moment(componentProps.maxDate) : undefined,
            inputFormat: componentProps.dateTimeFormat
        };
    }

    return (
        <Controller
            name={componentProps.formFieldName}
            control={componentProps.control}
            rules={{ validate: getDateValidationRules() }}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
                if (componentProps.type === "date") {
                    return <DatePicker {...getPickerProps(value, onChange, error)} />
                } else /*if (componentProps.type === "datetime")*/ {
                    return <DateTimePicker {...getPickerProps(value, onChange, error)} />
                }
            }}
        />
    );
}

export default DateTimePickerComponent;