"use client"

import { useState } from "react";
import FileInput from "@components/FileInput"
import AudioController from "@components/AudioController";

const Home = () => {
    const [audioSrc, setAudioSrc] = useState<string>('');
  
    const handleFileSelected = (fileUrl: string) => {
        setAudioSrc(fileUrl);
      };

    return (
        <section>
            <h1> Jess Audio Player </h1>
            <AudioController audioSrc={audioSrc} />
            <FileInput onFileSelected={handleFileSelected} />
        </section>
    );
};

export default Home; 