import { TextField } from "@mui/material";
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
}

const DatePickerComponent: React.FC<IProps> = ({ formFieldName,control, label, dateFormat, minDate, maxDate,
        autoSubmit, submitFunction, size }) => {
    const { t } = useTranslation();

    const translatedDateFormat = dateFormat.replaceAll('Y', t("general.date.formatLetters.year"))
        .replaceAll('M', t("general.date.formatLetters.month"))
        .replaceAll('D', t("general.date.formatLetters.day"));

    const getDateValidationRules = (): Record<string, Validate<Date>> => {
        return {
            validDate: value => value === null || moment(value, dateFormat, true).isValid() || t("validation.incorrectDate") as string,
            ...(minDate && {
                pastMinDate: value => value === null || moment(value).isSameOrAfter(minDate) ||
                    t("validation.minDate", { date: moment(minDate).format(dateFormat) }) as string
            }),
            ...(maxDate && {
                beforeMaxDate: value => value === null || moment(value).isSameOrBefore(maxDate) ||
                    t("validation.maxDate", { date: moment(maxDate).format(dateFormat) }) as string
            })
        }
    }

    const triggerAutoSubmit = () => {
        if (autoSubmit && submitFunction) {
            submitFunction();
        }
    }

    return (
        <Controller
            name={formFieldName}
            control={control}
            rules={{ validate: getDateValidationRules() }}
            render={({ field: { value, onChange }, fieldState: { error } }) =>
                <DatePicker
                    label={label}
                    onChange={newValue => onChange(newValue?.toString().length ? moment(newValue).toDate() : null)}
                    onAccept={() => triggerAutoSubmit()}
                    renderInput={props => 
                        <TextField
                            size={size || "medium"}
                            {...props}
                            inputProps={{
                                ...props.inputProps,
                                placeholder: translatedDateFormat
                            }}
                            onChange={event => {
                                if (props.onChange) {
                                    props.onChange(event);
                                }
                                let parsedDate = moment(event.target.value, dateFormat, true);
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
                    minDate={minDate ? moment(minDate) : undefined}
                    maxDate={maxDate ? moment(maxDate) : undefined}
                    inputFormat={dateFormat}
                />
            }
        />
    );
}

export default DatePickerComponent;