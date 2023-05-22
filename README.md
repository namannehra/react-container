Simple React state management using context and hooks

## Example

```js
import { createContainer } from '@namannehra/react-container';
import { useState } from 'react';

const useCounterContainer = initialCount => {
    const [count, setCount] = useState(initialCount);
    const increment = () => {
        setCount(count => count + 1);
    };
    return { count, increment };
};

const [CounterProvider, useCounter] = createContainer(useCounterContainer);

const Counter = () => {
    const { count, increment } = useCounter();
    return (
        <div>
            <span>{count}</span>
            <button onClick={increment}>+1</button>
        </div>
    );
};

const App = () => (
    <CounterProvider value={0}>
        <Counter></Counter>
        <Counter></Counter>
    </CounterProvider>
);
```

## Guide

### Step 1.

Let's start with a simple component.

```js
const Counter = () => {
    const [count, setCount] = useState(0);
    const increment = () => {
        setCount(count => count + 1);
    };
    return (
        <div>
            <span>{count}</span>
            <button onClick={increment}>+1</button>
        </div>
    );
};
```

### Step 2.

If you want to share the logic then you can put it in a custom hook.

```js
const useCounter = initialCount => {
    const [count, setCount] = useState(initialCount);
    const increment = () => {
        setCount(count => count + 1);
    };
    return { count, increment };
};

const Counter = () => {
    const { count, increment } = useCounter(0);
    return (
        <div>
            <span>{count}</span>
            <button onClick={increment}>+1</button>
        </div>
    );
};
```

### Step 3.

If you want to share the state then you can use context.

```js
const useCounter = initialCount => {
    const [count, setCount] = useState(initialCount);
    const increment = () => {
        setCount(count => count + 1);
    };
    return { count, increment };
};

const CounterContext = createContext();

const CounterProvider = props => {
    const counter = useCounter(props.value);
    return <CounterContext.Provider value={counter}>{props.children}</CounterContext.Provider>;
};

const Counter = () => {
    const { count, increment } = useContext(CounterContext);
    return (
        <div>
            <span>{count}</span>
            <button onClick={increment}>+1</button>
        </div>
    );
};

const App = () => (
    <CounterProvider value={0}>
        <Counter></Counter>
        <Counter></Counter>
    </CounterProvider>
);
```

### Step 4.

You can do the same with `createContainer()`. A container is just a pair of provider and hook.

```js
const useCounterContainer = initialCount => {
    const [count, setCount] = useState(initialCount);
    const increment = () => {
        setCount(count => count + 1);
    };
    return { count, increment };
};

const [CounterProvider, useCounter] = createContainer(useCounterContainer);

const Counter = () => {
    const { count, increment } = useCounter();
    return (
        <div>
            <span>{count}</span>
            <button onClick={increment}>+1</button>
        </div>
    );
};

const App = () => (
    <CounterProvider value={0}>
        <Counter></Counter>
        <Counter></Counter>
    </CounterProvider>
);
```

## API

### `createContainer`

`useCreateContainer => [Provider, useContainer, NoProviderError]`

`useCreateContainer`: `(value: Value) => Result`

`Provider`: `Component<{value: Value}>`

`useContainer`: `() => Result`

`NoProviderError`: `Subclass<Error>`

## Tips

### 1. Display name

You should set the `displayName` of provider.
[Learn more](https://legacy.reactjs.org/docs/react-component.html#displayname)

```js
const [CounterProvider, useCounter] = createContainer(...);
CounterProvider.displayName = 'CounterProvider';
```

### 2. Optimizing

You can use standard React optimizations like `useCallback()` and `useMemo()`.

```js
const useCounterContainer = initialCount => {
    const [count, setCount] = useState(initialCount);
    const increment = useCallback(() => {
        setCount(count => count + 1);
    }, [setCount]);
    return { count, increment };
};

const [CounterProvider, useCounter] = createContainer(useCounterContainer);
```

## Credits

### Unstated Next

https://github.com/jamiebuilds/unstated-next

The idea for this project came from unstated-next.
