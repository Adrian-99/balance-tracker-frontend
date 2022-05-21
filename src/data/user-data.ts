export default interface UserData {
    username: string;
    lastUsernameChangeAt: Date;
    email: string;
    isEmailVerified: boolean;
    firstName?: string | undefined;
    lastName?: string | undefined;
}
