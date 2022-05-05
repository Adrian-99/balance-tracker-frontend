import { LoadingButton } from "@mui/lab";
import { TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AuthenticationContext } from "../components/authentication.provider";
import VerifyEmail from "../data/verify-email";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useUserService } from "../hooks/user-service.hook";
import { CustomFormModal, CustomFormModalCloseReason } from "./custom-form.modal";

interface IProps { 
    open: boolean;
    onClose: (reason: CustomFormModalCloseReason) => void;
}

const VerifyEmailModal: React.FC<IProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<VerifyEmail>();
    const { saveUserInfo } = useContext(AuthenticationContext);
    const { verifyEmail, resetEmailVerificationCode } = useUserService();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();

    const [awaitingSaveResponse, setAwaitngSaveReponse] = useState(false);
    const [awaitingResetResponse, setAwaitingResetResponse] = useState(false);

    const sendResetCodeRequest = () => {
        setAwaitingResetResponse(true);
        resetEmailVerificationCode()
            .then(response  => {
                successToast(evaluateBackendMessage(response.translationKey));
            })
            .catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.translationKey));
            })
            .finally(() => {
                setAwaitingResetResponse(false);
            });
    }

    const onSubmit: SubmitHandler<VerifyEmail> = data => {
        setAwaitngSaveReponse(true);
        verifyEmail(data)
            .then(response => {
                successToast(evaluateBackendMessage(response.translationKey));
                if (response.accessToken && response.refreshToken) {
                    saveUserInfo(response);
                }
                onClose("save");
            })
            .catch(error => {
                var translationKey = error.response?.data?.translationKey;
                errorToast(evaluateBackendMessage(translationKey));
                if (translationKey === "error.user.verifyEmail.invalidCode") {
                    setError("emailVerificationCode", { type: "custom", message: evaluateBackendMessage(translationKey) });
                }
            })
            .finally(() => {
                setAwaitngSaveReponse(false);
            });
    };

    const resetFormAndClose = (reason: CustomFormModalCloseReason) => {
        reset();
        onClose(reason)
    };

    return (
        <CustomFormModal open={open}
            title={t("pages.userProfile.verifyEmail")}
            onClose={resetFormAndClose}
            onSubmit={handleSubmit(onSubmit)}
            showSubmitButtonSpinner={awaitingSaveResponse}
        >
            <TextField label={t("modals.verifyEmail.code") + " *"}
                variant="outlined"
                fullWidth
                {...register("emailVerificationCode", { 
                    required: t('validation.required') as string
                })}
                error={errors.emailVerificationCode !== undefined}
                helperText={errors.emailVerificationCode?.message}
            />

            <Typography variant="body1" sx={{ mt: "8px" }}>
                { t("modals.verifyEmail.invalidCodeQuestion") }
                <LoadingButton loading={awaitingResetResponse} onClick={sendResetCodeRequest}>
                    { t("modals.verifyEmail.generateNewCode") }
                </LoadingButton>
            </Typography>
        </CustomFormModal>
    );
}

export default VerifyEmailModal;
