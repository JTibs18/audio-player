"use client"

import { useState } from "react";
import FileInput from "@components/FileInput";
import WaveSurferComponent from "@components/WaveSurferComponent";

const Home = () => {
    const [audioSrc, setAudioSrc] = useState<string>('');
  
    const handleFileSelected = (fileUrl: string) => {
        setAudioSrc(fileUrl);
    };

    return (
        <section>
            <h1> Jess Audio Player </h1>
            <FileInput onFileSelected={handleFileSelected} />
            <WaveSurferComponent audioUrl={audioSrc} />
        </section>
    );
};

export default Home; 