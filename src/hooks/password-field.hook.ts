import { Validate, ValidationRule } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import properties from '../properties.json';

interface Options {
    required: string;
    minLength?: ValidationRule<number> | undefined;
    maxLength?: ValidationRule<number> | undefined;
    validate: Record<string, Validate<string>>;
}

export const usePasswordField = () => {
    const { t } = useTranslation();

    const passwordValidationOptions = (usernameValueGetter?: (() => string) | undefined): Options => {
        const validate: Record<string, Validate<string>> = {};

        if (properties.userSettings.password.smallLetterRequired) {
            validate.mustContainSmallLetter = v => /.*[a-z].*/.test(v) || t('validation.mustContainSmallLetter') as string;
        }
        if (properties.userSettings.password.bigLetterRequired) {
            validate.mustContainBigLetter = v => /.*[A-Z].*/.test(v) || t('validation.mustContainBigLetter') as string;
        }
        if (properties.userSettings.password.digitRequired) {
            validate.mustContainDigit = v => /.*[0-9].*/.test(v) || t('validation.mustContainDigit') as string;
        }
        if (properties.userSettings.password.specialCharacterRequired) {
            validate.mustContainSpecialChar = v => /.*[^a-zA-Z0-9].*/.test(v) || t('validation.mustContainSpecialChar') as string;
        }
        if (properties.userSettings.password.forbidSameAsUsername && usernameValueGetter) {
            validate.cantBeSameAsUsername = v => v.toLowerCase() !== usernameValueGetter().toLowerCase() || t('validation.cantBeSameAsUsername') as string;
        }

        return {
            required: t('validation.required') as string,
            minLength: {
                value: properties.userSettings.password.minLength,
                message: t('validation.minLength', { length: properties.userSettings.password.minLength })
            },
            maxLength: {
                value: properties.userSettings.password.maxLength,
                message: t('validation.maxLength', { length: properties.userSettings.password.maxLength })
            },
            validate
        };
    }

    const repeatPasswordValidationOptions = (passwordValueGetter: () => string): Options => {
        return {
            required: t('validation.required') as string,
            validate: { 
                mustBeSameAsPassword: v => v === passwordValueGetter() || t('validation.mustBeSameAsPassword') as string
            }
        };
    }

    return { passwordValidationOptions, repeatPasswordValidationOptions };
}