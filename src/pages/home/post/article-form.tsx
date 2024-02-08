import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { collection, addDoc  } from "firebase/firestore";
import {yupResolver} from "@hookform/resolvers/yup"
import { database } from "../../../configuration/firebase";
import { authentication } from "../../../configuration/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface PostArticleForm {
    headline: string;
    article: string;
};

export const ArticleForm = () => {
    const schema = yup.object().shape({
        headline: yup.string().required("Headline is required"),
        article: yup.string().required("Article contents is required")
    });

    const {register, handleSubmit, formState: {errors},} = useForm<PostArticleForm>({
        resolver: yupResolver(schema),
    });

    const [user] = useAuthState(authentication);

    // refernces to a certain collection in firebase app
    const articleReference = collection(database, "feature")

    //waits for function to add doc to the referenced collection and adding
    const onPostArticle = async (data: PostArticleForm) =>{
        await addDoc(articleReference, {
            //...data,
            headline: data.headline,
            article: data.article,
            userId: user?.uid,
            username: user?.displayName,
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onPostArticle)}>
                <input placeholder="Headline" {...register("headline")}/>
                <h4 className="errormessage"> {errors.headline?.message}</h4>
                <textarea placeholder="Article" {...register("article")}/>
                <h4 className="errormessage"> {errors.article?.message}</h4>
                <input type="submit" />
            </form>
        </div>
    );
};