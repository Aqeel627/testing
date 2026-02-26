export let injectedToast: ((msg: string) => void) | null = null;

export function setInjectedToast(fn: (msg: string) => void) {
    injectedToast = fn;
}
