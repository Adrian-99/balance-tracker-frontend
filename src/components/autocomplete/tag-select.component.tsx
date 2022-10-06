import Tag from "../../data/tag";
import FormAutocompleteComponent, { FormAutocompleteProps } from "./form-autocomplete.component";

interface IProps extends FormAutocompleteProps<Tag> {
    allowAdding?: boolean;
}

const TagSelectComponent: React.FC<IProps> = props => {
    return (
        <FormAutocompleteComponent
            {...props}
            renderOption={t => <span>{t.name}</span>}
            getOptionLabel={t => t.name}
            getOptionValue={t => t.name}
            getNewOption={s => { return { name: s }; }}
        />
    );
}

export default TagSelectComponent;