import React, { useState, useEffect } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import AudioController from "@components/AudioController";
import RegionPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";
import Button from './Button';
import WaveSurfer from 'wavesurfer.js'; 
import { getWavBytes } from '@utils/utils';

interface WaveSurferComponentProps {
  audioUrl: string; 
}

const WaveSurferComponent = ({ audioUrl }: WaveSurferComponentProps) => {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null); 
  const [waveSurferRegions, setWaveSurferRegions] = useState<RegionPlugin | null>(null); 
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null); 

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
        setSelectedRegion(null); 
      } else {
        activeRegion = region;
        waveSurferRegions.getRegions().forEach((region: Region) => region.setOptions({ start: region.start, color: region === activeRegion ? 'rgb(0, 216, 230, 0.5)' : 'rgb(173, 216, 230, 0.5)' }));
        setSelectedRegion(activeRegion); 
      };
    });

    waveSurferRegions?.on('region-out', (region: any) => { if (activeRegion === region) region.play() });

  }, [waveSurfer, waveSurferRegions]);
  
  const onReady = (ws: WaveSurfer) => {
    setWaveSurfer(ws);
    setWaveSurferRegions(ws.registerPlugin(RegionPlugin.create()));
  };

  const onPlayPause = () => waveSurfer?.playPause(); 

  const onStop = () => {
    waveSurfer?.pause();
    waveSurfer?.stop(); 
    waveSurferRegions?.clearRegions();
  };

  const onCut = () => {
    // with help from https://github.com/katspaugh/wavesurfer.js/issues/419 

    if (waveSurfer?.getDecodedData() && selectedRegion){
      const originalAudioBuffer = waveSurfer.getDecodedData();
      
      if (originalAudioBuffer) {

        const sampleLength = Math.floor((selectedRegion.end - selectedRegion.start) * originalAudioBuffer.sampleRate);
        
        var offlineAudioContext = new OfflineAudioContext(1, 2, originalAudioBuffer.sampleRate); 
        var emptySegment = offlineAudioContext.createBuffer(originalAudioBuffer.numberOfChannels, sampleLength, originalAudioBuffer.sampleRate)
        var newAudioBuffer = offlineAudioContext.createBuffer(originalAudioBuffer.numberOfChannels, (selectedRegion.start === 0 ? (originalAudioBuffer.length - emptySegment.length) : originalAudioBuffer.length), originalAudioBuffer.sampleRate)
  
        for (let channel = 0; channel < originalAudioBuffer.numberOfChannels; channel++){
          var newChannelData = newAudioBuffer.getChannelData(channel);
          var emptySegmentData = emptySegment.getChannelData(channel);
          var originalChannelData = originalAudioBuffer.getChannelData(channel);

          var beforeData = originalChannelData.subarray(0, selectedRegion.start * originalAudioBuffer.sampleRate); 
          var afterData = originalChannelData.subarray(Math.floor(selectedRegion.end * originalAudioBuffer.sampleRate), (originalAudioBuffer.length * originalAudioBuffer.sampleRate));

          if (selectedRegion.start > 0){
            newChannelData.set(beforeData); 
            newChannelData.set(emptySegmentData, (selectedRegion.start * newAudioBuffer.sampleRate)); 
            newChannelData.set(afterData, (selectedRegion.start * newAudioBuffer.sampleRate));
          } else {
            newChannelData.set(afterData);
          }
        }

        const [left, right] = [newAudioBuffer.getChannelData(0), newAudioBuffer.getChannelData(1)]

        // interleaved
        const interleaved = new Float32Array(left.length + right.length)
        for (let src=0, dst=0; src < left.length; src++, dst+=2) {
          interleaved[dst] =   left[src]
          interleaved[dst+1] = right[src]
        }

        // get WAV file bytes and audio params of your audio source
        const wavBytes = getWavBytes(interleaved.buffer, {
          isFloat: true,       // floating point or 16-bit integer
          numChannels: 2,
          sampleRate: newAudioBuffer.sampleRate,
        })
        const wav = new Blob([wavBytes], { type: 'audio/wav' })
        waveSurfer.loadBlob(wav); 
      }
      waveSurferRegions?.destroy();
      setSelectedRegion(null); 
    };
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
      <div className='flex gap-4'>
        <AudioController waveFormPlayPause={ onPlayPause } waveFormStop={ onStop } waveSurfer={ waveSurfer }/>
        <Button onClick={ onCut } name= "Cut" image='/images/cut.jpg' style='button-template bg-violet-600' />
      </div>
    </div>
  );
};

export default WaveSurferComponent;