import { useState, useEffect } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import { useParams } from 'react-router-dom'
import * as userAPI from '../../utilities/users-api'
import * as restaurantsAPI from '../../utilities/restaurants-api'
import ContactList from '../../components/ContactList/ContactList'
import UpdateUserForm from '../../components/UpdateUserForm/UpdateUserForm'
import FavRestaurantList from '../../components/FavRestaurantList/FavRestaurantList'
import styles from './UserShowPage.module.scss'
import ShowPagePosts from '../../components/ShowPagePosts/ShowPagePosts'
import { logOut } from '../../utilities/users-service';


export default function UserShowPage(
    { user, setUser }
){
    const {userId} = useParams() 

    const [profilePic, setProfilePic] = useState([])
    const [userName, setUserName] = useState([])
    const [posts, setPosts] = useState([])
  
    const [favRestaurants, setFavRestaurants] = useState([])
    const [showUpdateUserForm, setShowUpdateUserForm] = useState(false)

    const [contacts, setContacts] = useState([]) //get all the contacts populated

    const [newUser, setNewUser] = useState(null)
    const [newUserContacts,setNewUserContacts] = useState([])
    const [userContactIds, setUserContactIds] = useState([]) //get all the logged-in-user contact ids 
    const [clickBtn, setClickBtn] = useState(false)

    console.log(userContactIds)
    console.log(newUserContacts)

    // logged-in-user contacts with only ids
    useEffect(function(){
        async function getUserContactIds(){
            try {
                const data = await userAPI.contactIdIndex()
                setUserContactIds(data)
            } catch (error) {
                console.log(error)
            }
        }
        getUserContactIds()
    },[])

   // get the user's profile, name , posts, contacts + loggedin user's contacts populated , rerender when we see different user
    useEffect(function(){
        
        async function getAllPosts(){
               try{
                const data = await userAPI.showUser(userId)

                    const newData = data.user.posts
                    const newPic = data.user.pic
                    const newName = data.user.name
                    const newconnections = data.user.contacts
        
                    setNewUser(data)
                    setPosts(newData)
                    setProfilePic(newPic)
                    setUserName(newName)
                    setNewUserContacts(newconnections)

               } catch(error){
                console.log(error)
               }
            }
        
        async function getAllUserFav(){
            try{
             const data = await restaurantsAPI.getAllUserFav(userId)
             setFavRestaurants(data)
            } catch(error){
             console.log(error)
            }
         }
         async function getAllContacts(){
            try {
                const data = await userAPI.contactIndex()
                setContacts(data)
            } catch (error) {
                console.log(error)
            }
         }
            getAllPosts()
            getAllUserFav()
            getAllContacts()
           
    },[userId])
   
   
    useEffect(function(){
        async function getnewContacts(){
            try {
                const data = await userAPI.contactIndex()
                setContacts(data)
            } catch (error) {
                console.log(error)
            }
         }
         getnewContacts()
         setUser(user)
    },[userContactIds])


     //functions 
    const deleteAccount = async(id) =>{
        try{
            await userAPI.deleteUser(id)
            logOut()
            console.log('succeeded in deleting this account')
        }catch(error){
            console.log(error)
        }
    }
    
    const addContact = async(id) =>{
        try{
            await userAPI.addContact(id)
            const contactIds = userContactIds.concat(userId)
            setUserContactIds(contactIds)
            const otherContactIds = newUserContacts.concat(user._id)
            setNewUserContacts(otherContactIds)
            console.log('succeeded in adding this new contact')

        }catch(error){
            console.log(error)
        }
    }

    const deleteContact = async(id) =>{
        try{
            await userAPI.deleteContact(id)
       
            const index1 = userContactIds.indexOf(userId)
            const index2 = newUserContacts.indexOf(user._id)
            userContactIds.splice(index1, 1)
            newUserContacts.splice(index2, 1)
            setUserContactIds(userContactIds)
            setNewUserContacts(newUserContacts)
            console.log('succeeded in deleting this new contact')
        }catch(error){
            console.log(error)
        }
    }
    
    console.log(newUser)
    console.log(user)
    console.log(!userContactIds.includes(userId))
    console.log(contacts)
   
 
    return(
        <div className={styles.UserShowPage}>
          {/* Below is only show the current loggedin user's profile */}
          <div className={styles.userInfo}>
            <div className={styles.profileNamePic}>
                <img className={styles.profilePic} src={profilePic}/>
                <h2>{userName}</h2>
            </div>
            <h3>{posts.length} Posts</h3>
            <h3>{newUserContacts.length} Contacts</h3>
          </div>
          {user._id === userId? <ContactList contacts={contacts} user={user} userId={userId} deleteContact={deleteContact}/> :<></>}
          
          {/* following and add contact */}
          {/*  userContactIds gets changed and rerender contacts*/}
          {
            user._id !== userId && !userContactIds.includes(userId)? <button onClick={()=>addContact(userId)}>follow</button>:
            <></>
          }
          {
            user._id !== userId && userContactIds.includes(userId)? 
            <button onClick={()=>deleteContact(userId)}>unfollow</button>:<></>
          }


          {/* unfollowing and delete contact */}

          {/* click button to display or hid the UpdateUserForm*/}
          {user._id === userId?  <button onClick={()=>setShowUpdateUserForm(true)}>Edit profile</button>:<></>}

          {showUpdateUserForm? 
          <UpdateUserForm userId={userId} user={user} setUser={setUser} setShowUpdateUserForm={setShowUpdateUserForm}/>
          :<></>}

          {user._id === userId? <button onClick={()=>deleteAccount(user._id)}>Delete User</button>:<></>}

          <ShowPagePosts allPosts={posts} user={userId}/>

          {/* {user._id === userId?  <button onClick={()=>{deleteAccount(userId),logOut()}}>Delete User</button>:<></>} */}

          <FavRestaurantList restaurants={favRestaurants} user={user}/> 
        <div className={styles.post}>
          <img src="https://picsum.photos/200"/></div>
          {user.name}
          {user.email}
          <NavBar user={user} setUser={setUser}/>
        </div>
       
    )
}