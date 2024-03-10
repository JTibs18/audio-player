import { useEffect, useState } from 'react'; 
import Button from './Button';

interface AudioControllerProps {
    waveSurfer: any; 
    waveFormPlayPause: () => void; 
    waveFormStop: () => void; 
    waveSurferRegions: any; 
};

const AudioController = ({ waveSurfer, waveFormPlayPause, waveFormStop, waveSurferRegions }: AudioControllerProps) =>{
    const [isPlaying, setIsPlaying] = useState(false); 

    const togglePlay = () => {
        setIsPlaying(!isPlaying); 
        waveFormPlayPause();
    };

    useEffect (() => {
        if (waveSurfer){
            waveSurfer.on('finish', () => {
                setIsPlaying(false);
            });
        };
    }, [waveSurfer]);

    const stopPlay = () => {
        while(waveSurferRegions.regions.length){
            waveSurferRegions.regions[0].remove(); 
        };

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