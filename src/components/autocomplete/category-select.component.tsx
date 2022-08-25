import { SxProps, Theme } from "@mui/material";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Category from "../../data/category";
import { useUtils } from "../../hooks/utils.hook";
import FormAutocompleteComponent from "./form-autocomplete.component";

interface IProps {
    formFieldName: string;
    control: Control<any, any>;
    label: string;
    categories: Category[];
    multiple?: boolean;
    autoSubmit?: boolean;
    submitFunction?: () => void;
    size?: "small" | "medium";
    sx?: SxProps<Theme>;
}

const CategorySelectComponent: React.FC<IProps> = props => {
    const { t } = useTranslation();
    const { renderCategory } = useUtils();

    return (
        <FormAutocompleteComponent
            formFieldName={props.formFieldName}
            control={props.control}
            label={props.label}
            options={props.categories}
            renderOption={renderCategory}
            getOptionLabel={c => t("categories." + c.keyword)}
            getOptionValue={c => c.keyword}
            multiple={props.multiple}
            autoSubmit={props.autoSubmit}
            submitFunction={props.submitFunction}
            size={props.size}
            sx={props.sx}
        />
    );
}

export default CategorySelectComponent;