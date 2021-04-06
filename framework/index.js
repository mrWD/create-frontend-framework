import * as snabbdom from 'snabbdom';

const patch = snabbdom.init([
  require('snabbdom/modules/eventlisteners').default,
]);

export const init = (selector, component) => {
  const app = document.querySelector(selector);
  patch(app, component.template);
};

let state = {};

export const createComponent = ({
  template,
  methods = {},
  initialState = {},
}) => {
  state = initialState;
  let previous;

  const mappedMethods = props => Object.entries(methods).reduce(
    (acc, [key, method]) => ({
      ...acc,
      [key]: (...args) => {
        state = method(state, ...args);

        const nextNode = template({
          ...props,
          ...state,
          methods: mappedMethods(props),
        });

        patch(previous.template, nextNode.template);

        previous = nextNode;

        return state;
      }
    }),
    {},
  );

  return props => {
    previous = template({ ...props, ...state, methods: mappedMethods(props) });
    return previous;
  };
};
