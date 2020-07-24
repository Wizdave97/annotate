export const setActiveTool = (name: string) => {
    return {
        type: "SET_ACTIVE_TOOL",
        payload: {name}
    }
}