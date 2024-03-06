"use client"

import { useState } from "react";
import FileInput from "@components/FileInput";
import AudioController from "@components/AudioController";

const Home = () => {
    const [audioSrc, setAudioSrc] = useState<string>('');
  
    const handleFileSelected = (fileUrl: string) => {
        setAudioSrc(fileUrl);
      };

    return (
        <section>
            <h1> Jess Audio Player </h1>
            <FileInput onFileSelected={handleFileSelected} />
            <AudioController audioSrc={audioSrc} />
        </section>
    );
};

export default Home; 