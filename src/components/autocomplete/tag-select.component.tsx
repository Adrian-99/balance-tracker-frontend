import FormAutocompleteComponent, { FormAutocompleteProps } from "./form-autocomplete.component";

const TagSelectComponent: React.FC<FormAutocompleteProps<string>> = props => {
    return (
        <FormAutocompleteComponent
            {...props}
            renderOption={t => <span>{t}</span>}
            getOptionLabel={t => t}
            getOptionValue={t => t}
        />
    );
}

export default TagSelectComponent;