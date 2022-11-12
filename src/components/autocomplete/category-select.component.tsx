import { useTranslation } from "react-i18next";
import Category from "../../data/category";
import CategoryComponent from "../category.component";
import FormAutocompleteComponent, { FormAutocompleteProps } from "./form-autocomplete.component";

const CategorySelectComponent: React.FC<FormAutocompleteProps<Category>> = props => {
    const { t } = useTranslation();

    return (
        <FormAutocompleteComponent
            {...props}
            renderOption={c => <CategoryComponent category={c} />}
            getOptionLabel={c => c !== undefined ? t("categories." + c.keyword) : ""}
            getOptionValue={c => c !== undefined ? c.keyword : undefined}
        />
    );
}

export default CategorySelectComponent;