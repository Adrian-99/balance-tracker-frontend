export default interface UserSettings {
    usernameMaxLength: number;
    usernameAllowedChangeFrequencyDays: number;
    firstNameMaxLength: number;
    lastNameMaxLength: number;
    passwordMinLength: number;
    passwordMaxLength: number;
    passwordSmallLetterRequired: boolean;
    passwordBigLetterRequired: boolean;
    passwordDigitRequired: boolean;
    passwordSpecialCharacterRequired: boolean;
    passwordForbidSameAsUsername: boolean;
    passwordForbidSameAsCurrent: boolean;
}