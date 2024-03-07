import React, { useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import AudioController from "@components/AudioController";

interface WaveSurferProps {
  audioUrl: string; 
}

const WaveSurfer = ({ audioUrl }: WaveSurferProps) => {
  const [waveSurfer, setWaveSurfer] = useState(null); 

  const onReady = (ws: any) => {
    setWaveSurfer(ws);
  };

  const onPlayPause = () => {
    if (waveSurfer){
      (waveSurfer as any).playPause()
    };
  }; 

  const onStop = () => {
    if (waveSurfer){
      (waveSurfer as any).pause();
      (waveSurfer as any).seekTo(0); 
    };
  };

  return (
    <div>
      <WavesurferPlayer
        height={100}
        waveColor="violet"
        progressColor="purple"
        url={audioUrl}
        onReady={onReady}
      />

      <AudioController waveFormPlayPause={onPlayPause} waveFormStop={onStop}  waveSurfer={waveSurfer}/>
    </div>
  )
}
export default WaveSurfer;