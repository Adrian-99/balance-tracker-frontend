import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PageCardComponent from "../components/page-card.component";
import PasswordFieldComponent from "../components/password-field.component";
import ChangePassword from "../data/change-password";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { usePasswordField } from "../hooks/password-field.hook";
import { useUserService } from "../hooks/user-service.hook";

type ChangePasswordWithRepeatPassword = ChangePassword & { repeatNewPassword: string };

const ChangePasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, getValues, reset, setError, formState: { errors } } = useForm<ChangePasswordWithRepeatPassword>();
    const { passwordValidationOptions, repeatPasswordValidationOptions } = usePasswordField();
    const { changePassword } = useUserService();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const onSubmit: SubmitHandler<ChangePasswordWithRepeatPassword> = data => {
        setAwaitingResponse(true);
        const { repeatNewPassword, ...dataToSend } = data;
        changePassword(dataToSend)
            .then(response => {
                successToast(evaluateBackendMessage(response.translationKey));
                reset();
            })
            .catch(error => {
                var translationKey = error.response?.data?.translationKey;
                errorToast(evaluateBackendMessage(translationKey));
                if (translationKey === "error.validation.passwordSameAsUsername" || "error.validation.passwordSameAsCurrentOne") {
                    setError("newPassword", { type: "custom", message: evaluateBackendMessage(translationKey) }, { shouldFocus: true });
                }
            })
            .finally(() => {
                setAwaitingResponse(false);
            });
    }

    return (
        <PageCardComponent title={t("pages.changePassword.title")}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <PasswordFieldComponent label={t('user.password') + " *"}
                            fullWidth
                            useFormRegister={register('newPassword', passwordValidationOptions())}
                            error={errors.newPassword !== undefined}
                            helperText={errors.newPassword?.message}
                        />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <PasswordFieldComponent label={t('user.repeatPassword') + " *"}
                            fullWidth
                            useFormRegister={register('repeatNewPassword', repeatPasswordValidationOptions(() => getValues("newPassword")))}
                            error={errors.repeatNewPassword !== undefined}
                            helperText={errors.repeatNewPassword?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <LoadingButton variant="contained" size="large" type="submit" loading={awaitingResponse}>
                            {t('pages.changePassword.submitButton')}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
        </PageCardComponent>
    );
}

export default ChangePasswordPage;