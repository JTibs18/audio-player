import { useState, useEffect } from 'react'; 
import Button from './Button';

interface AudioControllerProps {
    audioSrc: string;
};

const AudioController = ({audioSrc}: AudioControllerProps) =>{
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false); 

    useEffect(() => {
        if (audioSrc) {
            const newAudio = new Audio(audioSrc); 
            newAudio.onended = () => setIsPlaying(false); 
            setAudio(newAudio); 
        }
    }, [audioSrc]); 

    useEffect(() => {
        if (audio && isPlaying) {
            audio.play();
        } else if (audio) {
            audio.pause(); 
        }
    }, [audio, isPlaying]); 

    const togglePlay = () => {
        setIsPlaying(!isPlaying); 
    }; 

    const stopPlay = () => {
        setIsPlaying(false); 

        if (audio){
            audio.currentTime = 0;
        };
    };

    return (
        <div className='flex gap-4'>
            <Button onClick={togglePlay} name={isPlaying ? 'Pause' : 'Play'} image={isPlaying ? '/images/pause.jpg' : '/images/play.jpg'} style={isPlaying ? 'button-template bg-green-600' : 'button-template bg-green-600'}/> 
            <Button onClick={stopPlay} name={"Stop"} image={'/images/stop.jpg'} style="button-template bg-red-600"/> 
        </div>
    );
};

export default AudioController; 