import { LoadingButton } from "@mui/lab";
import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import GridBreakComponent from "../components/grid-break.component";
import PageCardComponent from "../components/page-card.component";
import PasswordFieldComponent from "../components/password-field.component";
import UserRegister from "../data/user-register";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useUserService } from "../hooks/user-service.hook";
import { usePasswordField } from "../hooks/password-field.hook";
import { useUtils } from "../hooks/utils.hook";
import { ApplicationContext } from "../components/application-context.provider";

type UserRegisterWithRepeatPassword = UserRegister & { repeatPassword: string };

const RegisterPage: React.FC = () => {
    const { register, handleSubmit, getValues, setError, formState: { errors } } = useForm<UserRegisterWithRepeatPassword>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isSmallScreen } = useUtils();
    const { passwordValidationOptions, repeatPasswordValidationOptions } = usePasswordField();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();
    const { registerUser } = useUserService();
    const { validationRules } = useContext(ApplicationContext);

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const onSubmit: SubmitHandler<UserRegisterWithRepeatPassword> = data => {
        setAwaitingResponse(true);
        const { repeatPassword, ...dataToSend } = data;
        registerUser(dataToSend)
            .then(response => {
                successToast(evaluateBackendMessage(response.translationKey));
                navigate('/login');
            })
            .catch(error => {
                var translationKey = error.response?.data?.TranslationKey;
                errorToast(evaluateBackendMessage(translationKey));
                if (translationKey === "error.user.register.usernameTaken") {
                    setError("username", { type: "custom", message: t("backend.error.user.register.usernameTaken") }, { shouldFocus: true });
                } else if (translationKey === "error.user.register.emailTaken") {
                    setError("email", { type: "custom", message: t("backend.error.user.register.emailTaken") }, { shouldFocus: true });
                }
            })
            .finally(() => {
                setAwaitingResponse(false);
            });
    }

    return (
        <PageCardComponent title={t("menu.register")}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <TextField label={t("user.username") + " *"}
                            variant="outlined"
                            fullWidth
                            {...register("username", { 
                                required: t('validation.required') as string,
                                maxLength: { 
                                    value: validationRules.userUsernameMaxLength,
                                    message: t('validation.maxLength', { length: validationRules.userUsernameMaxLength })
                                },
                                pattern: { value: /^[a-zA-Z0-9_-]*$/, message: t('validation.usernamePattern') }
                            })}
                            error={errors.username !== undefined}
                            helperText={errors.username?.message}
                        />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <TextField label={t("user.email") + " *"}
                            variant="outlined"
                            fullWidth
                            {...register("email", { 
                                required: t('validation.required') as string,
                                pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: t('validation.emailPattern') }
                            })}
                            error={errors.email !== undefined}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    <GridBreakComponent />

                    <Grid item xs={12} md={4}>
                        <TextField label={t("user.firstName")}
                            variant="outlined"
                            fullWidth
                            {...register("firstName", {
                                maxLength: { 
                                    value: validationRules.userFirstNameMaxLength,
                                    message: t('validation.maxLength', { length: validationRules.userFirstNameMaxLength })
                                }
                            })}
                            error={errors.firstName !== undefined}
                            helperText={errors.firstName?.message || (!isSmallScreen && errors.lastName !== undefined && " ")}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField label={t("user.lastName")}
                            variant="outlined"
                            fullWidth
                            {...register("lastName", {
                                maxLength: { 
                                    value: validationRules.userLastNameMaxLength,
                                    message: t('validation.maxLength', { length: validationRules.userLastNameMaxLength })
                                }
                            })}
                            error={errors.lastName !== undefined}
                            helperText={errors.lastName?.message || (!isSmallScreen && errors.firstName !== undefined && " ")}
                        />
                    </Grid>

                    <GridBreakComponent />

                    <Grid item xs={12} md={8}>
                        <PasswordFieldComponent label={t('user.password') + " *"}
                            fullWidth
                            useFormRegister={register('password', passwordValidationOptions(() => getValues("username")))}
                            error={errors.password !== undefined}
                            helperText={errors.password?.message}
                        />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <PasswordFieldComponent label={t('user.repeatPassword') + " *"}
                            fullWidth
                            useFormRegister={register('repeatPassword', repeatPasswordValidationOptions(() => getValues("password")))}
                            error={errors.repeatPassword !== undefined}
                            helperText={errors.repeatPassword?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <LoadingButton variant="contained" size="large" type="submit" loading={awaitingResponse}>
                            {t('pages.register.submitButton')}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
            <Divider sx={{ my: '16px' }} />
            <Typography variant="body1">
                { t("pages.register.accountQuestion") }
                <Button to="/login" component={Link}>{ t("pages.register.login") }</Button>
            </Typography>
        </PageCardComponent>
    )
}

export default RegisterPage;