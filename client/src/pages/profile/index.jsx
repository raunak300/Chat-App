import { useAppStore } from "@/store"
//got the user info from store and will be using it in profile page to update the profile after login/signup
 
const Profile = () => {
  const {userInfo} = useAppStore();
  return ( 
    <div>Profile
      <div>Email:{userInfo.email}</div>
    </div>
  )
}

export default Profile


// import { useAppStore } from "@/store";

// const Profile = () => {
//   const { userInfo } = useAppStore();

//   if (!userInfo) {
//     return <div>Loading...</div>; // Or a more appropriate loading state
//   }

//   return (
//     <div>
//       Profile
//       <div>Email: {userInfo.email}</div>
//     </div>
//   );
// };//so i am getting the problem that user get's undefined and need to have som chnages

// export default Profile;