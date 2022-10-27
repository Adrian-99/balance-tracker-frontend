import { Grid, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ApplicationContext } from "../components/application-context.provider";
import EditTag from "../data/edit-tag";
import Tag from "../data/tag";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useTagService } from "../hooks/tag-service.hook";
import { useUtils } from "../hooks/utils.hook";
import { CustomFormModal, CustomFormModalCloseReason } from "./custom-form.modal";

interface IProps {
    open: boolean;
    onClose: (reason: CustomFormModalCloseReason) => void;
    tag?: Tag;
}

const EditTagModal: React.FC<IProps> = ({ open, onClose, tag }) => {
    const { t } = useTranslation();
    const { handleSubmit, register, setValue, setError, getFieldState, reset, watch, formState: { errors } } = useForm<EditTag>();
    const { validationRules } = useContext(ApplicationContext);
    const { createTag, editTag } = useTagService();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();
    const { areStringsDifferent } = useUtils()

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const watchedFields = watch();

    useEffect(() => {
      if (open) {
        if (!getFieldState("name").isDirty) {
            setValue("name", tag?.name || "");
        }
      }
    }, [tag, open])

    const onSubmit: SubmitHandler<EditTag> = data => {
        setAwaitingResponse(true);
        let saveAction = tag ? editTag(tag.id, data) : createTag(data);
        saveAction
        .then(response => {
            successToast(evaluateBackendMessage(response.translationKey));
            clearFormAndClose("save");
        })
        .catch(error => {
            let translationKey = error.response?.data?.TranslationKey;
            errorToast(evaluateBackendMessage(translationKey));
            if (translationKey === "error.tag.nameTaken") {
                setError("name", { type: "custom", message: t("backend.error.tag.nameTaken") }, { shouldFocus: true });
            }
        })
        .finally(() => {
            setAwaitingResponse(false);
        });
    }

    const clearFormAndClose = (reason: CustomFormModalCloseReason) => {
        reset();
        onClose(reason);
    }

    return (
        <CustomFormModal title={tag ? t("pages.tags.editTag") : t("pages.tags.addTag")}
            showSubmitButtonSpinner={awaitingResponse}
            disableSubmitButton={tag && !areStringsDifferent(watchedFields.name, tag.name)}
            onClose={clearFormAndClose}
            onSubmit={handleSubmit(onSubmit)}
            open={open}
        >
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <TextField
                        label={t("general.tag.name") + " *"}
                        variant="outlined"
                        fullWidth
                        {...register("name", {
                            required: t("validation.required") as string,
                            maxLength: { value: validationRules.tagNameMaxLength, message: t("validation.maxLength", { length: validationRules.tagNameMaxLength }) }
                        })}
                        error={errors.name !== undefined}
                        helperText={errors.name?.message}
                    />
                </Grid>
            </Grid>
        </CustomFormModal>
    );
}

export default EditTagModal;