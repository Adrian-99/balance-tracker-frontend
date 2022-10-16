export default interface ValidationRules {
    userUsernameMaxLength: number;
    userUsernameAllowedChangeFrequencyDays: number;
    userFirstNameMaxLength: number;
    userLastNameMaxLength: number;
    userPasswordMinLength: number;
    userPasswordMaxLength: number;
    userPasswordSmallLetterRequired: boolean;
    userPasswordBigLetterRequired: boolean;
    userPasswordDigitRequired: boolean;
    userPasswordSpecialCharacterRequired: boolean;
    userPasswordForbidSameAsUsername: boolean;
    userPasswordForbidSameAsCurrent: boolean;
    entryNameMaxLength: number;
    entryDescriptionMaxLength: number;
    tagNameMaxLength: number;
}