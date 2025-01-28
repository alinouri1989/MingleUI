import React, { useState, useRef, useEffect } from 'react';
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { Slider, Stack } from '@mui/material';

export function AudioMessage({ content }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    }, [audioRef.current]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleSeek = (event, newValue) => {
        audioRef.current.currentTime = newValue;
        setCurrentTime(newValue);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = content;
        link.download = 'MingleChatSound.mp3';
        link.target = '_blank';
        link.click();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={content}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
            />
            <div className="audio-controls">
                <button onClick={togglePlayPause} className="play-pause-btn">
                    {isPlaying ? <IoPause /> : <IoPlay />}
                </button>
                <div className="progress-container">
                    <div className="time">
                        {formatTime(currentTime)}
                    </div>
                    <Stack direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                        <Slider
                            aria-label="Audio Progress"
                            value={currentTime}
                            onChange={handleSeek}
                            min={0}
                            max={duration}
                            step={0.1}
                            className="custom-slider"
                            sx={{ width: '120px' }}
                        />
                    </Stack>
                    <div className="time">
                        {formatTime(duration)}
                    </div>
                </div>
                <button onClick={handleDownload} className="download-btn">
                    <FiDownload />
                </button>
            </div>
        </div>
    );
}
