/// This middleware converts actions which are classes to simple objects so
/// that redux will accept them.
export const classMiddleware = store => next => action => {
    const plain = Object.assign({}, action);
    plain.type = action.type;
    return next(plain);
}

/// The type of an action. This simply uses the class name as the action type.
export class Action {
    get type() {
        return this.constructor.name;
    }
}

export type Reducer<State, Action> =
    (last: State, action: Action) => State;

/// Matches any constructor for the type T. Used only to extract the type of
/// the constructed item, so we don't actually care about the arguments.
interface Constructor<T> {
    new (...args: any[]): T;
}

/// Initiates a fluent chain to construct a reducer for a given set of actions.
/// This chain is completely type-safe, and type-inferred. The state and action
/// parameters for the "when" calls will be correctly inferred to their specific
/// types, based on the first argument (Set or Reset in the example below), and
/// the original default state's type.
///
/// Example use:
///   const myReducer = startingFrom(defaultState)
///     .when(Set, (state, action) => action.nextState)
///     .when(Reset, (state, action) => defaultState)
///	    .done;
export function startingFrom<State>(initial: State) {
    let accumulator: { [type: string]: any } = {};

    function when<Act extends Action>(type: Constructor<Act>, result: Reducer<State, Act>) {
        accumulator[type.name] = result;

        function done(last: State, action: Action) {
            return last && (accumulator[action.type] && accumulator[action.type](last, action) || last) || initial;
        }

        return {
            when,
            done
        };
    }

    return {
        when
    };
}

export class Add extends Action {
    constructor(public readonly value: number) {
        super();
    }
}

export class Reset extends Action { }

export const counter = 
    startingFrom(0)
        .when(Add, (state, action) => state + action.value)
        .when(Reset, (state, action) => 0)
        .done;