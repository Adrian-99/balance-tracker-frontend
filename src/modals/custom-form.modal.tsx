import { Close as CloseIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useTranslation } from "react-i18next";
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export type CustomFormModalCloseReason = "backdropClick" | "escapeKeyDown" | "closeIconClick" | "cancel" | "save";

interface CustomFormModalProps {
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

export const CustomFormModal: React.FC<CustomFormModalProps> = ({
    open,title, showSpinner, showNoData, submitButtonText, showSubmitButtonSpinner, disableSubmitButton,
    onClose, onSubmit, children
    }) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open}
            onClose={(_event, reason) => onClose(reason)}
            TransitionComponent={Transition}
            fullWidth
        >
            <DialogTitle>
                {title}
                <IconButton sx={{ position: "absolute", top: "12px", right: "16px" }} onClick={() => onClose("closeIconClick")}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
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
                        <LoadingButton variant="contained" type="submit" disabled={disableSubmitButton} loading={showSubmitButtonSpinner}>{ submitButtonText || t("general.save")}</LoadingButton>
                    </DialogActions>
                </form>
                :
                <SpinnerOrNoDataComponent showSpinner={showSpinner || false} showNoData={showNoData || false} />
            }
        </Dialog>
    );
}
