# React Container

Simple React state management using context and hooks

-   **Easy to learn** if you already know React hooks

-   **Written in TypeScript**

## Install

### Yarn

```
yarn add @namannehra/react-container
```

### NPM

```
npm install @namannehra/react-container
```

## Example

```js
import { createContainer } from '@namannehra/react-container';
import React, { useState } from 'react';
import { render } from 'react-dom';

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
    <CounterProvider value={1}>
        <Counter></Counter>
        <Counter></Counter>
    </CounterProvider>
);

render(<App></App>, document.getElementById('root'));
```

## Guide

### Step 1.

Let's start with a simple component.

```js
const Counter = () => {
    const [count, setCount] = useState(1);
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
    const { count, increment } = useCounter(1);
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
    <CounterProvider value={1}>
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
    <CounterProvider value={1}>
        <Counter></Counter>
        <Counter></Counter>
    </CounterProvider>
);
```

## API

### `createContainer()`

```js
const useCounterContainer = initialCount => {
    const [count, setCount] = useState(initialCount);
    const increment = () => {
        setCount(count => count + 1);
    };
    return { count, increment };
};

const [CounterProvider, useCounter] = createContainer(useCounterContainer);
```

### `NoProviderError`

This error is thrown if component is not wrapped in provider.

## Tips

### 1. Display name

You should set the `displayName` of provider. This will help in debugging.

```js
const useCounterContainer = initialCount => {
    const [count, setCount] = useState(initialCount);
    const increment = () => {
        setCount(count => count + 1);
    };
    return { count, increment };
};

const [CounterProvider, useCounter] = createContainer(useCounterContainer);
CounterProvider.displayName = 'CounterProvider';
```

Error message when `displayName` is not set

```
Error: Component using this hook must be wrapped in matching provider.
```

Error message when `displayName` is set

```
Error: Component using this hook must be wrapped in <CounterProvider/>.
```

### 2. Composing

You can break your logic into smaller hooks. You can also use containers inside hooks.

```js
const useCounterContainer = initialCount => {
    const [count, setCount] = useState(initialCount);
    const increment = () => {
        setCount(count => count + 1);
    };
    return { count, setCount, increment };
};

const [CounterProvider, useCounter] = createContainer(useCounterContainer);

const useResettableCounter = initialCount => {
    [initialCount] = useState(initialCount);
    const counter = useCounter(initialCount);
    const reset = () => {
        counter.setCount(initialCount);
    };
    return { ...counter, reset };
};
```

### 3. Optimizing

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

The idea for this project came from unstated-next. The only big difference between `react-container`
and `unstated-next` is the value passed to the provider. In `unstated-next` only initial state can
be passed to the provider. In `react-container` any value can be passed to the provider.

#### `unstated-next`

Only the message with id "1" will be displayed.

```js
const useMessageContainer = id => {
    const [message, setMessage] = useState();
    useEffect(() => {
        fetch(`https://api.example.com/messages/${id}`)
            .then(response => response.text())
            .then(setMessage);
    }, [id]);
    return message;
};

const MessageContainer = createContainer(useMessageContainer);

const MessageComponent = () => {
    const message = MessageContainer.useContainer();
    if (!message) {
        return null;
    }
    return <span>Message is {message}</span>;
};

const App = () => {
    const [id, setId] = useState(1);
    const increment = () => {
        setId(id => id + 1);
    };
    return (
        <MessageContainer.Provider initialState={id}>
            <MessageComponent></MessageComponent>
            <MessageComponent></MessageComponent>
            <button onClick={increment}>+1</button>
        </MessageContainer.Provider>
    );
};
```

#### `react-container`

Messages will change with id.

```jsx
const useMessageContainer = id => {
    const [message, setMessage] = useState(1);
    useEffect(() => {
        fetch(`https://api.example.com/messages/${id}`)
            .then(response => response.text())
            .then(setMessage);
    }, [id]);
    return message;
};

const [MessageProvider, useMessage] = createContainer(useMessageContainer);

const MessageComponent = () => {
    const message = useMessage();
    if (!message) {
        return null;
    }
    return <span>Message is {message}</span>;
};

const App = () => {
    const [id, setId] = useState(0);
    const increment = () => {
        setId(id => id + 1);
    };
    return (
        <MessageProvider value={id}>
            <MessageComponent></MessageComponent>
            <MessageComponent></MessageComponent>
            <button onClick={increment}>+1</button>
        </MessageProvider>
    );
};
```
