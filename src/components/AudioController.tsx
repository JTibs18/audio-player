import { useEffect, useState } from 'react'; 
import Button from './Button';
import WaveSurfer from 'wavesurfer.js'; 

interface AudioControllerProps {
    waveSurfer: WaveSurfer | null; 
    waveFormPlayPause: () => void; 
    waveFormStop: () => void; 
    cutWave: () => void; 
};

const AudioController = ({ waveSurfer, waveFormPlayPause, waveFormStop, cutWave }: AudioControllerProps) =>{
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
        waveSurfer?.seekTo(0); 
        setIsPlaying(false);
        cutWave(); 
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