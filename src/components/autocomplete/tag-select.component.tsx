import { SxProps, Theme } from "@mui/material";
import { Control } from "react-hook-form";
import Tag from "../../data/tag";
import FormAutocompleteComponent from "./form-autocomplete.component";

interface IProps {
    formFieldName: string;
    control: Control<any, any>;
    label: string;
    tags: Tag[];
    multiple?: boolean;
    autoSubmit?: boolean;
    submitFunction?: () => void;
    size?: "small" | "medium";
    sx?: SxProps<Theme>;
}

const TagSelectComponent: React.FC<IProps> = props => {
    return (
        <FormAutocompleteComponent
            formFieldName={props.formFieldName}
            control={props.control}
            label={props.label}
            options={props.tags}
            renderOption={t => <span>{t.name}</span>}
            getOptionLabel={t => t.name}
            getOptionValue={t => t.name}
            multiple={props.multiple}
            autoSubmit={props.autoSubmit}
            submitFunction={props.submitFunction}
            size={props.size}
            sx={props.sx}
        />
    );
}

export default TagSelectComponent;