import React, { ReactNode } from 'react'
import { updateObject } from '../utility'

export type IState = {
    active: string | null
}
type Context = {
    state: IState,
    dispatch: React.Dispatch<any>
}

type Action = {
    payload: {[key: string]: any}
    type: string
}
const initialState={
    active: null
}
export const AppContext=React.createContext<Context>({state: initialState, dispatch:()=>{}})

const reducer=(state: IState,action: Action)=>{
    switch(action.type){
        case 'SET_ACTIVE_TOOL':
            return updateObject(state, {active: action.payload.name})
        default:
            return state
    }
}



const StateProvider: React.FC<React.PropsWithChildren<object & { children? : ReactNode}>> = (props ) => { 
    const [state,dispatch]=React.useReducer(reducer,initialState)
    
    return (
        <AppContext.Provider value={{state, dispatch}}>
            {props.children}
        </AppContext.Provider>
        
        ) 
}

export const connect = (mapStateToProps: any,mapDispatchToProps: any)=>{

    return function(WrappedComponent: React.FC<any> | React.ComponentClass<any, any>){
        return (props:React.PropsWithChildren<{[key: string]: any, children? : ReactNode}>)=>(
            <AppContext.Consumer>
            {store=>{
                const state=mapStateToProps?mapStateToProps(store.state):{}
                const dispatch=mapDispatchToProps?mapDispatchToProps(store.dispatch):{}
                return (
                    <WrappedComponent {...props} {...state} {...dispatch} />
                )
            }}
            </AppContext.Consumer>
        )
        
    }

}

export default StateProvider