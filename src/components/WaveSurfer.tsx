import React, { useState, useEffect } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import AudioController from "@components/AudioController";
import RegionPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
interface WaveSurferProps {
  audioUrl: string; 
}

const WaveSurfer = ({ audioUrl }: WaveSurferProps) => {
  const [waveSurfer, setWaveSurfer] = useState(null); 
  const [waveSurferRegions, setWaveSurferRegions] = useState(null); 

  useEffect (() => {
    if (waveSurferRegions){
      (waveSurferRegions as any).enableDragSelection({
        color: 'rgb(173, 216, 230, 0.5)',
      }); 
    }
  }, [waveSurferRegions]);

  useEffect (() => {    
    let activeRegion:any = null; 

    if (waveSurfer){
      (waveSurfer as any).on('interaction', () => {
        activeRegion = null; 

        (waveSurferRegions as any).regions.forEach((region: { setOptions: (arg0: { color: string; }) => void; }) => {
          region.setOptions({color: 'rgb(173, 216, 230, 0.5)'});
        });
      });
    };

    if (waveSurferRegions && (waveSurferRegions as any).regions){
      (waveSurferRegions as any).on('region-clicked', (region:any, e:any) => {
        e.stopPropagation(); 

        if (region === activeRegion){
          activeRegion = null; 
          region.setOptions({ color: 'rgb(173, 216, 230, 0.5)' });
        } else {
          activeRegion = region;

          (waveSurferRegions as any).regions.forEach((region: { setOptions: (arg0: { color: string; }) => void; }) => {
            if (region === activeRegion){
              region.setOptions({ color: 'rgb(0, 216, 230, 0.5)' });
            } else {
              region.setOptions({ color: 'rgb(173, 216, 230, 0.5)' });
            };
          });
        };
      });

      (waveSurferRegions as any).on('region-out', (region: any) => {
        if (activeRegion === region) region.play();
      });
    };
  }, [waveSurfer, waveSurferRegions]);
  
  const onReady = (ws: any) => {
    setWaveSurfer(ws);
    setWaveSurferRegions(ws.registerPlugin(RegionPlugin.create()));
  };

  const onPlayPause = () => {
    if (waveSurfer){
      (waveSurfer as any).playPause()
    };
  }; 

  const onStop = () => {
    if (waveSurfer){
      (waveSurfer as any).pause();
      (waveSurfer as any).stop(); 
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

      <AudioController waveFormPlayPause={onPlayPause} waveFormStop={onStop}  waveSurfer={waveSurfer} waveSurferRegions={waveSurferRegions}/>
    </div>
  );
};

export default WaveSurfer;