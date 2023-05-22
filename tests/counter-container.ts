import { useState } from 'react';

import { createContainer } from '../src/react-container';

const useCounterContainer = (initialCount?: number) => {
    const [count, setCount] = useState(initialCount ?? 0);

    const increment = () => {
        setCount(count => count + 1);
    };

    return { count, increment };
};

export const [CounterProvider, useCounter, NoProviderError] = createContainer(useCounterContainer);

export const counterProviderName = 'CounterProvider';
CounterProvider.displayName = counterProviderName;
