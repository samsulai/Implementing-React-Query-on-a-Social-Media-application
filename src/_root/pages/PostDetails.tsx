
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import { useDeletePost, useGetPostById } from '@/lib/react-query/queriesAndMutations';
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";
import { multiFormatDateString } from "@/lib/utils";

const PostDetails = () => {
  
  const { mutate: deletePost } = useDeletePost();
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id);
  const { user } = useUserContext();

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
   // navigate(-1);
  };

  return (
    <div className="post_details-container">
    {isPending ? <Loader /> : (
      <div className="post_details-card">
         <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />
        <div className="post_details-info">
          <div className="flex-between w-full">
          <Link to={`/profile/{post.Creator.$id}`} className="flex items-center ">
<img src={post?.Creator?.imageUrl ||  "/assets/icons/profile-placeholder.svg"} alt="creator"  className="w-12 lg:h-12 rounded-full"/>

<div className="flex flex-col">
<p className="base-medium lg:body-bold  text-light-1">{post?.Creator.name}</p>
<div className="flex items-center gap-2 text-light-3">
    <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)}</p>
    --
    <p className="subtle-semibold lg:small-regular">{post?.location}</p>
</div>
</div>
</Link>

<div className="flex-center gap-4">
<Link  to={`/update-post/${post?.$id}`}  className={`${user.id !== post?.Creator.$id && "hidden"}`}>
<img
src={"/assets/icons/edit.svg"}
alt="edit"
width={24}
height={24}
/></Link>

<Button
                   onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.Creator.$id && "hidden"
                  }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
</div>
</div>
<hr className="border w-full border-dark-4/80" />
<div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>

            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
</div>
        </div>
    )}
    </div>
  )
}

export default PostDetails