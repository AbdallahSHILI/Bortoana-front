import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

//  export const AuthProvider =({Children}) => {

//     const [auth,setAuth]= useState({})

//     return (
//         <AuthContext.Provider value={{auth,setAuth}}>
//          {children}
//         </AuthContext.Provider>
//     )
//  }
//  export default AuthProvider;
