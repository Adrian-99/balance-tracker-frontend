import { LoadingButton } from "@mui/lab";
import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageCardComponent from "../../components/page-card.component";
import PasswordFieldComponent from "../../components/password-field.component";
import ResetPassword from "../../data/reset-password";
import { useCustomToast } from "../../hooks/custom-toast.hook";
import { usePasswordField } from "../../hooks/password-field.hook";
import { useUserService } from "../../hooks/user-service.hook";

type ResetPasswordWithRepeatPassword = ResetPassword & { repeatNewPassword: string };

const ResetPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, getValues, setError, formState: { errors } } = useForm<ResetPasswordWithRepeatPassword>();
    const navigate = useNavigate();
    const { passwordValidationOptions, repeatPasswordValidationOptions } = usePasswordField();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();
    const { resetPassword } = useUserService();

    const [searchParams] = useSearchParams();
    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const onSubmit: SubmitHandler<ResetPasswordWithRepeatPassword> = data => {
        setAwaitingResponse(true);
        if (data.resetPasswordCode === undefined) {
            data.resetPasswordCode = searchParams.get("code") as string;
        }
        const { repeatNewPassword, ...dataToSend } = data;
        resetPassword(dataToSend)
            .then(response => {
                successToast(evaluateBackendMessage(response.translationKey));
                navigate("/login");
            })
            .catch(error => {
                var translationKey = error.response?.data?.translationKey;
                errorToast(evaluateBackendMessage(translationKey));
                if (translationKey === "error.user.resetPassword.invalidCode") {
                    setError("resetPasswordCode", { type: "custom", message: evaluateBackendMessage(translationKey) }, { shouldFocus: searchParams.get("code") !== null });
                } else if (translationKey === "error.validation.passwordSameAsUsername" || "error.validation.passwordSameAsCurrentOne") {
                    setError("newPassword", { type: "custom", message: evaluateBackendMessage(translationKey) }, { shouldFocus: true });
                }
            })
            .finally(() => {
                setAwaitingResponse(false);
            });
    }

    return (
        <PageCardComponent title={t("pages.resetPassword.title")}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <TextField label={t("pages.resetPassword.code") + " *"}
                            variant="outlined"
                            fullWidth
                            {...register("resetPasswordCode", {
                                validate: {
                                    required: value => {
                                        debugger;
                                        if (searchParams.get("code") === null && value === "") {
                                            return t('validation.required') as string;
                                        }
                                        return true;
                                    }
                                }
                            })}
                            defaultValue={searchParams.get("code") || undefined}
                            disabled={searchParams.get("code") !== null}
                            error={errors.resetPasswordCode !== undefined}
                            helperText={errors.resetPasswordCode?.message}
                        />
                    </Grid>

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
                            {t('pages.resetPassword.submitButton')}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
            <Divider sx={{ my: '16px' }} />
            <Typography variant="body1">
                { t("pages.resetPassword.invalidCodeQuestion") }
                <Button to="/reset-password-request" component={Link}>{ t("pages.resetPassword.generateNewCode") }</Button>
            </Typography>
        </PageCardComponent>
    );
}

export default ResetPasswordPage;