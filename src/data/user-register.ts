export default interface UserRegister {
    username: string;
    email: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    password: string;
}