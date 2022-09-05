import { useTranslation } from "react-i18next";
import Category from "../../data/category";
import { useUtils } from "../../hooks/utils.hook";
import FormAutocompleteComponent, { FormAutocompleteProps } from "./form-autocomplete.component";

const CategorySelectComponent: React.FC<FormAutocompleteProps<Category>> = props => {
    const { t } = useTranslation();
    const { renderCategory } = useUtils();

    return (
        <FormAutocompleteComponent
            {...props}
            renderOption={renderCategory}
            getOptionLabel={c => c !== undefined ? t("categories." + c.keyword) : ""}
            getOptionValue={c => c !== undefined ? c.keyword : undefined}
        />
    );
}

export default CategorySelectComponent;