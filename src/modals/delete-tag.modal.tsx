import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import StringSelectComponent from "../components/autocomplete/string-select.component";
import Tag from "../data/tag";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useTagService } from "../hooks/tag-service.hook";
import { CustomFormModal, CustomFormModalCloseReason } from "./custom-form.modal";

interface IProps {
    open: boolean;
    onClose: (reason: CustomFormModalCloseReason) => void;
    tag?: Tag;
}

interface ReplacementTagsForm {
    replacementTags: string[];
}

const DeleteTagModal: React.FC<IProps> = ({ open, onClose, tag }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, reset } = useForm<ReplacementTagsForm>();
    const { getTagNames, deleteTag } = useTagService();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();

    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [replaceWithOtherTag, setReplaceWithOtherTag] = useState(false);
    const [otherTagNames, setOtherTagNames] = useState<string[]>([]);
    
    useEffect(() => {
        if (open && tag && tag.entriesCount && tag.entriesCount > 0) {
            getTagNames()
                .then(response => {
                    setOtherTagNames(
                        response.data.filter(tagName => tagName !== tag.name)
                    );
                })
                .catch(error => {
                    errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
                    setOtherTagNames([]);
                });
        } else if (!open) {
            setReplaceWithOtherTag(false);
        }
    }, [open, tag]); // eslint-disable-line react-hooks/exhaustive-deps

    const onReplacementCheckboxChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setReplaceWithOtherTag(checked);
        if (!checked) {
            reset();
        }
    };

    const onSubmit: SubmitHandler<ReplacementTagsForm> = data => {
        if (tag) {
            setAwaitingResponse(true);
            deleteTag(tag.id, replaceWithOtherTag ? data.replacementTags : undefined)
                .then(response => {
                    successToast(evaluateBackendMessage(response.translationKey));
                    onClose("save");
                })
                .catch(error => {
                    errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
                })
                .finally(() => {
                    setAwaitingResponse(false);
                });
        }
    };

    return (
        <CustomFormModal
            open={open}
            title={t("pages.tags.deleteTag")}
            submitButtonText={t("general.yes")}
            cancelButtonText={t("general.no")}
            showSubmitButtonSpinner={awaitingResponse}
            onClose={onClose}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography variant="body1">
                { t("modals.deleteTag.confirmationQuestion", { name: tag?.name }) }
            </Typography>
            { tag?.entriesCount !== undefined && tag.entriesCount > 0 &&
                <>
                    <Typography variant="body1" color="error">
                        { t("modals.deleteTag.assignedEntriesWarning", { count: tag.entriesCount }) }
                    </Typography>
                    { otherTagNames.length > 0 &&
                        <>
                            <FormControlLabel
                                label={t("modals.deleteTag.replaceWithOtherTag")}
                                control={
                                    <Checkbox
                                        value={replaceWithOtherTag}
                                        onChange={onReplacementCheckboxChange}
                                    />
                                }
                            />
                            { replaceWithOtherTag &&
                                <StringSelectComponent
                                    formFieldName="replacementTags"
                                    control={control}
                                    label={t("modals.deleteTag.tags")}
                                    options={otherTagNames}
                                    required={true}
                                    multiple={true}
                                    fullWidth={true}
                                />
                            }
                        </>
                    }
                </>
            }
        </CustomFormModal>
    );
}

export default DeleteTagModal;