import React, { useState } from "react";
import { useDataContext } from "../Context/DataProvider";
import { useAuth } from "../Context/AuthProvider";
import toast from "react-hot-toast";
import Loading from "./Loading";

export default function CreatePost() {
  const { postForm, setPostForm } = useDataContext();
  const [isLoading, setIsLoading] = useState(false);
  const [authUser] = useAuth();
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    body: "",
    media: "",
  });

  const [showAiInput, setShowAiInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // 🔹 Enhance text with AI
  const handleEnhance = async () => {
    if (!formData.body.trim()) {
      toast.error("Write something first to enhance.");
      return;
    }
    try {
      setAiLoading(true);
      const token = authUser.token || authUser.user.token;

      const res = await fetch("/api/ai/enhancePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: formData.body }),
      });

      const data = await res.json();
      setAiLoading(false);

      if (data.success) {
        setFormData((prev) => ({ ...prev, body: data.enhancedText }));
        toast.success("Post enhanced with AI ✨");
      } else {
        toast.error(data.msg || "AI enhancement failed");
      }
    } catch (error) {
      setAiLoading(false);
      toast.error("Error connecting to AI service");
    }
  };

  // 🔹 Generate post with AI using a prompt/title
  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a title or prompt first.");
      return;
    }
    try {
      setAiLoading(true);
      const token = authUser.token || authUser.user.token;

      const res = await fetch("/api/ai/generatePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await res.json();
      setAiLoading(false);

      if (data.success) {
        setFormData((prev) => ({ ...prev, body: data.generatedText }));
        toast.success("Post generated successfully 🚀");
        setShowAiInput(false);
        setAiPrompt("");
      } else {
        toast.error(data.msg || "Failed to generate post");
      }
    } catch (error) {
      setAiLoading(false);
      toast.error("Error connecting to AI service");
    }
  };

  // 🔹 Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.body.trim()) {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const token = authUser.token || authUser.user.token;

      const postData = new FormData();
      postData.append("body", formData.body);
      if (formData.media) postData.append("media", formData.media);

      const res = await fetch("/api/post", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: postData,
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        toast.success("Post created successfully!");
        setPostForm(false);
        window.location.reload();
      } else {
        toast.error(data.msg || "Failed to create post");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Error creating post");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {(isLoading || aiLoading) && <Loading />}
      <div className="bg-white rounded-2xl shadow-xl w-[95%] max-w-lg p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => setPostForm(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a Post</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Textarea */}
          <div>
            <textarea
              name="body"
              placeholder="What's on your mind?"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              rows="4"
              value={formData.body}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* AI Actions */}
          <div className="flex flex-col gap-3">
            {/* Enhance Button */}
            <button
              type="button"
              onClick={handleEnhance}
              className="flex-1 px-4 py-2 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition"
            >
              ✨ Enhance
            </button>

            {/* Generate Button & Prompt Input */}
            {!showAiInput ? (
              <button
                type="button"
                onClick={() => setShowAiInput(true)}
                className="flex-1 px-4 py-2 rounded-full bg-purple-500 text-white font-medium hover:bg-purple-600 transition"
              >
                🚀 Generate Post
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter post title/prompt..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-full px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                >
                  Generate
                </button>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Add Image
            </label>
            <input
              type="file"
              name="media"
              accept="image/*"
              onChange={handleInputChange}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />

            {/* Image Preview */}
            {formData.media && typeof formData.media !== "string" && (
              <img
                src={URL.createObjectURL(formData.media)}
                alt="Preview"
                className="mt-3 max-h-48 rounded-lg border"
              />
            )}
          </div>

          {/* Submit / Cancel */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPostForm(false)}
              className="px-5 py-2 rounded-full border text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
