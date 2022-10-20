import { Close as CloseIcon } from "@mui/icons-material";
import { Dialog, DialogTitle, IconButton, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export type BaseModalCloseReason = "backdropClick" | "escapeKeyDown" | "closeIconClick";

interface IProps {
    open: boolean;
    title: string;
    onClose: (reason: BaseModalCloseReason) => void;
}

export const BaseModal: React.FC<IProps> = ({ open, title, onClose, children }) => {
    return (
        <Dialog
            open={open}
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
            {children}
        </Dialog>
    );
}