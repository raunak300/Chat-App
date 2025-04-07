import React, {children,useEffect,useState } from "react"
import { BrowserRouter ,Route ,Routes,Navigate,useLocation } from "react-router-dom"
import Auth from "./pages/auth"
import Profile from "./pages/profile"
import Chat from "./pages/chat"
import { useAppStore } from "./store"
import apiClient from "./lib/api-client"
import { GET_USER_INFO } from "./utils/constants"

const PrivateRoute=({children})=>{
  const {userInfo}=useAppStore(); // get user info from appstore-store and see if it is not undefined
  const isAuthenticated=!!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth"/> //children are returned if true childer in rendered
}

//In this PrivateRoute component, children refers to the React components that are wrapped by the PrivateRoute when it's used in your application's routing.

//React Router and Routing:

//This component is typically used with a routing library like React Router to control which components are rendered based on the user's authentication status.
//When you define your routes, you might wrap certain routes with the PrivateRoute component to protect them from unauthorized access.
// children is a special prop that represents the components that are nested inside another component.
{/* <PrivateRoute>
  <ChatComponent />
</PrivateRoute> */}

//^ just opposite to above conditon
const AuthRoute=({children})=>{
  const {userInfo}=useAppStore(); // get user info from appstore-store and see if it is not undefined
  const isAuthenticated=!!userInfo;
  return isAuthenticated ? <Navigate to="/chat"/>: children //children are returned if true childer in rendered
}
 

function App() {
  const {userInfo,setUserInfo}=useAppStore();
  const [loading, setloading] = useState(true)
  //
  // const location = useLocation();
  useEffect(()=>{
      const getUserData=async()=>{
        try {
          const response=await apiClient.get(GET_USER_INFO,{
            withCredentials:true,
          });
        if(response.status===200 && response.data.id){ //response.data.user
          setUserInfo(response.data); //response.data.user
        }else{
          setUserInfo(undefined);
        } 
        } catch (error) {
          console.log(error); 
          setUserInfo(undefined);
        }finally{
          setloading(false);
        }
      } 
      if(userInfo===undefined){
        getUserData();
      }else{
        setloading(false);
      }
      
  },[setUserInfo,userInfo]
)
if(loading){
  return <div>Loading...</div>
}
  return (
    <BrowserRouter>

      <Routes>
         
        <Route path="/auth" element = {
          <AuthRoute>
          <Auth/>
        </AuthRoute>
        
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile/>
          </PrivateRoute>
        } />
        <Route path="/chat" element={
           <PrivateRoute>
           <Chat/>
         </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/auth" />} />

      </Routes>

    </BrowserRouter>
  )
} 

export default App
