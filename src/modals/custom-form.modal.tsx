import { LoadingButton } from "@mui/lab";
import { Button, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";
import { BaseModal, BaseModalCloseReason } from "./base.modal";

export type CustomFormModalCloseReason = BaseModalCloseReason | "cancel" | "save";

interface IProps {
    open: boolean;
    title: string;
    showSpinner?: boolean | undefined;
    showNoData?: boolean | undefined;
    submitButtonText?: string | undefined;
    showSubmitButtonSpinner?: boolean | undefined;
    disableSubmitButton?: boolean | undefined;
    onClose: (reason: CustomFormModalCloseReason) => void;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export const CustomFormModal: React.FC<IProps> = ({
    open, title, showSpinner, showNoData, submitButtonText, showSubmitButtonSpinner, disableSubmitButton,
    onClose, onSubmit, children
    }) => {
    const { t } = useTranslation();

    return (
        <BaseModal
            open={open}
            title={title}
            onClose={onClose}
        >
            {!showSpinner && !showNoData ?
                <form
                    onSubmit={onSubmit}
                    style={{
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <DialogContent dividers>
                        {children}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => onClose("cancel")}>{t("general.cancel")}</Button>
                        <LoadingButton variant="contained"
                            type="submit"
                            disabled={disableSubmitButton}
                            loading={showSubmitButtonSpinner}
                        >
                            { submitButtonText || t("general.save")}
                        </LoadingButton>
                    </DialogActions>
                </form>
                :
                <SpinnerOrNoDataComponent showSpinner={showSpinner || false} showNoData={showNoData || false} />
            }
        </BaseModal>
    );
}
