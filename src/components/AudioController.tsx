import { useEffect, useState } from 'react'; 
import Button from './Button';

interface AudioControllerProps {
    waveSurfer: WaveSurfer | null; 
    waveFormPlayPause: () => void; 
    waveFormStop: () => void; 
};

const AudioController = ({ waveSurfer, waveFormPlayPause, waveFormStop }: AudioControllerProps) =>{
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

    return (
        <div className='flex gap-4'>
            <Button onClick={togglePlay} name={isPlaying ? 'Pause' : 'Play'} image={isPlaying ? '/images/pause.jpg' : '/images/play.jpg'} style='button-template bg-green-600'/> 
            <Button onClick={stopPlay} name={"Stop"} image={'/images/stop.jpg'} style="button-template bg-red-600"/> 
        </div>
    );
};

export default AudioController; 