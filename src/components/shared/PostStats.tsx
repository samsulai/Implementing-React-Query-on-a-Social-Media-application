import { useUserContext } from "@/context/AuthContext";
import {useState, useEffect} from "react"
import { useDeleteSavedPost, useLikePost, useSavePost,useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";
type PostStatProps = {
    post?: Models.Document;
    userId : string
  };
const PostStats = ({post, userId} : PostStatProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState(likesList)
  const [isSaved, setIsSaved] = useState(false);

  const {mutate : likePost, isPending : isLikingPost} = useLikePost()
  const {mutate : savePost, isPending : isSavingPost} = useSavePost()
  const {mutate : deleteSavePost,isPending : isDeletingSavePost} = useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser();
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );
  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post?.$id || "", likesArray });
  };
  

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userId: userId, postId: post?.$id || "" });
    setIsSaved(true);
  };

  
  return (
    <div className="flex justify-between z-20 items-center">
       <div className="gap-2 mr-5 flex">
       <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium base-medium">{likes.length}</p>
        </div>
        <div className="gap-2  flex">
          {isSavingPost ||  isDeletingSavePost ? <Loader/> :
       <img src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}  onClick={(e) => handleSavePost(e)}/>}
       
        </div>
        </div>
  )
}

export default PostStats