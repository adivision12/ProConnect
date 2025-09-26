import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import useController from '../stateManagement/useController';
import { FaThumbsUp, FaCommentAlt, FaEllipsisH } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Comment from './Comment';
import Loading from './Loading';
import { getTimeAgo } from '../utils/getTimeAgo';
import ReactMarkdown from "react-markdown";

export default function PostCard({ post }) {
  const [authUser] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelected } = useController();

  const [openComment, setOpenComment] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);

  const [postForm, setPostForm] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const [formData, setFormData] = useState({
    body: post.body || '',
    media: post.media || '',
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  // Navigate to profile/user
  const onPostClick = async (id) => {
    if (id === authUser.user._id) {
      navigate("/profile");
      return;
    }
    setSelected(id);
    navigate(`/userProfile/${id}`);
  };

  // Fetch post comments
  useEffect(() => {
    const getPostComment = async () => {
      let result = await fetch(`/api/get_post_comments?postId=${post._id}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await result.json();
      data.reverse();
      setPostComments(data);
    };
    getPostComment();
  }, [post._id]);

  // Set liked state
  useEffect(() => {
    setIsLiked(post.likes?.includes(authUser.user._id));
  }, [post.likes, authUser.user._id]);

  // Scroll to post if URL has postId
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetPostId = params.get('postId');
    if (targetPostId) {
      const el = document.getElementById(`post-${targetPostId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.search]);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const handleInput = (e) => setComment(e.target.value);

  // Post actions
  const likeToggle = async (id) => {
    const token = authUser.token || authUser.user.token;
    try {
      const response = await fetch("/api/increment_likes", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      } else toast.error("Failed to like post");
    } catch (err) { toast.error("Something went wrong"); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const token = authUser.token || authUser.user.token;
    try {
      let result = await fetch(`/api/post_comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ comment, postId: post._id }),
      });
      const data = await result.json();
      if (data.success) toast.success(data.msg);
      else toast.error(data.msg);
      setComment("");
    } catch (err) { toast.error("Something went wrong"); }
  };

  const deletePost = async (id) => {
    const token = authUser.token || authUser.user.token;
    setIsLoading(true);
    try {
      const res = await fetch("/api/delete_Post", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ postId: id }),
      });
      const data = await res.json();
      if (data.success) toast.success(data.msg);
      else toast.error(data.msg);
      setTimeout(() => window.location.reload(), 500);
    } catch (err) { toast.error("Something went wrong"); }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = authUser.token || authUser.user.token;
    setIsLoading(true);
    try {
      const postData = new FormData();
      postData.append("media", formData.media);
      postData.append("body", formData.body);
      const res = await fetch(`/api/edit_Post?postId=${post._id}`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: postData,
      });
      const data = await res.json();
      if (data.success) toast.success(data.msg);
      else toast.error(data.msg);
      setTimeout(() => window.location.reload(), 500);
    } catch (err) { toast.error("Something went wrong"); }
    setIsLoading(false);
  };

  // AI Handlers
  const handleEnhanceAI = async () => {
    if (!formData.body.trim()) { toast.error("Write something first"); return; }
    setAiLoading(true);
    try {
      const token = authUser.token || authUser.user.token;
      const res = await fetch("/api/ai/enhancePost", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: formData.body }),
      });
      const data = await res.json();
      if (data.success) setFormData((prev) => ({ ...prev, body: data.enhancedText }));
      else toast.error(data.msg || "AI failed");
    } catch (err) { toast.error("AI service error"); }
    setAiLoading(false);
  };

  const handleRewriteAI = async () => {
    if (!formData.body.trim()) { toast.error("Write something first"); return; }
    setAiLoading(true);
    try {
      const token = authUser.token || authUser.user.token;
      const res = await fetch("/api/ai/rewritePost", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: formData.body }),
      });
      const data = await res.json();
      if (data.success) toast.success("AI suggested new versions");
      else toast.error(data.msg || "AI rewrite failed");
    } catch (err) { toast.error("AI service error"); }
    setAiLoading(false);
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) { toast.error("Enter a prompt/title"); return; }
    setAiLoading(true);
    try {
      const token = authUser.token || authUser.user.token;
      const res = await fetch("/api/ai/generatePost", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, body: data.generatedText }));
        toast.success("Post generated successfully 🚀");
        setShowAiInput(false);
        setAiPrompt("");
      } else toast.error(data.msg || "AI generation failed");
    } catch (err) { toast.error("AI service error"); }
    setAiLoading(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full">
      {/* Post Header */}
      {isLoading && <Loading />}
      <div id={`post-${post._id}`} className="flex items-start px-6 py-4">
        <img
          onClick={() => onPostClick(post.userId._id)}
          src={post.userId.profilePicture}
          alt="Profile"
          className="h-16 w-16 rounded-full object-cover border border-gray-300"
        />
        <div className="flex-1 ml-4">
          <div className="flex items-center justify-between">
            <div onClick={() => onPostClick(post.userId._id)}>
              <h2 className="font-semibold text-lg">{post.userId.name}</h2>
              <p className="text-sm text-gray-600">{post.userId.bio}</p>
              <p className="text-xs text-gray-500 mt-0.5">{getTimeAgo(post.createdAt)}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"
              >
                <FaEllipsisH />
              </button>
              {open && (
                post.userId._id === authUser.user._id ? (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => setPostForm(true)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      ✏️ Edit Post
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-red-100"
                    >
                      🗑️ Delete Post
                    </button>
                  </div>
                ) : (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => navigator.clipboard.writeText(window.location.origin + `/userProfile/${post.userId._id}/posts?postId=${post._id}`)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Copy post link
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      {postForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {(isLoading || aiLoading) && <Loading />}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setPostForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Body */}
              <div>
                <label className="block text-sm font-medium mb-1">Update your post</label>
                <textarea
                  name="body"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.body}
                  onChange={handleInputChange}
                  rows={8}
                  required
                />
              </div>

              {/* AI Generate Input */}
              {showAiInput && (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter title/prompt for AI generation..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Generate
                  </button>
                </div>
              )}

              {/* AI Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEnhanceAI}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Enhance with AI
                </button>
                <button
                  type="button"
                  onClick={() => setShowAiInput((prev) => !prev)}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Rewrite / Generate Options
                </button>
              </div>

              {/* Media */}
              <div>
                <label className="block text-sm font-medium mb-1">Change Image</label>
                
                 <input
              type="file"
              name="media"
              accept="image/*"
              onChange={handleInputChange}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
                {formData.media && typeof formData.media !== "string" && (
                  <img
                    src={URL.createObjectURL(formData.media)}
                    alt="Preview"
                    className="mt-2 max-h-24 rounded-lg"
                  />
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPostForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Body */}
      {/* <div className="px-6 pb-4">
        <p className={`text-gray-800 text-sm leading-relaxed ${!showFull ? 'line-clamp-1' : ''}`}>
          {post.body}
        </p>
        {post.body.length > 100 && !showFull && (
          <span
            onClick={() => setShowFull(true)}
            className="text-blue-600 cursor-pointer hover:underline ml-6 text-sm"
          >
            Read more
          </span>
        )}
      </div> */}
      {/* Post Body */}
<div className="px-6 pb-4">
  <div className={`text-gray-800 text-md leading-relaxed space-y-2  ${!showFull ? 'line-clamp-2' : ''}`}>
    <ReactMarkdown >
    {post.body}
  </ReactMarkdown></div>
  
  {/* Read more for long text */}
  {!showFull && post.body.length > 100 && (
    <span
      onClick={() => setShowFull(true)}
      className="text-blue-600 cursor-pointer hover:underline  text-sm"
    >
      Read more
    </span>
  )}
</div>


      {/* Post Media */}
      {post.media && (
        <div className="w-full">
          <img
            src={post.media}
            alt="Post media"
            className="w-full max-h-[300px] object-cover"
          />
        </div>
      )}

      {/* Reactions */}
      <div className="px-6 py-2 flex items-center justify-between text-gray-600 text-sm">
        <div className="flex items-center space-x-1">
          <FaThumbsUp className={`${isLiked ? 'text-blue-600' : ''}`} />
          <span>{likesCount}</span>
        </div>
        {postComments.length > 0 && (
          <div onClick={() => setOpenComment(true)} className="cursor-pointer">
            {postComments.length} <span>comments</span>
          </div>
        )}
      </div>
      <hr />

      {/* Actions */}
      <div className="px-6 py-2 flex justify-between text-gray-600">
        <button onClick={() => likeToggle(post._id)} className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded w-full justify-center">
          <FaThumbsUp className={isLiked ? 'text-blue-600' : ''} />
          <span className="text-sm">Like</span>
        </button>
        <button onClick={() => setOpenComment(true)} className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded w-full justify-center">
          <FaCommentAlt />
          <span className="text-sm">Comment</span>
        </button>
      </div>

      {/* Comment input */}
      <div className={`flex ${openComment ? 'block' : 'hidden'} items-center px-6`}>
        <img src={authUser.user.profilePicture} alt="Profile" className="h-10 w-10 rounded-full object-cover border border-gray-300 my-2" />
        <form onSubmit={handleComment} className="w-[85%] border-gray-500 h-12 border-2 rounded-full my-2 flex items-center px-2">
          <input
            onChange={handleInput}
            value={comment}
            type="text"
            placeholder="Add a comment"
            className="w-[80%] lg:w-[90%] outline-none rounded-full px-2 py-1"
          />
          <button type="submit" className="ml-2">
            <i className="fa-solid fa-paper-plane text-2xl cursor-pointer"></i>
          </button>
        </form>
      </div>

      {/* Display Comments */}
      {openComment && postComments.length > 0 && (
        <div className="px-6 py-4">
          <span className="ml-2 font-semibold text-sm">Comments:</span>
          {postComments.map((comment) => <Comment key={comment._id} comment={comment} />)}
        </div>
      )}
    </div>
  );
}
