import {collection, getDocs} from'firebase/firestore';
import { database } from '../../configuration/firebase';
import { useState, useEffect } from 'react';
import { ShowArticle} from './Article';


export interface Article {
    userId: string;
    username: string;
    headline: string;
    article: string;
    id: string;
}
export const Home = () => {
    const articleReference = collection(database, "feature");
    const [articleList, setArticleList] = useState<Article[] | null>(null);
    const getArticle = async () => {
        const articleData = await getDocs(articleReference);
        // sets article list to collection from firebase as an array of interface articles
        setArticleList(articleData.docs.map((doc) => ({...doc.data(), id: doc.id})) as Article[]);
    };

    useEffect(() =>{
        getArticle();
    },[]);
     
    
    return (
    <div>
        <h1>Homepage</h1>
        <div className='article'>{ articleList?.map((article) => (
            <ShowArticle article={article}/>
        ))}
        </div>
    </div>
    )
};