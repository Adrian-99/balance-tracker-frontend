import { CheckCircleOutline as EmailVerifiedIcon, EditOff as UsernameChangeBlockedIcon } from "@mui/icons-material";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicationContext } from "../components/application-context.provider";
import PageCardComponent from "../components/page-card.component"
import SpinnerOrNoDataComponent from "../components/spinner-or-no-data.component";
import UserData from "../data/user-data";
import { useCustomToast } from "../hooks/custom-toast.hook";
import { useUserService } from "../hooks/user-service.hook";
import { CustomFormModalCloseReason } from "../modals/custom-form.modal";
import EditUserProfileModal from "../modals/edit-user-profile.modal";
import VerifyEmailModal from "../modals/verify-email.modal";
import { useUtils } from "../hooks/utils.hook";
import DataListComponent from "../components/data-list.component";

const UserProfilePage: React.FC = () => {
    const { action } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, validationRules } = useContext(ApplicationContext);
    const { getUserData } = useUserService();
    const { errorToast, evaluateBackendMessage } = useCustomToast();
    const { isSmallScreen, isWithinTimeframe, addDays, durationUntilString } = useUtils();

    const EDIT_MODAL_URL = "edit";
    const VERIFY_EMAIL_MODAL_URL = "verify-email";
    const ACTIONS = [
        { name: t("pages.userProfile.editUserData"), action: () => navigate(EDIT_MODAL_URL) },
        { name: t("pages.userProfile.verifyEmail"), action: () => navigate(VERIFY_EMAIL_MODAL_URL) }
    ];

    const [awaitingUserData, setAwaitingUserData] = useState(true);
    const [userData, setUserData] = useState<UserData | undefined>(undefined);

    useEffect(() => {
        if (action && ((action === VERIFY_EMAIL_MODAL_URL && user?.isEmailVerified) ||
            (action !== EDIT_MODAL_URL && action !== VERIFY_EMAIL_MODAL_URL))) {
            onModalClose("cancel");
        }
        updateUserData();
    }, [user?.accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateUserData = () => {
        setAwaitingUserData(true);
        getUserData()
            .then(response => {
                setUserData(response.data);
            }).catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.TranslationKey));
                setUserData(undefined);
            }).finally(() => {
                setAwaitingUserData(false);
            });
    };

    const onModalClose = (_reason: CustomFormModalCloseReason) => {
        navigate("/user-profile");
    };

    return (
        <PageCardComponent title={t("pages.userProfile.title")} actions={
            userData ? 
                userData.isEmailVerified ?
                    ACTIONS.slice(0, 1) :
                    ACTIONS :
                undefined
        }>
            { !awaitingUserData && userData ?
                <DataListComponent
                    data={[
                        {
                            name: t("user.username"),
                            value: 
                                <Box display="flex" flexWrap="wrap" alignItems="center">
                                    <Typography variant="body2" sx={{ mx: "4px" }}>{userData.username}</Typography>
                                    { isWithinTimeframe(userData.lastUsernameChangeAt, validationRules.userUsernameAllowedChangeFrequencyDays) &&
                                        (isSmallScreen ? 
                                            <Chip icon={<UsernameChangeBlockedIcon />} 
                                                label={
                                                    t("pages.userProfile.nextChangeAt", {
                                                        duration: durationUntilString(addDays(userData.lastUsernameChangeAt, validationRules.userUsernameAllowedChangeFrequencyDays)) 
                                                    })
                                                }
                                                size="small"
                                                variant="outlined"
                                                sx={{ mx: "4px" }}
                                            />
                                            :
                                            <Tooltip title={
                                                    t("pages.userProfile.nextChangeAt", {
                                                        duration: durationUntilString(addDays(userData.lastUsernameChangeAt, validationRules.userUsernameAllowedChangeFrequencyDays)) 
                                                    }) as string
                                                }
                                                arrow
                                                sx={{ mx: "4px" }}
                                            >
                                                <UsernameChangeBlockedIcon />
                                            </Tooltip>
                                        )
                                    }
                                </Box>
                        },
                        {
                            name: t("user.email"),
                            value:
                                <Box display="flex" flexWrap="wrap" alignItems="center">
                                    <Typography variant="body2" sx={{ mx: "4px" }}>{userData.email}</Typography>
                                    { userData.isEmailVerified &&
                                        (isSmallScreen ?
                                            <Chip icon={<EmailVerifiedIcon />} 
                                                label={t("pages.userProfile.verified")}
                                                size="small"
                                                variant="outlined"
                                                sx={{ mx: "4px" }}
                                            />
                                            :
                                            <Tooltip title={t("pages.userProfile.verified") as string} arrow sx={{ mx: "4px" }}>
                                                <EmailVerifiedIcon />
                                            </Tooltip>
                                        )
                                    }
                                </Box>
                        },
                        {
                            name: t("user.firstName"),
                            value: userData.firstName || "—"
                        },
                        {
                            name: t("user.lastName"),
                            value: userData.lastName || "—"
                        }
                    ]}
                />
                :
                <SpinnerOrNoDataComponent showSpinner={awaitingUserData} showNoData={!userData} />
            }

            <EditUserProfileModal open={action === EDIT_MODAL_URL}
                onClose={onModalClose}
                userData={userData}
                showSpinner={awaitingUserData} />
            
            <VerifyEmailModal open={action === VERIFY_EMAIL_MODAL_URL}
                onClose={onModalClose} />
        </PageCardComponent>
    );
}

export default UserProfilePage;
