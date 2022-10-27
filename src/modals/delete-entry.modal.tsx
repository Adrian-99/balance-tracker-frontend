import { Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Entry from "../data/entry";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useEntryService } from "../hooks/entry-service.hook";
import { ConfirmationModal, ConfirmationModalCloseReason } from "./confirmation.modal"

interface IProps {
    open: boolean;
    onClose: (reason: ConfirmationModalCloseReason) => void;
    entry?: Entry;
}

export const DeleteEntryModal: React.FC<IProps> = ({open, onClose, entry}) => {
    const { t } = useTranslation();
    const { deleteEntry } = useEntryService();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const handleOnClose = (reason: ConfirmationModalCloseReason) => {
        if (reason === "yes" && entry) {
            setAwaitingResponse(true);
            deleteEntry(entry.id)
                .then(response => {
                    successToast(evaluateBackendMessage(response.translationKey));
                    onClose("yes");
                })
                .catch(error => {
                    errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
                })
                .finally(() => {
                    setAwaitingResponse(false);
                });
        } else {
            onClose(reason);
        }
    }

    return (
        <ConfirmationModal
            open={open}
            title={t("pages.history.deleteEntry")}
            onClose={handleOnClose}
            showYesButtonSpinner={awaitingResponse}
        >
            <Typography variant="body1">
                {t("modals.deleteEntry.confirmationQuestion", { name: entry?.name })}
            </Typography>
        </ConfirmationModal>
    )
}