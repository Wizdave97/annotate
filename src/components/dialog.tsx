import React, { useState } from 'react';
import Spinner from './spinner/spinner';
import { Session } from '../App';
import { useQuery, gql, NetworkStatus } from '@apollo/client';


type DialogProps = {
    accountId: number | null
    userId: number | null
    setSessionType: (type: Session, id: string | null) => any
    createSessionId: () => string
    loadSession: (annotation: string) => any
    loadAnnotation: (annotation: string) => any
}
const ACTIVE_SESSIONS_QUERY = gql`
    query getActiveSessions($accountId: Int!){
        activeSessions(accountId: $accountId) {
            sessionId
            members
            annotations
        }
    }
`
const SAVED_ANNOTATIONS_QUERY = gql`
    query getSavedAnnotations($accountId: Int!, $page: Int!) {
        annotations(accountId: $accountId page:$page) {
           annotations {
                sessionId
                annotation
           }
           nextPage 
        }
    }
`
const Dialog: React.FC<DialogProps> = (props) => {
    const activeSessionsQueryResult = useQuery(ACTIVE_SESSIONS_QUERY, {
        variables: { accountId: props.accountId },
        notifyOnNetworkStatusChange: true,
    });
    const savedAnnotationsQueryResult = useQuery(SAVED_ANNOTATIONS_QUERY, {
        variables: {accountId: props.accountId, page: 1},
        notifyOnNetworkStatusChange: true
    })
    const activeSessionsLoading = activeSessionsQueryResult.loading, activeSessionsError = activeSessionsQueryResult.error,
        activeSessionsData = activeSessionsQueryResult.data

    let activeSessionsView = <Spinner />
    if (activeSessionsQueryResult.networkStatus === NetworkStatus.refetch) {
        activeSessionsView = <Spinner />
    }
    if (!activeSessionsLoading && activeSessionsError) {
        activeSessionsView = <ErrorView refetch={activeSessionsQueryResult.refetch} />
    }
    if (!activeSessionsLoading && activeSessionsData && activeSessionsData.length > 0) {
        activeSessionsView = activeSessionsData.map((session:{[key: string]: any}) => {
            return (<div key={session.sessionId} onClick={(e: React.MouseEvent<HTMLDivElement>) =>{
                props.loadSession(session.annotation);
                props.setSessionType(Session.Active, session.sessionId);
            }} className="w-32 rounded-md flex flex-col content-center p-2 items-center justify-center mx-2 shadow-xl">
                 {session.members((name: string, index: number) => (
                 <span key={index.toString() + name} className="text-sm font-bold text-blue-700 my-1">{name}</span>))}
            </div>)
        })
    }
    if (!activeSessionsLoading && activeSessionsData && activeSessionsData.length < 1) {
        activeSessionsView = <span className="text-xs font-bold text-gray-800">There are no active sessions at this time</span>
    }
    
    return (
        <React.Fragment>
            <div className="w-full h-full fixed top-0 left-0 z-40 opacity-75 bg-blue-900"></div>
            <div className="absolute w-full h-full top-0 z-50 left-0 flex justify-center items-center">
                <div className="w-8/12 h-64 overflow-y-auto rounded-md bg-white flex flex-col p-2">
                    <div className="w-full p-2 my-2 flex justify-center">
                        <h4 className="font-medium text-md text-gray-900">How would you like to work?</h4>
                    </div>
                    <div className="w-full p-2 my-2 flex flex-col items-center content-center justify-center ">
                        <h3 className="font-medium text-lg mb-2 text-gray-900">Start a private session?</h3>
                        <span role="button" onClick={() => props.setSessionType(Session.Private, null)} className="p-2 bg-blue-500 hover:bg-blue-800 text-white text-sm rounded-md">Start Private Session</span>
                    </div>
                    <div className="w-full p-2 my-2 flex flex-col items-center content-center justify-center ">
                        <h3 className="font-medium text-lg mb-2 text-gray-900">Start a collaborative session</h3>
                        <span role="button" onClick={() => props.setSessionType(Session.Collaborative, props.createSessionId())}  className="p-2 bg-blue-500 hover:bg-blue-800 text-white text-sm rounded-md">Start Collaborative Session</span>
                    </div>
                    <div className="w-full p-2 my-2 flex flex-col items-center content-center justify-center border-b border-t border-gray-300">
                        <h3 className="font-medium text-lg text-gray-900">Join an active session</h3>
                        <div className="w-full overflow-x-auto inline p-2">{activeSessionsView}</div>
                    </div>
                    <div className="w-full p-2 my-2 flex flex-col items-center content-center justify-center">
                        <h3 className="font-medium text-lg text-gray-900">Load previously saved annotations</h3>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}
const ErrorView: React.FC<any> = (props) => (<div className="w-full flex flex-col items-center content-center justify-center">
    <p className="p-2 mb-2 text-sm">An error occurred fetching sessions, please try again</p>
    <span role="button" onClick={(e: React.MouseEvent<HTMLSpanElement>) => props.refetch()} className="p-2 bg-blue-500 hover:bg-blue-800 text-white text-sm rounded-md">Retry</span>
</div>)
export default Dialog;
