import { Article as InterfaceArticle } from "./Homepage";
import { authentication, database } from "../../configuration/firebase";
import { addDoc, collection, deleteDoc, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {useEffect, useState} from 'react';
import { where, getDocs, doc } from "firebase/firestore";

interface ArticleProps{
    article: InterfaceArticle
}
interface Dislike{
    dislikeId: string;
    viewerId: string;
};

export const downvote = (props: ArticleProps) =>{

    const {article} = props;
    const [viewer] = useAuthState(authentication);
    const downvotesReference = collection(database,'downvotes');
    const downvotesArticle = query(downvotesReference, where("postId", "==", article.id))
    const [dislikeList, setDislikeList] = useState<Dislike[] | null> (null);

    const getDislikes = async() => {
        const dislikeData = await getDocs(downvotesArticle);
        setDislikeList(dislikeData.docs.map((dislike) => ({dislikeId: dislike.id, viewerId: dislike.data().viewerId})) as Dislike[]);
        };
    
    useEffect(() => {
        getDislikes()
    },[]);

    const dislike = async() => {
        const dislikeAdded = {disLikeId: viewer?.uid, viewerId: viewer?.uid};
        try {
            if (viewer){
                const addedDislike = await addDoc(downvotesReference, dislikeAdded); 
                setDislikeList((prev) => (
                    prev 
                    ? [...prev, {dislikeId: addedDislike.id, viewerId: viewer.uid}]
                    : [{dislikeId: addedDislike.id, viewerId: viewer.uid}])
                );
            }
        }
        catch (error){
            console.log(error);
        }
    };

    const unDislike = async() => {

        try{
            const removeDislikeData = query(
                downvotesReference, 
                where("postId", "==", article.id), 
                where("viewerId", "==", viewer?.uid));
        
            const removeDislikeId = (await getDocs(removeDislikeData)).docs[0].id;
            const removeDislike = await doc(database,"downvotes", removeDislikeId);
            await deleteDoc(removeDislike);

            if (viewer){
                setDislikeList((prev) => (
                    prev
                    && prev.filter((dislike) => dislike.dislikeId !== removeDislikeId)
                ));
                }
        }
        catch (error){
            console.log(error);
        };
    };
};