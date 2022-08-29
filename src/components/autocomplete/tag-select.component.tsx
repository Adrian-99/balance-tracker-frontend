import Tag from "../../data/tag";
import FormAutocompleteComponent, { FormAutocompleteProps } from "./form-autocomplete.component";

const TagSelectComponent: React.FC<FormAutocompleteProps<Tag>> = props => {
    return (
        <FormAutocompleteComponent
            {...props}
            renderOption={t => <span>{t.name}</span>}
            getOptionLabel={t => t.name}
            getOptionValue={t => t.name}
        />
    );
}

export default TagSelectComponent;