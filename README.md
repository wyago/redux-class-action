# Redux class action

This module lets you declare actions using classes, where the type string of
the actions is equivalent to the class's constructor name. More importantly,
the module has a facility for handling those actions in a type-safe way while
allowing types to be inferred. All together, this lets you use redux actions
without any code duplication, and with as little boilerplate as possible.

Here's an example of a super simple reducer:
```javascript
import { Action, startingFrom } from "redux-class-action";

export class Add extends Action {
    constructor(public readonly amount: number) {
        super();
    }
}

export class Reset extends Action { }

export const counter = 
    startingFrom({ counter: 10 })
        .when(Add, (state, action) => ({ counter: state.counter + action.amount }))
        .when(Reset, (state, action) => ({ counter: 0 }))
        .done;
```

Every function parameter in the reducer is typed as expected. The system figures
out the type expected via the first parameter, the class constructor, which also
gives the runtime enough information to know the action's type (the 
constructor's name).

Redux doesn't allow actions to be anything other than plain records, so this
libary also provides the classMiddleware to strip away the class information.
