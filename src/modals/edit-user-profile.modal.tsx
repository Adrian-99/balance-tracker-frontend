import properties from "../properties.json";
import { Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ChangeUserData from "../data/change-user-data";
import UserData from "../data/user-data";
import { CustomFormModal, CustomFormModalCloseReason } from "./custom-form.modal";
import { useUserService } from "../hooks/user-service.hook";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { ApplicationContext } from "../components/application-context.provider";

interface IProps { 
    open: boolean;
    onClose: (reason: CustomFormModalCloseReason) => void;
    showSpinner?: boolean | undefined;
    userData: UserData | undefined
};

const EditUserProfileModal: React.FC<IProps> = ({ onClose, userData, ...other}) => {
    const { t } = useTranslation();
    const { handleSubmit, register, setValue, getFieldState, setError, reset, watch, formState: { errors } } = useForm<ChangeUserData>();
    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("md"));
    const { user: { saveUserInfo } } = useContext(ApplicationContext);
    const { changeUserData } = useUserService();
    const { successToast, errorToast, evaluateBackendMessage } = useCustomToast();

    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const watchedFields = watch();

    useEffect(() => {
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
    }, [userData, other.open]);
    
    const areValuesChanged = () => {
        const areStringsDifferent = (str1: string | null | undefined, str2: string | null | undefined): boolean => {
            if ((str1 === null || str1 === undefined || str1 === "") && (str2 === null || str2 === undefined || str2 === "")) {
                return false;
            }
            return str1 !== str2;
        }

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
                if (response.accessToken && response.refreshToken) {
                    saveUserInfo(response);
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
                                value: properties.userSettings.username.maxLength,
                                message: t('validation.maxLength', { length: properties.userSettings.username.maxLength })
                            },
                            pattern: { value: /^[a-zA-Z0-9_-]*$/, message: t('validation.usernamePattern') }
                        })}
                        error={errors.username !== undefined}
                        helperText={errors.username?.message}
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
                                value: properties.userSettings.firstName.maxLength,
                                message: t('validation.maxLength', { length: properties.userSettings.firstName.maxLength })
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
                                value: properties.userSettings.lastName.maxLength,
                                message: t('validation.maxLength', { length: properties.userSettings.lastName.maxLength })
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
