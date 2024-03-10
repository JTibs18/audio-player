import { useEffect, useState } from 'react'; 
import Button from './Button';
import WaveSurfer from 'wavesurfer.js'; 
import { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";
import { convertAudioBufferToBlob, createNewAudioBuffer } from '@utils/utilityFunctions';

interface AudioControllerProps {
    waveSurfer: WaveSurfer | null; 
    waveFormPlayPause: () => void; 
    waveFormStop: () => void; 
    cutWave: () => void; 
    selectedRegion: Region | null; 
};

const AudioController = ({ waveSurfer, waveFormPlayPause, waveFormStop, cutWave, selectedRegion }: AudioControllerProps) =>{
    const [isPlaying, setIsPlaying] = useState(false); 

    useEffect (() => {
        waveSurfer?.on('finish', () => {
            setIsPlaying(false);
            waveSurfer.stop(); 
        });
    }, [waveSurfer]);

    const togglePlay = () => {
        if (waveSurfer){
            setIsPlaying(!isPlaying); 
            waveFormPlayPause();
        };
    };

    const stopPlay = () => {
        setIsPlaying(false); 
        waveFormStop(); 
    };

    const onCut = () => {
        if (waveSurfer?.getDecodedData() && selectedRegion){
            waveSurfer?.seekTo(0); 
            const originalAudioBuffer = waveSurfer.getDecodedData();
            
            if (originalAudioBuffer) {
              const newAudioBuffer = createNewAudioBuffer(originalAudioBuffer, selectedRegion.start, selectedRegion.end); 
              waveSurfer.loadBlob(convertAudioBufferToBlob(newAudioBuffer)); 
            }
            waveSurfer?.seekTo(0); 
            setIsPlaying(false);
            cutWave(); 
        };
    };

    return (
        <div className='flex gap-4'>
            <Button onClick={ togglePlay } name={ isPlaying ? 'Pause' : 'Play' } image={ isPlaying ? '/images/pause.jpg' : '/images/play.jpg' } style='button-template bg-green-600'/> 
            <Button onClick={ stopPlay } name="Stop" image='/images/stop.jpg' style="button-template bg-red-600"/> 
            <Button onClick={ onCut } name= "Cut" image='/images/cut.jpg' style='button-template bg-violet-600' />
        </div>
    );
};

export default AudioController; 