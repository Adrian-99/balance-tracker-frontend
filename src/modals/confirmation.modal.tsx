import { LoadingButton } from "@mui/lab";
import { Button, DialogActions, DialogContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BaseModal, BaseModalCloseReason } from "./base.modal";

export type ConfirmationModalCloseReason = BaseModalCloseReason | "yes" | "no";

export interface IProps {
    open: boolean;
    title: string;
    onClose: (reason: ConfirmationModalCloseReason) => void;
    showYesButtonSpinner?: boolean;
}

export const ConfirmationModal: React.FC<IProps> = ({open, title, onClose, showYesButtonSpinner, children}) => {
    const { t } = useTranslation();

    return (
        <BaseModal
            open={open}
            title={title}
            onClose={onClose}
        >
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose("no")}>{t("general.no")}</Button>
                <LoadingButton
                    variant="contained"
                    onClick={() => onClose("yes")}
                    loading={showYesButtonSpinner}
                >
                    {t("general.yes")}
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
}