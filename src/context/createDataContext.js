import React, {useReducer} from 'react';


/*
CreateDataContext

Returns a Context/Provider pair, given a reducer, 
the actions for the reducer, 
and default values for the state object.

*/
export default (reducer, actions, defaultValue)=>{
    const Context = React.createContext();

    const Provider = ({children})=>{
        const [state, dispatch] = useReducer(reducer, defaultValue);
        const boundActions = {};
        for (let key in actions){
            boundActions[key] = actions[key](dispatch);
            /*
            Note:
            Actions is an array of functions that require a dispatch function parameter.
            The above gives the reducer's dispatch, delcared above, as the parameter.
            */
        }
        return (
            <Context.Provider value={{state, ...boundActions }}>
                {children}
            </Context.Provider>
        );
    };
    
    return {Context, Provider};
};
