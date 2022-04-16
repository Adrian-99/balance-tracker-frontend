import { LoadingButton } from "@mui/lab";
import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";
import PageCardComponent from "../../components/page-card.component"
import ResetPasswordRequest from "../../data/reset-password-request";
import { useCustomToast } from "../../hooks/custom-toast.hook";
import { useUserService } from "../../hooks/user-service.hook";

const ResetPasswordRequestPage: React.FC = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordRequest>();
    const navigate = useNavigate();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();
    const { resetUserPasswordRequest } = useUserService();

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const onSubmit: SubmitHandler<ResetPasswordRequest> = data => {
        setAwaitingResponse(true);
        resetUserPasswordRequest(data)
            .then(response => {
                successToast(evaluateBackendMessage(response.translationKey));
                navigate("/reset-password");
            })
            .catch(() => {
                errorToast();
            })
            .finally(() => {
                setAwaitingResponse(false);
            });
    }

    return (
        <PageCardComponent title={t("pages.resetPasswordRequest.title")}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <TextField label={t("user.usernameOrEmail") + " *"}
                            variant="outlined"
                            fullWidth
                            {...register("usernameOrEmail", { required: t('validation.required') as string })}
                            error={errors.usernameOrEmail !== undefined}
                            helperText={errors.usernameOrEmail?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <LoadingButton variant="contained" size="large" type="submit" loading={awaitingResponse}>
                            {t('pages.resetPasswordRequest.submitButton')}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
        </PageCardComponent>
    );
}

export default ResetPasswordRequestPage;