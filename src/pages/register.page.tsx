import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ButtonWithSpinnerComponent from "../components/button-with-spinner.component";
import GridBreakComponent from "../components/grid-break.component";
import PageCardComponent from "../components/page-card.component";
import PasswordFieldComponent from "../components/password-field.component";
import UserRegister from "../data/user-register";
import { useCustomToast } from "../services/custom-toast.hook";
import UserService from "../services/user.service";

type UserRegisterWithRepeatPassword = UserRegister & { repeatPassword: string };

const RegisterPage: React.FC = () => {
    const { register, handleSubmit, watch, setError, formState: { errors } } = useForm<UserRegisterWithRepeatPassword>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { successToast, errorToast } = useCustomToast();

    const watchForm = watch(["username", "password"]);

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const onSubmit: SubmitHandler<UserRegisterWithRepeatPassword> = data => {
        setAwaitingResponse(true);
        const { repeatPassword, ...dataToSend } = data;
        UserService.register(dataToSend)
            .then(response => {
                successToast(response.translationKey);
                setAwaitingResponse(false);
                navigate('/login');
            })
            .catch(error => {
                errorToast(error.response?.data?.translationKey);
                setAwaitingResponse(false);
                var translationKey = error.response?.data?.translationKey;
                if (translationKey === "error.user.register.usernameTaken") {
                    setError("username", { type: "custom", message: t("backend.error.user.register.usernameTaken") }, { shouldFocus: true });
                } else if (translationKey === "error.user.register.emailTaken") {
                    setError("email", { type: "custom", message: t("backend.error.user.register.emailTaken") }, { shouldFocus: true });
                }
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
                            {...register("firstName")}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField label={t("user.lastName")}
                            variant="outlined"
                            fullWidth
                            {...register("lastName")}
                        />
                    </Grid>

                    <GridBreakComponent />

                    <Grid item xs={12} md={8}>
                    <PasswordFieldComponent label={t('user.password') + " *"}
                            fullWidth
                            useFormRegister={register('password', {
                                required: t('validation.required') as string,
                                minLength: { value: 8, message: t('validation.minLength', { length: 8 }) },
                                validate: { 
                                    mustContainSmallLetter: v => /.*[a-z].*/.test(v) || t('validation.mustContainSmallLetter') as string,
                                    mustContainBigLetter: v => /.*[A-Z].*/.test(v) || t('validation.mustContainBigLetter') as string,
                                    mustContainDigit: v => /.*[0-9].*/.test(v) || t('validation.mustContainDigit') as string,
                                    mustContainSpecialChar: v => /.*[^a-zA-Z0-9].*/.test(v) || t('validation.mustContainSpecialChar') as string,
                                    cantBeSameAsUsername: v => v.toLowerCase() !== watchForm[0].toLowerCase() || t('validation.cantBeSameAsUsername') as string
                                }
                            })}
                            error={errors.password !== undefined}
                            helperText={errors.password?.message}
                        />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <PasswordFieldComponent label={t('user.repeatPassword') + " *"}
                            fullWidth
                            useFormRegister={register('repeatPassword', {
                                required: t('validation.required') as string,
                                validate: { 
                                    mustBeSameAsPassword: v => v === watchForm[1] || t('validation.mustBeSameAsPassword') as string
                                }
                            })}
                            error={errors.repeatPassword !== undefined}
                            helperText={errors.repeatPassword?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ButtonWithSpinnerComponent 
                            buttonText={t('pages.register.submitButton')}
                            variant="contained"
                            submitButton={true}
                            enableSpinner={awaitingResponse}
                        />
                    </Grid>
                </Grid>
            </form>
        </PageCardComponent>
    )
}

export default RegisterPage;