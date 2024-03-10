import React, { useState, useEffect } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import AudioController from "@components/AudioController";
import RegionPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";

interface WaveSurferProps {
  audioUrl: string; 
}

const WaveSurfer = ({ audioUrl }: WaveSurferProps) => {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null); 
  const [waveSurferRegions, setWaveSurferRegions] = useState<RegionPlugin | null>(null); 

  useEffect (() => { waveSurferRegions?.enableDragSelection({ color: 'rgb(173, 216, 230, 0.5)' }) }, [waveSurferRegions]);

  useEffect (() => {    
    let activeRegion:Region | null = null; 

    waveSurfer?.on('interaction', () => {
      activeRegion = null; 
      waveSurferRegions?.getRegions().forEach((region: Region) => region.setOptions({ start: region.start, color: 'rgb(173, 216, 230, 0.5)' }));
    });

    waveSurferRegions?.on('region-clicked', (region: Region, e: MouseEvent) => {
      e.stopPropagation(); 

      if (region === activeRegion){
        activeRegion = null; 
        region.setOptions({ start: region.start, color: 'rgb(173, 216, 230, 0.5)' });
      } else {
        activeRegion = region;
        waveSurferRegions.getRegions().forEach((region: Region) => region.setOptions({ start: region.start, color: region === activeRegion ? 'rgb(0, 216, 230, 0.5)' : 'rgb(173, 216, 230, 0.5)' }));
      };
    });

    waveSurferRegions?.on('region-out', (region: any) => { if (activeRegion === region) region.play() });

  }, [waveSurfer, waveSurferRegions]);
  
  const onReady = (ws: any) => {
    setWaveSurfer(ws);
    setWaveSurferRegions(ws.registerPlugin(RegionPlugin.create()));
  };

  const onPlayPause = () => waveSurfer?.playPause(); 

  const onStop = () => {
    waveSurfer?.pause();
    waveSurfer?.stop(); 
    waveSurferRegions?.clearRegions();
  };

  return (
    <div>
      <WavesurferPlayer
        height={ 100 }
        waveColor="violet"
        progressColor="purple"
        url={ audioUrl }
        onReady={ onReady }
      />

      <AudioController waveFormPlayPause={ onPlayPause } waveFormStop={ onStop } waveSurfer={ waveSurfer }/>
    </div>
  );
};

export default WaveSurfer;