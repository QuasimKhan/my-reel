"use client";
import React  from "react";
import {  IKUpload } from "imagekitio-next";
import {Loader2} from 'lucide-react';






export default function FileUpload({onSuccess, onProgress, fileType = "image"}) {

    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState(null)
 
 
  const onError = (err) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
  };
  
  const handleSuccess = (res) => {
    console.log("Success", res);
    setUploading(false);
    setError(null);
    onSuccess(res);
  };
  
  const handleProgress = (evt) => {
   if (evt.lengthComputable && onProgress) {
       const percentComplete = (evt.loaded / evt.total) * 100;
       onProgress(Math.round(percentComplete));
   }
  };
  
  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };


  const validateFile = (file) => {

    if(fileType === "video") {
        if(!file.type.startsWith("video/")) {
            setError("Please upload a video file");
            return false;
        }
        if(file.size > 100 * 1024 * 1024) { 
            setError("File size should be less than 100MB");
            return false;
         }
    } else {
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp"];

        if(!validTypes.includes(file.type)){
            setError("Please upload an imgae file(jpeg, png, gif, svg, webp)");
            return false;
        }
        if(file.size > 10 * 1024 * 1024) { 
            setError("File size should be less than 10MB");
            return false;
        }
    }

    return true;    //hitesh sir wrote false but I think it should be true 
  }
 
 
  return (
    <div className="space-y-4">
    
        <IKUpload
          fileName={fileType === "video" ? "video.mp4" : "image.jpg"}
          useUniqueFileName={true}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          className="file-input file-input-bordered w-full"
          folder={fileType === "video" ? "/videos" : "/images"}
         
        />
        {
            uploading && (

                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Uploading...</span>
                </div>
                )
            
        }
        {
            error && (
                <div className=" text-sm text-error">{error}</div>
            )
        }
    </div>
  );
}