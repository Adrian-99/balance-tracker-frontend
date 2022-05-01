import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string): [() => T | undefined, (newValue: T | undefined) => void] {
    const EVENT_PREFIX = "localStorage.";

    const getValueFromLocalStorage = (): T | undefined => {
        const stringValue = localStorage.getItem(key);
        return stringValue ? JSON.parse(stringValue) as T : undefined;
    }

    const [value, setValue] = useState(getValueFromLocalStorage());
    const [firstRender, setFirstRender] = useState(true);

    const setValueWithEvent = (newValue: T | undefined) => {
        if (newValue) {
            localStorage.setItem(key, JSON.stringify(newValue));
        } else {
            localStorage.removeItem(key);
        }
        window.dispatchEvent(new Event(EVENT_PREFIX + key));
    }

    
    useEffect(() => {
        console.log("register " + key);
        window.addEventListener(EVENT_PREFIX + key, () => setValue(getValueFromLocalStorage()));
        setFirstRender(false);
    }, [key]);

    return [() => value, setValueWithEvent];
}