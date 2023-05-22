import { ComponentType, createContext, memo, ReactNode, useContext } from 'react';

export interface ProviderOptionalValueProps<Value> {
    children: ReactNode;
    value?: Value | undefined;
}

export interface ProviderRequiredValueProps<Value> {
    children: ReactNode;
    value: Value;
}

const noValue = Symbol();
const defaultProviderName = 'Provider';

export function createContainer<Value, Result>(
    useCreateContainer: (value?: Value) => Result,
): [ComponentType<ProviderOptionalValueProps<Value>>, () => Result, new () => Error];

export function createContainer<Value, Result>(
    useCreateContainer: (value: Value) => Result,
): [ComponentType<ProviderRequiredValueProps<Value>>, () => Result, new () => Error];

export function createContainer<Value, Result>(
    useCreateContainer: (value?: Value) => Result,
):
    | [ComponentType<ProviderOptionalValueProps<Value>>, () => Result, new () => Error]
    | [ComponentType<ProviderRequiredValueProps<Value>>, () => Result, new () => Error] {
    const ContainerContext = createContext<Result | typeof noValue>(noValue);

    const Provider = memo(
        (props: ProviderOptionalValueProps<Value> | ProviderRequiredValueProps<Value>) => {
            const result = useCreateContainer(props.value!);
            return (
                <ContainerContext.Provider value={result}>
                    {props.children}
                </ContainerContext.Provider>
            );
        },
    );
    Provider.displayName = defaultProviderName;

    class NoProviderError extends Error {
        constructor() {
            const { displayName } = Provider;
            const matchingProvider =
                displayName && displayName !== defaultProviderName
                    ? `<${displayName}/>`
                    : 'matching provider';
            super(`Component using this hook must be wrapped in ${matchingProvider}.`);
        }
    }

    const useContainer = () => {
        const result = useContext(ContainerContext);
        if (result === noValue) {
            throw new NoProviderError();
        }
        return result;
    };

    return [Provider, useContainer, NoProviderError];
}
