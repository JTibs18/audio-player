import { useState, useEffect } from 'react'; 
import Button from './Button';

interface AudioControllerProps {
    audioSrc: string;
}

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

    return (
        <div>
            <Button onClick={togglePlay} name={isPlaying ? 'Pause' : 'Play'} /> 
        </div>
    );
};

export default AudioController; 