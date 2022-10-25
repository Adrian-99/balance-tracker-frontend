import { Grid, InputAdornment, TextField } from "@mui/material";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ApplicationContext } from "../components/application-context.provider";
import CategorySelectComponent from "../components/autocomplete/category-select.component";
import TagSelectComponent from "../components/autocomplete/tag-select.component";
import DateTimePickerComponent from "../components/date-time-picker.component";
import ApiResponse from "../data/api-response";
import Category from "../data/category";
import EditEntry from "../data/edit-entry";
import Entry from "../data/entry";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useEntryService } from "../hooks/entry-service.hook";
import { useUtils } from "../hooks/utils.hook";
import { CustomFormModal, CustomFormModalCloseReason } from "./custom-form.modal";

interface IProps {
    open: boolean;
    onClose: (reason: CustomFormModalCloseReason) => void;
    categories: Category[];
    tagNames: string[];
    entry?: Entry;
}

const EditEntryModal: React.FC<IProps> = ({ open, onClose, categories, tagNames, entry }) => {
    const { t } = useTranslation();
    const { handleSubmit, register, setValue, getFieldState, reset, watch, control, formState: { errors } } = useForm<EditEntry>();
    const { validationRules } = useContext(ApplicationContext);
    const { createEntry, editEntry } = useEntryService();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();
    const { areStringsDifferent, areArraysDifferent } = useUtils();

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const watchedFields = watch();

    useEffect(() => {
        if (open) {
            if (!getFieldState("date").isDirty) {
                setValue("date", moment(entry?.date).toDate());
            }
            if (!getFieldState("value").isDirty && entry?.value) {
                setValue("value", entry?.value);
            }
            if (!getFieldState("name").isDirty) {
                setValue("name", entry?.name || "");
            }
            if (!getFieldState("description").isDirty) {
                setValue("description", entry?.description || "");
            }
            if (!getFieldState("categoryKeyword").isDirty) {
                setValue("categoryKeyword", entry?.categoryKeyword || "");
            }
            if (!getFieldState("tagNames").isDirty) {
                setValue("tagNames", entry?.tags.map(t => t.name) || []);
            }
        }
    }, [entry, open]); // eslint-disable-line react-hooks/exhaustive-deps

    const areValuesChanged = (): boolean => {
        return moment(watchedFields.date).diff(entry?.date).valueOf() !== 0 ||
            watchedFields.value !== entry?.value ||
            areStringsDifferent(watchedFields.name, entry?.name) ||
            areStringsDifferent(watchedFields.description, entry?.description) ||
            areStringsDifferent(watchedFields.categoryKeyword, entry?.categoryKeyword) ||
            areArraysDifferent(watchedFields.tagNames, entry?.tags.map(t => t.name));
    };

    const onSubmit: SubmitHandler<EditEntry> = data => {
        setAwaitingResponse(true);
        let saveAction: Promise<ApiResponse<string>>;
        if (entry) {
            saveAction = editEntry(entry.id, data);
        } else {
            saveAction = createEntry(data);
        }
        saveAction
            .then(response => {
                successToast(evaluateBackendMessage(response.translationKey));
                clearFormAndClose("save");
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.translationKey));
            })
            .finally(() => {
                setAwaitingResponse(false);
            });
    }

    const clearFormAndClose = (reason: CustomFormModalCloseReason) => {
        reset();
        onClose(reason);
    };

    return (
        <CustomFormModal title={entry ? t("pages.history.editEntry") : t("pages.history.addEntry")}
            showSubmitButtonSpinner={awaitingResponse}
            disableSubmitButton={entry && !areValuesChanged()}
            onClose={clearFormAndClose}
            onSubmit={handleSubmit(onSubmit)}
            open={open}
        >
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <DateTimePickerComponent
                        type="datetime"
                        formFieldName="date"
                        control={control}
                        label={t("general.entry.date")}
                        dateTimeFormat="YYYY.MM.DD HH:mm:ss"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label={t("general.entry.value") + " *"}
                        variant="outlined"
                        fullWidth
                        {...register("value", {
                            required: t("validation.required") as string,
                            pattern: { value: /^\d+([,.]\d{1,2})?$/, message: t("validation.valuePattern")}
                        })}
                        error={errors.value !== undefined}
                        helperText={errors.value?.message}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{t("general.currency")}</InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label={t("general.entry.name") + " *"}
                        variant="outlined"
                        fullWidth
                        {...register("name", {
                            required: t("validation.required") as string,
                            maxLength: { value: validationRules.entryNameMaxLength, message: t("validation.maxLength", { length: validationRules.entryNameMaxLength }) }
                        })}
                        error={errors.name !== undefined}
                        helperText={errors.name?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label={t("general.entry.description")}
                        variant="outlined"
                        fullWidth
                        {...register("description", {
                            maxLength: { value: validationRules.entryDescriptionMaxLength, message: t("validation.maxLength", { length: validationRules.entryDescriptionMaxLength }) }
                        })}
                        error={errors.description !== undefined}
                        helperText={errors.description?.message}
                        multiline
                        maxRows={6}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CategorySelectComponent
                        formFieldName="categoryKeyword"
                        control={control}
                        label={t("general.entry.category")}
                        options={categories}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TagSelectComponent
                        formFieldName="tagNames"
                        control={control}
                        label={t("general.entry.tags")}
                        options={tagNames}
                        multiple
                        fullWidth
                    />
                </Grid>
            </Grid>
        </CustomFormModal>
    );
}

export default EditEntryModal;