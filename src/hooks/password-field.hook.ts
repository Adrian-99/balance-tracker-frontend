import { useContext } from 'react';
import { Validate, ValidationRule } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../components/application-context.provider';

interface Options {
    required: string;
    minLength?: ValidationRule<number> | undefined;
    maxLength?: ValidationRule<number> | undefined;
    validate: Record<string, Validate<string>>;
}

export const usePasswordField = () => {
    const { t } = useTranslation();
    const { validationRules } = useContext(ApplicationContext);

    const passwordValidationOptions = (usernameValueGetter?: (() => string) | undefined,
        currentPasswordGetter?: (() => string) | undefined): Options => {
        const validate: Record<string, Validate<string>> = {};

        if (validationRules.userPasswordSmallLetterRequired) {
            validate.mustContainSmallLetter = v => /.*[a-z].*/.test(v) || t('validation.mustContainSmallLetter') as string;
        }
        if (validationRules.userPasswordBigLetterRequired) {
            validate.mustContainBigLetter = v => /.*[A-Z].*/.test(v) || t('validation.mustContainBigLetter') as string;
        }
        if (validationRules.userPasswordDigitRequired) {
            validate.mustContainDigit = v => /.*[0-9].*/.test(v) || t('validation.mustContainDigit') as string;
        }
        if (validationRules.userPasswordSpecialCharacterRequired) {
            validate.mustContainSpecialChar = v => /.*[^a-zA-Z0-9].*/.test(v) || t('validation.mustContainSpecialChar') as string;
        }
        if (validationRules.userPasswordForbidSameAsUsername && usernameValueGetter) {
            validate.cantBeSameAsUsername = v => v.toLowerCase() !== usernameValueGetter().toLowerCase() || t('validation.cantBeSameAsUsername') as string;
        }
        if (validationRules.userPasswordForbidSameAsCurrent && currentPasswordGetter) {
            validate.cantBeSameAsCurrent = v => v !== currentPasswordGetter() || t("backend.error.validation.passwordSameAsCurrentOne") as string;
        }

        return {
            required: t('validation.required') as string,
            minLength: {
                value: validationRules.userPasswordMinLength,
                message: t('validation.minLength', { length: validationRules.userPasswordMinLength })
            },
            maxLength: {
                value: validationRules.userPasswordMaxLength,
                message: t('validation.maxLength', { length: validationRules.userPasswordMaxLength })
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