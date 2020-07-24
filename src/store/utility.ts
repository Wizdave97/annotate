export const updateObject =(oldObject: any, updatedObject: any)=>{
  return {
    ...oldObject,
    ...updatedObject
  }
}
