import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ButtonWithSpinnerComponent from "../components/button-with-spinner.component";
import PageCardComponent from "../components/page-card.component";
import PasswordFieldComponent from "../components/password-field.component";
import Authenticate from "../data/authenticate";
import { useAuthentication } from "../hooks/authentication.hook";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useUserService } from "../hooks/user-service.hook";

const LoginPage: React.FC = () => {
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<Authenticate>();
    const { t } = useTranslation();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();
    const { authenticateUser } = useUserService();
    const { saveUserInfo } = useAuthentication();

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const usernameOrEmailRegister = register("usernameOrEmail", { required: t('validation.required') as string });
    const passwordRegister = register("password", { required: t('validation.required') as string });
    
    const onInputChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = event => {
        if (event.target.name === "usernameOrEmail") {
            usernameOrEmailRegister.onChange(event);
        } else {
            passwordRegister.onChange(event);
        }

        if (errors.usernameOrEmail?.type === "custom") {
            clearErrors("usernameOrEmail");
        }
        if (errors.password?.type === "custom") {
            clearErrors("password");
        }
    }

    const onSubmit: SubmitHandler<Authenticate> = data => {
        setAwaitingResponse(true);
        authenticateUser(data)
            .then(response => {
                var username = saveUserInfo(response);
                setAwaitingResponse(false);
                successToast(t("pages.login.successToast", { username }));
            })
            .catch(error => {
                var translationKey = error.response?.data?.translationKey;
                errorToast(evaluateBackendMessage(translationKey));
                setAwaitingResponse(false);
                if (translationKey === "error.user.authenticate.wrongCredentials") {
                    setError("usernameOrEmail", { type: "custom"});
                    setError("password", { type: "custom" });
                }
            });
    }

    return (
        <PageCardComponent title={t("menu.login")}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <TextField label={t("user.usernameOrEmail") + " *"}
                            variant="outlined"
                            fullWidth
                            {...usernameOrEmailRegister}
                            error={errors.usernameOrEmail !== undefined}
                            helperText={errors.usernameOrEmail?.message}
                            onChange={onInputChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <PasswordFieldComponent label={t('user.password') + " *"}
                            fullWidth
                            useFormRegister={passwordRegister}
                            error={errors.password !== undefined}
                            helperText={errors.password?.message}
                            onChange={onInputChange}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ButtonWithSpinnerComponent
                            buttonText={t('pages.login.submitButton')}
                            variant="contained"
                            submitButton={true}
                            enableSpinner={awaitingResponse}
                        />
                    </Grid>
                </Grid>
            </form>
        </PageCardComponent>
    );
}

export default LoginPage;