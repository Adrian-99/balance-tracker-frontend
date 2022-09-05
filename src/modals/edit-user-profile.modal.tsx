import { Grid, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ChangeUserData from "../data/change-user-data";
import UserData from "../data/user-data";
import { CustomFormModal, CustomFormModalCloseReason } from "./custom-form.modal";
import { useUserService } from "../hooks/user-service.hook";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { ApplicationContext } from "../components/application-context.provider";
import { useUtils } from "../hooks/utils.hook";

interface IProps { 
    open: boolean;
    onClose: (reason: CustomFormModalCloseReason) => void;
    showSpinner?: boolean | undefined;
    userData: UserData | undefined
};

const EditUserProfileModal: React.FC<IProps> = ({ onClose, userData, ...other}) => {
    const { t } = useTranslation();
    const { handleSubmit, register, setValue, getFieldState, setError, reset, watch, formState: { errors } } = useForm<ChangeUserData>();
    const { isSmallScreen } = useUtils();
    const { saveUserInfo, userSettings } = useContext(ApplicationContext);
    const { changeUserData } = useUserService();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();
    const { isWithinTimeframe, addDays, durationUntilString, areStringsDifferent } = useUtils();

    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [disabledUsernameField, setDisabledUsernameField] = useState(false);
    const [usernameSubtitle, setUsernameSubtitle] = useState("");

    const watchedFields = watch();

    useEffect(() => {
        if (other.open) {
            if (!getFieldState("username").isDirty) {
                setValue("username", userData?.username || "");
            }
            if (!getFieldState("email").isDirty) {
                setValue("email", userData?.email || "");
            }
            if (!getFieldState("firstName").isDirty) {
                setValue("firstName", userData?.firstName || "");
            }
            if (!getFieldState("lastName").isDirty) {
                setValue("lastName", userData?.lastName || "");
            }
            if (userData && isWithinTimeframe(userData?.lastUsernameChangeAt, userSettings.usernameAllowedChangeFrequencyDays)) {
                setUsernameSubtitle(t("pages.userProfile.nextChangeAt", {
                    duration: durationUntilString(addDays(userData.lastUsernameChangeAt, userSettings.usernameAllowedChangeFrequencyDays)) 
                }));
                setDisabledUsernameField(true);
            } else {
                setUsernameSubtitle(t("modals.editUserProfile.allowedChangeFrequencyDays",
                    { days: userSettings.usernameAllowedChangeFrequencyDays })
                );
                setDisabledUsernameField(false);
            }
        }
    }, [userData, other.open]); // eslint-disable-line react-hooks/exhaustive-deps
    
    const areValuesChanged = () => {
        return areStringsDifferent(watchedFields.username, userData?.username) ||
            areStringsDifferent(watchedFields.email, userData?.email) ||
            areStringsDifferent(watchedFields.firstName, userData?.firstName) ||
            areStringsDifferent(watchedFields.lastName, userData?.lastName);
    }
    
    const onSubmit: SubmitHandler<ChangeUserData> = data => {
        setAwaitingResponse(true);
        changeUserData(data)
            .then(response => {
                successToast(evaluateBackendMessage(response.translationKey));
                if (response.data.accessToken && response.data.refreshToken) {
                    saveUserInfo(response.data);
                }
                onClose("save");
            }).catch(error => {
                var translationKey = error.response?.data?.translationKey;
                errorToast(evaluateBackendMessage(translationKey));
                switch (translationKey) {
                    case "error.user.register.usernameTaken":
                        setError("username", { type: "custom", message: evaluateBackendMessage(translationKey) });
                        break;
                    case "error.user.register.emailTaken":
                        setError("email", { type: "custom", message: evaluateBackendMessage(translationKey) });
                        break;
                }
            }).finally(() => {
                setAwaitingResponse(false);
            });
    };

    const clearFormAndClose = (reason: CustomFormModalCloseReason) => {
        reset();
        onClose(reason);
    };

    return (
        <CustomFormModal title={t("pages.userProfile.editUserData")}
            showNoData={!userData}
            showSubmitButtonSpinner={awaitingResponse}
            disableSubmitButton={!areValuesChanged()}
            onClose={clearFormAndClose}
            onSubmit={handleSubmit(onSubmit)}
            {...other}
        >
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <TextField label={t("user.username") + " *"}
                        variant="outlined"
                        fullWidth
                        {...register("username", { 
                            required: t('validation.required') as string,
                            maxLength: { 
                                value: userSettings.usernameMaxLength,
                                message: t('validation.maxLength', { length: userSettings.usernameMaxLength })
                            },
                            pattern: { value: /^[a-zA-Z0-9_-]*$/, message: t('validation.usernamePattern') }
                        })}
                        disabled={disabledUsernameField}
                        error={errors.username !== undefined}
                        helperText={errors.username?.message || usernameSubtitle}
                    />
                </Grid>

                <Grid item xs={12}>
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

                <Grid item xs={12} md={6}>
                    <TextField label={t("user.firstName")}
                        variant="outlined"
                        fullWidth
                        {...register("firstName", {
                            maxLength: { 
                                value: userSettings.firstNameMaxLength,
                                message: t('validation.maxLength', { length: userSettings.firstNameMaxLength })
                            }
                        })}
                        error={errors.firstName !== undefined}
                        helperText={errors.firstName?.message || (!isSmallScreen && errors.lastName !== undefined && " ")}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField label={t("user.lastName")}
                        variant="outlined"
                        fullWidth
                        {...register("lastName", {
                            maxLength: { 
                                value: userSettings.lastNameMaxLength,
                                message: t('validation.maxLength', { length: userSettings.lastNameMaxLength })
                            }
                        })}
                        error={errors.lastName !== undefined}
                        helperText={errors.lastName?.message || (!isSmallScreen && errors.firstName !== undefined && " ")}
                    />
                </Grid>
            </Grid>
        </CustomFormModal>
    );
}

export default EditUserProfileModal;
