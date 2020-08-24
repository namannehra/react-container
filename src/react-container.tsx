import React, { ComponentType, createContext, memo, ReactNode, useContext } from 'react';

export interface ProviderNoValueProps {
    children: ReactNode;
}

export interface ProviderOptionalValueProps<Value> {
    children: ReactNode;
    value?: Value;
}

export interface ProviderRequiredValueProps<Value> {
    children: ReactNode;
    value: Value;
}

const noValue = Symbol();

const defaultProviderName = 'Provider';

export class NoProviderError<Props> extends Error {
    readonly provider: ComponentType<Props>;

    constructor(provider: ComponentType<Props>) {
        const { displayName } = provider;
        const matchingProvider =
            displayName && displayName !== defaultProviderName
                ? `<${displayName}/>`
                : 'matching provider';
        super(`Component using this hook must be wrapped in ${matchingProvider}.`);
        this.provider = provider;
    }
}

export function createContainer<Result>(
    useCreateContainer: () => Result,
): [ComponentType<ProviderNoValueProps>, () => Result];

export function createContainer<Value, Result>(
    useCreateContainer: (value?: Value) => Result,
): [ComponentType<ProviderOptionalValueProps<Value>>, () => Result];

export function createContainer<Value, Result>(
    useCreateContainer: (value: Value) => Result,
): [ComponentType<ProviderRequiredValueProps<Value>>, () => Result];

export function createContainer<Value, Result>(
    useCreateContainer: (value: Value) => Result,
): [
    (
        | ComponentType<ProviderOptionalValueProps<Value>>
        | ComponentType<ProviderRequiredValueProps<Value>>
    ),
    () => Result,
] {
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

    const useContainer = () => {
        const result = useContext(ContainerContext);

        if (result === noValue) {
            throw new NoProviderError(Provider);
        }

        return result;
    };

    return [Provider, useContainer];
}
