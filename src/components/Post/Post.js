import CommentList from '../CommentList/CommentList'
import CreateCommentForm from '../CreateCommentForm/CreateCommentForm'
import * as postAPI from '../../utilities/posts-api'
import {Heart, ThumbsDown} from 'lucide-react'
import { FaHeart } from "react-icons/fa";
import { Rating } from 'react-simple-star-rating'
import {useState, useEffect} from 'react'
import styles from './Post.module.scss'
// import {getDownloadURL} from 'firebase/storage'

export default function Post(
    {post}
){

    //setup the url for the image to show it
    const [image, setImage] = useState('')
    // useEffect(()=>{getDownloadURL(post.pic).then((url)=>{
    //     setImage(url)
    // })},[])

    const[liked, setLiked] = useState(false);
    // const handleClick = () => {
    //   setLiked(!liked);
    // };

    async function handleLikePost(postId) {
        
        try {
            await postAPI.likePost(postId);
            console.log('Post successfully liked');
           
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }

    async function handleUnlikePost(postId) {
        
        try {
            await postAPI.unlikePost(postId);
            console.log('Post successfully unliked');
           
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }
    return(
        <>
            <h3 className={styles.left_align}>{post.user}</h3>
            <h3>{post.title}</h3>
           
            {/* <img src={image}/> */}
            <h3>{post.dish}</h3>
            <Rating
                value={post.rating}
            />
            <h3 className={styles.left_align}>{post.likes} likes</h3>
            <h3>{post.body}</h3>
            {/* <h3>{post.rating}</h3> */}
           
            {/* <button onClick={()=>{handleLikePost(post._id)}}>like</button>
            <button onClick={()=>{handleUnlikePost(post._id)}}>unlike</button> */}
             
              {
                liked?  <div  onClick={()=>{handleUnlikePost(post._id),setLiked(!liked)}} ><FaHeart style={{color: 'red', fontSize: '30px'}} /></div>:
                <div  onClick={()=>{handleLikePost(post._id),setLiked(!liked)}} ><Heart color='black' fontSize='40px'/></div>
              }
            

            <CommentList postId={post._id}/>
            <CreateCommentForm postId={post._id}/>

        </>
    )
}