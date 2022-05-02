import { useState } from "react";

export function useLocalStorage<T>(key: string): [() => T | undefined, (newValue: T | undefined) => void] {
    const getValueFromLocalStorage = (): T | undefined => {
        const stringValue = localStorage.getItem(key);
        return stringValue ? JSON.parse(stringValue) as T : undefined;
    }

    const [value, setValue] = useState(getValueFromLocalStorage());

    const setValueWithEvent = (newValue: T | undefined) => {
        if (newValue) {
            localStorage.setItem(key, JSON.stringify(newValue));
        } else {
            localStorage.removeItem(key);
        }
        setValue(newValue);
    }

    return [() => value, setValueWithEvent];
}