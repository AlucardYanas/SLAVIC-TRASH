import React from 'react'
import VideoModal from '../ui/VideoModal'

export default function MainPage():JSX.Element {
  return (
    <div>
    <VideoModal 
      videoTitle="Sample Video"
      videoSrc="https://videos.pexels.com/video-files/9001899/9001899-hd_1920_1080_25fps.mp4" 
    />
  </div>
  )
}
