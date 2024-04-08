import React, { useState, useRef } from 'react';
import './VideoUpload.css';

function VideoUpload() {
  const [selectedVideo, setSelectedVideo] = useState();
  const [videoPreviewUrl, setVideoPreviewUrl] = useState();
  const [videoKey, setVideoKey] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingScreen, setShowRecordingScreen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);

  const handleVideoUpload = event => {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const videoExtensions = ['mp4', 'mov', 'avi', 'flv', 'wmv', 'mkv'];

    if (!videoExtensions.includes(fileExtension)) {
      alert('Please select a valid video file');
      return;
    }

    setSelectedVideo(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setVideoKey(prevKey => prevKey + 1);
  };

  const handleVideoSubmit = () => {
    if (!selectedVideo) {
      alert('Please select a video to upload');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedVideo);

    fetch('https://your-api-endpoint.com/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert('Video uploaded successfully');
      })
      .catch(error => {
        console.error(error);
        alert('Failed to upload video');
      });
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ 
      audio: true, // Add this line
      video: {
        width: { exact: window.screen.width },
        height: { exact: window.screen.height }
      } 
    }).then(stream => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
  
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
  
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      setIsRecording(true);
    });
  };
  

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setShowRecordingScreen(false);

    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function(track) {
      track.stop();
    });

    videoRef.current.srcObject = null;
  };

  const handleDataAvailable = (e) => {
    if (e.data.size > 0) {
      setSelectedVideo(e.data);
      setVideoPreviewUrl(URL.createObjectURL(e.data));
      setVideoKey(prevKey => prevKey + 1);
    }
  };

  const openRecordingScreen = () => {
    setShowRecordingScreen(true);
  };

  return (
    <>
      <div style={{backgroundColor: '#f95959', padding: '10px'}}>
        <h1 style={{color: 'black', fontFamily: 'serif'}}>Upload or Record a video</h1>
      </div>
      {!showRecordingScreen ? (
        <div style={{margin: '20px', border: '3px solid black', padding: '20px'}}>
          <div className="video-upload" style={{border: '3px dashed black', backgroundColor: 'lightblue', padding: '10px', 
          margin: '10px', display:'flex', flexDirection:'column', alignItems: 'center', 
          justifyContent: 'center', fontFamily: 'serif',  color: 'black'}}>
            <label htmlFor="file-upload" className="file-input">
              Choose Files
            </label>
            <input id="file-upload" className="file-input" type="file" accept="video/*" onChange={handleVideoUpload} style={{display: 'none'}} />
            <button className="start-recording" style={{padding: '10px', margin: '10px', display:'flex', flexDirection:'column', alignItems: 'center', 
          justifyContent: 'center', fontFamily: 'serif'}} onClick={openRecordingScreen}>Start Recording</button>
            {videoPreviewUrl && (
              <div className="video-preview" style={{margin: '10px'}}>
                <video key={videoKey} width="640" controls>
                  <source src={videoPreviewUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <button className="upload-button" onClick={handleVideoSubmit}>Upload</button>
          </div>
        </div>
      ) : (
        <div style={{margin: '20px', border: '3px solid black', padding: '20px'}}>
          <div className="video-upload" style={{border: '3px dashed black', backgroundColor: 'lightblue', padding: '10px', 
          margin: '10px', display:'flex', flexDirection:'column', alignItems: 'center', 
          justifyContent: 'center', fontFamily: 'serif',  color: 'black'}}>
            <video ref={videoRef} width="640" />
            {!isRecording && (
              <button className="start-recording"  style={{padding: '10px', margin: '10px', display:'flex', flexDirection:'column', alignItems: 'center', 
              justifyContent: 'center', fontFamily: 'serif'}} onClick={startRecording}>Start Recording</button>
            )}
            {isRecording && (
              <button className="stop-recording" style={{padding: '10px', margin: '10px', display:'flex', flexDirection:'column', alignItems: 'center', 
              justifyContent: 'center', fontFamily: 'serif'}} onClick={stopRecording}>Stop Recording</button>
            )}
          </div>
        </div>
      )}
    </>
  );

}

export default VideoUpload;
