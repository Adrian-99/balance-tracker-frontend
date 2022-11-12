import { useTranslation } from "react-i18next";
import { EntryType } from "../../data/statistics-enums";
import EntryTypeComponent from "../entry-type.component";
import FormAutocompleteComponent, { FormAutocompleteProps } from "./form-autocomplete.component";

const EntryTypeSelectComponent: React.FC<FormAutocompleteProps<EntryType>> = (props) => {
    const { t } = useTranslation();

    return (
        <FormAutocompleteComponent
            {...props}
            renderOption={option => <EntryTypeComponent entryType={option} />}
            getOptionLabel={option => t("general.statistics.entryTypeValue." + option)}
            getOptionValue={option => option}
        />
    );
}

export default EntryTypeSelectComponent;