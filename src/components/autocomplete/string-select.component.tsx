import { useTranslation } from "react-i18next";
import FormAutocompleteComponent, { FormAutocompleteProps } from "./form-autocomplete.component";

interface IProps extends FormAutocompleteProps<string> {
    translateLabel?: boolean;
    translateKeyPrefix?: string;
}

const StringSelectComponent: React.FC<IProps> = (props) => {
    const { t } = useTranslation();

    const tryToTranslate = (option: string): string => {
        if (props.translateLabel && props.translateKeyPrefix) {
            return t(`${props.translateKeyPrefix}.${option}`);
        } else {
            return option;
        }
    };

    return (
        <FormAutocompleteComponent
            {...props}
            renderOption={option => <span>{ tryToTranslate(option) }</span>}
            getOptionLabel={tryToTranslate}
            getOptionValue={option => option}
        />
    );
}

export default StringSelectComponent;