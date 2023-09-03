# react-store

basic store for react states

copt-paste code from here and use it

There is 1 utility and 1 hook and a store

## store

store is a centralized place to keep track of app-wide states

Note:

- global state is for read-only purposes
- global state should not be mutated directly, it will cause discrepancy

## createStore

utility to create and initialize store
should be used when app initializes, and should be done only once

## useState

custom use state hook with synchronous state and global state

What's new:

- synchronous state (illusion of)
- global state accessible through `getGlobalState`
- params to give `stateName` for `globalState`

### On a Side Note: Why

out of curiosity

always wanted to make a centralized store, where things don't have to be wrapper in a context provider

still global state cannot be changed from another component, which provides good opportunity to dig deep into state management in react
will go through that rabbit-hole for sure, but for now, this much satisfies the needs for the project
