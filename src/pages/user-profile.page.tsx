import { CheckCircleOutline as EmailVerifiedIcon, EditOff as UsernameChangeBlockedIcon } from "@mui/icons-material";
import { Box, Chip, Grid, List, ListItem, Tooltip, Typography } from "@mui/material";
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

const UserProfilePage: React.FC = () => {
    const { action } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, userSettings } = useContext(ApplicationContext);
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
            .then(data => {
                setUserData(data);
            }).catch(error => {
                errorToast(evaluateBackendMessage(error.response?.data?.translationKey));
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
                <List>
                    <ListItem>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1">{t("user.username")}:</Typography>
                            </Grid>
                            <Grid item xs={12} md="auto">
                                <Box display="flex" flexWrap="wrap" alignItems="center">
                                    <Typography variant="body2" sx={{ mx: "4px" }}>{userData.username}</Typography>
                                    { isWithinTimeframe(userData.lastUsernameChangeAt, userSettings.usernameAllowedChangeFrequencyDays) &&
                                        (isSmallScreen ? 
                                            <Chip icon={<UsernameChangeBlockedIcon />} 
                                                label={
                                                    t("pages.userProfile.nextChangeAt", {
                                                        duration: durationUntilString(addDays(userData.lastUsernameChangeAt, userSettings.usernameAllowedChangeFrequencyDays)) 
                                                    })
                                                }
                                                size="small"
                                                variant="outlined"
                                                sx={{ mx: "4px" }}
                                            />
                                            :
                                            <Tooltip title={
                                                    t("pages.userProfile.nextChangeAt", {
                                                        duration: durationUntilString(addDays(userData.lastUsernameChangeAt, userSettings.usernameAllowedChangeFrequencyDays)) 
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
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container alignItems="center">
                            <Grid item xs={10} md={4}>
                                <Typography variant="body1">{t("user.email")}:</Typography>
                            </Grid>
                            <Grid item xs={10} md="auto">
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
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1">{t("user.firstName")}:</Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="body2" sx={{ mx: "4px" }}>{userData.firstName || "—"}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1">{t("user.lastName")}:</Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="body2" sx={{ mx: "4px" }}>{userData.lastName || "—"}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
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
