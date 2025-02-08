"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUpload from "../components/FileUpload";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Handle file upload success
  const handleThumbnailUploadSuccess = (res) => {
    setThumbnailUrl(res.url);
    setThumbnailProgress(100);
    toast.success("Thumbnail uploaded successfully!");
  };

  const handleVideoUploadSuccess = (res) => {
    setVideoUrl(res.url);
    setVideoProgress(100);
    toast.success("Video uploaded successfully!");
  };

  // Upload progress handlers
  const handleThumbnailUploadProgress = (progress) => {
    setThumbnailProgress(progress);
  };

  const handleVideoUploadProgress = (progress) => {
    setVideoProgress(progress);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!title || !description || !thumbnailUrl || !videoUrl) {
      toast.error("Please fill in all fields!");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Video uploaded successfully!");
        setTitle("");
        setDescription("");
        setThumbnailUrl("");
        setVideoUrl("");
        setThumbnailProgress(0);
        setVideoProgress(0);
      } else {
        toast.error(data.error || "Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Something went wrong!");
    }
    setUploading(false);
  };

  // Render a loading state while checking authentication
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
        <label className="block text-sm font-medium text-gray-50">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4 bg-gray-700"
          placeholder="Enter video title"
        />

        <label className="block text-sm font-medium text-gray-50">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4 bg-gray-700"
          placeholder="Enter video description"
        />

        <label className="block text-sm font-medium text-gray-50">Upload Thumbnail</label>
        <FileUpload
          onSuccess={handleThumbnailUploadSuccess}
          onProgress={handleThumbnailUploadProgress}
          fileType="image"
        />
        {thumbnailProgress > 0 && (
          <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${thumbnailProgress}%` }}
            ></div>
          </div>
        )}
        {thumbnailProgress > 0 && <p className="text-white text-xs mt-1">{thumbnailProgress}%</p>}

        <label className="block text-sm font-medium text-gray-50 mt-4">Upload Video</label>
        <FileUpload
          onSuccess={handleVideoUploadSuccess}
          onProgress={handleVideoUploadProgress}
          fileType="video"
        />
        {videoProgress > 0 && (
          <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${videoProgress}%` }}
            ></div>
          </div>
        )}
        {videoProgress > 0 && <p className="text-white text-xs mt-1">{videoProgress}%</p>}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="mt-6 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}