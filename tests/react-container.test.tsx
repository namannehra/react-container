import { describe, expect, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';

import {
    CounterProvider,
    counterProviderName,
    NoProviderError,
    useCounter,
} from './counter-container';

describe('NoProviderError', () => {
    const renderUseCounter = () => renderHook(() => useCounter()).result;

    test('NoProviderError is thrown if provider is missing', () => {
        const result = renderUseCounter();
        expect(result.error).toBeInstanceOf(NoProviderError);
    });

    test('NoProviderError includes provider name in message', () => {
        const result = renderUseCounter();
        expect(result.error!.message).toMatch(counterProviderName);
    });
});

describe('useCounter', () => {
    const initialCount = 7;

    interface WrapperProps {
        children: ReactNode;
    }

    const Wrapper = (props: WrapperProps) => (
        <CounterProvider value={initialCount}>{props.children}</CounterProvider>
    );

    const renderUseCounter = () =>
        renderHook(() => useCounter(), {
            wrapper: Wrapper,
        }).result;

    test('Initial count is correct', () => {
        const result = renderUseCounter();
        expect(result.current.count).toStrictEqual(initialCount);
    });

    test('Increment works', () => {
        const result = renderUseCounter();
        act(() => {
            result.current.increment();
        });
        expect(result.current.count).toStrictEqual(initialCount + 1);
    });
});
