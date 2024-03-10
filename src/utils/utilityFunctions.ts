// from https://stackoverflow.com/questions/62172398/convert-audiobuffer-to-arraybuffer-blob-for-wav-download

export function getWavBytes(buffer: ArrayBuffer, options: any) {
    const type = options.isFloat ? Float32Array : Uint16Array
    const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT
  
    const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
    const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);
  
    // prepend header, then add pcmBytes
    wavBytes.set(headerBytes, 0)
    wavBytes.set(new Uint8Array(buffer), headerBytes.length)
  
    return wavBytes
  }
  
  // adapted from https://gist.github.com/also/900023
  // returns Uint8Array of WAV header bytes
  function getWavHeader(options: { numFrames: any; numChannels: number; sampleRate: number; isFloat: any; }) {
    const numFrames =      options.numFrames
    const numChannels =    options.numChannels || 2
    const sampleRate =     options.sampleRate || 44100
    const bytesPerSample = options.isFloat? 4 : 2
    const format =         options.isFloat? 3 : 1
  
    const blockAlign = numChannels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    const dataSize = numFrames * blockAlign
  
    const buffer = new ArrayBuffer(44)
    const dv = new DataView(buffer)
  
    let p = 0
  
    function writeString(s: string) {
      for (let i = 0; i < s.length; i++) {
        dv.setUint8(p + i, s.charCodeAt(i))
      }
      p += s.length
    }
  
    function writeUint32(d: number) {
      dv.setUint32(p, d, true)
      p += 4
    }
  
    function writeUint16(d: number) {
      dv.setUint16(p, d, true)
      p += 2
    }
  
    writeString('RIFF')              // ChunkID
    writeUint32(dataSize + 36)       // ChunkSize
    writeString('WAVE')              // Format
    writeString('fmt ')              // Subchunk1ID
    writeUint32(16)                  // Subchunk1Size
    writeUint16(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
    writeUint16(numChannels)         // NumChannels
    writeUint32(sampleRate)          // SampleRate
    writeUint32(byteRate)            // ByteRate
    writeUint16(blockAlign)          // BlockAlign
    writeUint16(bytesPerSample * 8)  // BitsPerSample
    writeString('data')              // Subchunk2ID
    writeUint32(dataSize)            // Subchunk2Size
  
    return new Uint8Array(buffer)
};

export function convertAudioBufferToBlob(audioBuffer: AudioBuffer): Blob {
    const [left, right] = [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)];

    const interleaved = new Float32Array(left.length + right.length);

    for (let src=0, dst=0; src < left.length; src++, dst+=2) {
        interleaved[dst] =   left[src];
        interleaved[dst+1] = right[src];
    };

    const wavBytes = getWavBytes(interleaved.buffer, {
        isFloat: true,       // floating point or 16-bit integer
        numChannels: 2,
        sampleRate: audioBuffer.sampleRate,
    });

    return new Blob([wavBytes], { type: 'audio/wav' });
};

// with help from https://github.com/katspaugh/wavesurfer.js/issues/419 
export function createNewAudioBuffer(originalAudioBuffer: AudioBuffer, start: number, end: number) {
    const sampleLength = Math.floor((end - start) * originalAudioBuffer.sampleRate);
   
    var offlineAudioContext = new OfflineAudioContext(1, 2, originalAudioBuffer.sampleRate);
    var emptySegmentBuffer = offlineAudioContext.createBuffer(originalAudioBuffer.numberOfChannels, sampleLength, originalAudioBuffer.sampleRate);
    var newAudioBuffer = offlineAudioContext.createBuffer(originalAudioBuffer.numberOfChannels, (start === 0 ? (originalAudioBuffer.length - emptySegmentBuffer.length) : originalAudioBuffer.length), originalAudioBuffer.sampleRate);
   
    for (let channel = 0; channel < originalAudioBuffer.numberOfChannels; channel++) {
       var newChannelData = newAudioBuffer.getChannelData(channel);
       var emptySegmentData = emptySegmentBuffer.getChannelData(channel);
       var originalChannelData = originalAudioBuffer.getChannelData(channel);
   
       var beforeData = originalChannelData.subarray(0, start * originalAudioBuffer.sampleRate);
       var afterData = originalChannelData.subarray(Math.floor(end * originalAudioBuffer.sampleRate), (originalAudioBuffer.length * originalAudioBuffer.sampleRate));
   
       if (start > 0) {
         newChannelData.set(beforeData);
         newChannelData.set(emptySegmentData, (start * newAudioBuffer.sampleRate));
         newChannelData.set(afterData, (start * newAudioBuffer.sampleRate));
       } else {
         newChannelData.set(afterData);
       };
    };
   
    return newAudioBuffer;
};