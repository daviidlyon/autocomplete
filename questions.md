# Questions

## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

In class-based React components, there are some key differences between **Component** and **PureComponent**. More specifically, in the decision of when to re-render and how they handle **shouldComponentUpdate**.

- In a React component extended from the **Component** class, you will have to explicitly implement `shouldComponentUpdate`, and use this method to decide when to re-render by comparing current, and next states, along with props.

- In a React component that extends **PureComponent**, there is a comparison made in the `shouldComponentUpdate` method handled by default. It is important to note that it is shallow and will only re-render if there is a shallow change in the state or props.

In more recent versions of React where components are functional, `React.memo` is an analogue of `PureComponent` and controls the re-rendering behavior by memoization.

### Example where the app might break

Since the comparison done by **PureComponent** is shallow, when dealing with complex data structure in the props, some bugs can arise and break the app

```js
// For a class-based component with PureComponent
class ChildComponent extends React.PureComponent {
  render() {
    return <div>{this.props.data.user.name}</div>;
  }
}

// If the prop changes in the parent component that uses the PureComponent, it won't React accordingly.
class MyComponent extends React.Component {
  state = {
    data: { user: { name: 'John' } },
  };

  componentDidMount() {
    // Data changes after some time
    setTimeout(() => {
      this.setState((prevState) => ({
        data: {
          ...prevState.data,
          user: {
            ...prevState.data.user,
            name: 'Jane',
          },
        },
      }));
    }, 1000);
  }

  render() {
    return <ChildComponent data={this.state.data} />;
  }
}
```

This happens because the comparison is shallow, and the **data** object is a nested object. `PureComponent` will treat both states as equal and won't update

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

Using Context in React is a way to pass information through component trees without having to send them manually via props on each layer (prop drilling).

The danger of using a combination of `shouldComponentUpdate` in combination with `Context` is that changes done in `Context` could be ignored due to the nature of the `shouldComponentUpdate` behavior. If a component doesn't have its props changed but the context does, it will not re-render, introducing unexpected behaviors.

## 3. Describe 3 ways to pass information from a component to its PARENT.

There are multiple ways that data can be passed up in the component tree from a child component to its parent.

#### 1. Using callbacks

```js
function ParentComponent() {
  const handleData = (data) => {
    console.log('Data received from child:', data);
  };

  return <ChildComponent onClick={handleData} />;
}

function ChildComponent({ onClick }) {
  const clickHandler = () => {
    onClick('Some data from child');
  };

  return <button onClick={clickHandler}>Send Data to Parent</button>;
}
```

#### 2. Using context

```js
const DataContext = React.createContext();

function ParentComponent() {
  const handleData = (data) => {
    console.log('Data from child:', data);
  };

  return (
    <DataContext.Provider value={handleData}>
      <ChildComponent />
    </DataContext.Provider>
  );
}

function ChildComponent() {
  const handleData = useContext(DataContext);

  return (
    <button onClick={() => handleData('Data from deep child')}>
      Send Data
    </button>
  );
}
```

#### 3. State-lifting

The function to mutate the state in the parent component is passed down to its child, allowing it to send data to the parent and having it available in state.

```js
import React, { useState } from 'React';

function ParentComponent() {
  const [message, setMessage] = useState('');

  return (
    <div>
      <ChildComponent setMessage={setMessage} />
      <p>Message from Child: {message}</p>
    </div>
  );
}

function ChildComponent({ setMessage }) {
  return <input onChange={(e) => setMessage(e.target.value)} />;
}
```

### Extra:

You can also use state-management technologies like **Redux** which allows you to have information being sent in both directions from Parent to Child components.

## 4. Give 2 ways to prevent components from re-rendering.

As stated before, we can use `shouldComponentUpdate` and its functional approach React.memo to prevent components from re-rendering whenever needed.

#### 1. Use React.memo

React.memo is an HOC that wraps around functional components to prevent re-renders.

```js
const MyComponent = React.memo(function MyComponent({ text }) {
  return <div>{text}</div>;
}, areEqual);

function areEqual(prevProps, nextProps) {
  return prevProps.text === nextProps.text;
}
```

#### 2. Use shouldComponentUpdate

```js
class MyComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.props.text;
  }

  render() {
    return <div>{this.props.text}</div>;
  }
}
```

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

Sometimes you need multiple components in the same level of the returned JSX, for example:

```js
// Something like this, we know it won't work, and sometimes we don't want to wrap all of these elements inside another div
...
return
  <div> </div>
  <div> </div>
  <div> </div>;
...
```

The solution we have is `React.Fragment`, which acts as a wrapper for multiple same-level elements when we don't want to add additional wrapping elements in our DOM (note that we can also specify it as `<> ... </>`)

```js
return (
  <React.Fragment>
    <div> </div>
    <div> </div>
    <div> </div>
  </React.Fragment>
);
```

If we are using a solution that requires a certain DOM structure, and we are not careful, we could break the app

```js
function Component() {
  return (
    <div id='app-root'>
      <React.Fragment>
        <div id='first-child'>First Child</div>
        <div id='second-child'>Second Child</div>
      </React.Fragment>
      <div>Text...</div>
    </div>
  );
}

function someFunction() {
  // For example, we want to color a container for the #first-child and #second-child elements, it would mistakenly color #first-child
  document.querySelector('#app-root').firstElementChild.style.color = 'blue';
}
```

## 6. Give 3 examples of the HOC pattern.

#### 1. Using React-router's withRouter

```js
import { withRouter } from 'React-router-dom';

function MyComponent({ history, location, match }) {
  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
}

export default withRouter(MyComponent);
```

#### 2. Using an authentication HOC

```js
const withAuthentication = (WrappedComponent) => {
  return (props) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <Redirect to='/login' />;
    }

    return <WrappedComponent {...props} />;
  };
};

const ProtectedPage = () => (
  <div>This is a protected page. You must be logged in to see this.</div>
);

const AuthProtectedPage = withAuthentication(ProtectedPage);
```

#### 3. Creating an Error Boundary HOC

```js
function withErrorBoundary(WrappedComponent) {
  return function ErrorBoundaryWrapper(props) {
    render() {
      return (
        <ErrorBoundary>
          <WrappedComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  };
}
```

## 7. What's the difference in handling exceptions in promises, callbacks and async...await?

The concept of an exception is the same on the three approaches, but the syntax and programming patterns can change

### 1. Promises

In promises, you typically have the `.catch()` method to access and handle the exception

```js
fetch('...')
  .then((response) => {
    /* do something */
  })
  .catch((error) => console.error('Error fetching data:', error));
```

### 2. Callbacks

In callbacks the exception error is an argument specified in the callback fn and can be accessed as follows:

```js
fs.readFile('...', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  // Do something else
});
```

### 3. Async/Await

In Async/Await, you can use the try/catch block to access the exception

```js
async function fetchData() {
  try {
    const response = await fetch('...');
    const data = await response.json();
    /* do something */
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

## 8. How many arguments does setState take and why is it async.

`setState` can receive up to 2 arguments (the second one is optional). The first one is the state update, which can be an Object or a function. The second one is a Callback that will be executed once setState has finished.

It is async for React to optimize the mutation of the state even when multiple changes are performed (by grouping or batching), and this allows the reactivity to perform in a better fashion making changes more predictable.

## 9. List the steps needed to migrate a Class to Function Component.

We can perform these steps in slightly different orders, but we basically need to translate pieces of the Component into the new fashion.

1. Migrate the basic structure, like the JSX from render to return, and changing class to function
2. Convert ALL state-related functionallity to the useState hook
3. Convert lifecycle methods (class-based components has a lot of different methods, functional mostly uses useEffect) into the useEffect hook
4. Convert class methods to functions (this can be done by using arrow functions)
5. Check `this` class bindings, as they are not used in functional components
6. Translate other types of functions into hooks (like refs, or context)
7. Remove remaining class-based syntax, such as constructor, etc..
8. [Important!] Do testing, this will allow you to catch unexpected bugs that can be introduced by this migration

## 10. List a few ways styles can be used with components.

There are multiple ways and libraries to style components, here are a few:

- Use inline-styles

```js
...
return <div style={{ color: 'white' }}></div>
...
```

- Use css modules (you can see multiple usages in my project)

```js
import styles from './styles.module.css'
...
return <div className={styles.coloredDivf}></div>
...
```

- Use styled-components. Libraries like styletron and styled-components can provide a custom way to build styling in elements

```js
const Title = styled.h1`
  font-size: 2rem;
`;

function MyComponent() {
  return (
    <div>
      <Title>This is the title</Title>
    </div>
  );
}
```

- Directly import css. (Your classes will be global, which changes your approach)

```js
import './styles.module.css';

function MyComponent() {
  return <div className='color-div'></div>;
}
```

## 11. How to render an HTML string coming from the server.

React will escape the strings that have an HTML structure coming from the server, so we can't natively just render them as

```js
return <div>{serverHTML}</div>;
```

It will just directly render the HTML instead of its representation.

We can use `dangerouslySetInnerHTML`, but as we see from the naming itself, it is something to use with extreme care, since vulnerabilities can arise if done wrong

```js
function HTMLContent({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```
There are different solutions and libraries to prevent XSS, in order to do that, you should sanitize. There are libraries like `dompurify` which help you doing that. You can also sanitize them in the server-level if it is in your control.