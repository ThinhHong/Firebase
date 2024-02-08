import { addDoc, getDocs,collection, query, where, deleteDoc, doc} from "firebase/firestore";
import { database, authentication } from "../../configuration/firebase";
import { Article as InterfaceArticle } from "./Homepage"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface ArticleProps {
  article: InterfaceArticle;
};

interface Like{
  likeId: string;
  viewerId: String; 
};

interface Dislike{
  dislikeId: string;
  viewerId: string;
};

export const ShowArticle = (props: ArticleProps) => {
    //deconstructing props into article
    const {article} = props;

    const [viewer] = useAuthState(authentication);

    const likeReference = collection( database, "upvotes");
    const dislikeReference = collection(database,'downvotes');

    const likeQuery = query(likeReference, where("postId", "==", article.id));
    const dislikeQuery = query(dislikeReference, where("postId", "==", article.id));

    const [likes,setLikes] = useState<Like[] | null> (null);
    const [dislikes, setDislikes] = useState<Dislike[] | null> (null);

    const getLikes = async() => {
      const likeData = await getDocs(likeQuery);
      setLikes(likeData.docs.map((like) => ({likeId: like.id, viewerId: like.data().viewerId})) as Like[]);
    };

    const getDislikes = async() => {
      const dislikeData = await getDocs(dislikeQuery);
      setDislikes(dislikeData.docs.map((dislike) => ({dislikeId: dislike.id, viewerId: dislike.data().viewerId})) as Dislike[]);
    };

    useEffect(() => {
      getLikes()
      getDislikes()
  },[]);

    const like = async () => {
      const newLike = {postId: article.id, viewerId: viewer?.uid,};
      try{
        const newLikeAdded = await addDoc (likeReference, newLike);
        //checks if a user is logged on
        if (viewer){
          //if previous likes array is empty, creates new array with new like. Otherwise returns an array with previous array and new LIke
          setLikes((prev) => 
            prev 
            ? [...prev, {likeId: newLikeAdded.id, viewerId: viewer.uid}]
            : [{likeId: newLikeAdded.id, viewerId: viewer.uid}]
          )
        }
        else{
          alert("You must be logged on to like an article");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const dislike = async() => {
      const newDislike = {postId: article.id, viewerId: viewer?.uid};
      try {
          //checks if a user is logged on
          if (viewer){
              const newDislikeAdded= await addDoc(dislikeReference, newDislike); 
              //if previous dislikes array is empty, creates new array with new dislike. Otherwise returns an array with previous array and new disLIke
              setDislikes((prev) => (
                  prev 
                  ? [...prev, {dislikeId: newDislikeAdded.id, viewerId: viewer.uid}]
                  : [{dislikeId: newDislikeAdded.id, viewerId: viewer.uid}])
              );
          }
          else{
            alert("You must be logged on to dislike an article");
          }
      }
      catch (error){
        console.log(error);
      }
  };

    const removeLike = async () => {
      try{
        const likeDeleteQuery = await query(likeReference, 
          where("postId", "==", article.id,), 
          where("viewerId","==",article.userId)
          );
        const removeLikeId = (await getDocs(likeDeleteQuery)).docs[0].id;
        const removedLike = await doc(database, "upvotes", removeLikeId);
        await deleteDoc(removedLike);
        if (viewer){
          setLikes((prev) => prev 
          && prev.filter((like) => like.likeId !== removeLikeId));
        }
      } catch (error) {
        console.log(error);
      }
    };

    const removeDislike = async() => {
      try{
        const removeDislikeQuery = query(
          dislikeReference, 
          where("postId", "==", article.id), 
          where("viewerId", "==", viewer?.uid)
          );
        const removeDislikeId = (await getDocs(removeDislikeQuery)).docs[0].id;
        const removeDislike = await doc(database,"downvotes", removeDislikeId);
        await deleteDoc(removeDislike);
        if (viewer){
            setDislikes((prev) => (
                prev
                && prev.filter((dislike) => dislike.dislikeId !== removeDislikeId)
            ));
            }
      }
      catch (error){
          console.log(error);
      };
  };

    const didLike = likes?.find((like) => like.viewerId === viewer?.uid);
    const didDislike = dislikes?.find((dislike) => dislike.viewerId === viewer?.uid);
  

    return (
        <div>
     
          <div id="Title">
            <h1>{article.headline}</h1>
          </div>
          <div id="Contents">
            <p>{article.article}</p>
          </div>
          <div id="User">
            <p className="Username">@{article.username}</p>
          </div>
          <div id="Reaction">
            <button onClick={!didLike ? like : removeLike}> {!didLike ? <>&#128077;</> : <>&#128077; </>} </button>
            {likes && <p>Likes: {likes.length}</p>}
            <button onClick={!didDislike ? dislike : removeDislike}> {!didDislike ? <>&#128078;</> : <>&#128078; </>} </button>
            {likes && <p>Dislikes: {dislikes?.length}</p>}
          </div>
        </div>
    );
};