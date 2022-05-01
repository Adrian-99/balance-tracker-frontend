export default interface UserData {
    username: string;
    email: string;
    isEmailVerified: boolean;
    firstName?: string | undefined;
    lastName?: string | undefined;
}
