import { act, renderHook } from '@testing-library/react-hooks';
import React, { ReactNode } from 'react';

import { NoProviderError } from '../src/react-container';

import { CounterProvider, counterProviderName, useCounter } from './counter-container';

describe('NoProviderError', () => {
    const renderUseCounter = () => renderHook(() => useCounter()).result;

    test('NoProviderError is thrown if provider is missing', () => {
        const result = renderUseCounter();
        expect(result.error).toBeInstanceOf(NoProviderError);
    });

    test('NoProviderError has correct provider', () => {
        const result = renderUseCounter();
        expect((result.error as NoProviderError<unknown>).provider).toStrictEqual(CounterProvider);
    });

    test('NoProviderError includes provider name in message', () => {
        const result = renderUseCounter();
        expect((result.error as NoProviderError<unknown>).message).toMatch(counterProviderName);
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
