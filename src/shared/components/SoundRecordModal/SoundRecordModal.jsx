import { useState, useEffect, useRef } from 'react';
import CloseModalButton from "../../../contexts/components/CloseModalButton";
import { BiSolidMicrophone } from "react-icons/bi";
import ReactAudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'; // default styles
import "./style.scss";



function SoundRecordModal({ closeModal, chatId }) {
    const [isRecording, setIsRecording] = useState(false); // Kayıt başlatma durumu
    const [recordStarted, setRecordStarted] = useState(false); // Kayıt başladı mı?
    const [recordFinished, setRecordFinished] = useState(false); // Kayıt tamamlandı mı?
    const [wavesAnimation, setWavesAnimation] = useState(false); // Dalgaların animasyonu
    const [timer, setTimer] = useState(0); // Timer için state
    const [audioUrl, setAudioUrl] = useState(null); // Kaydedilen sesin URL'si
    const [audioStream, setAudioStream] = useState(null); // Ses kaydını tutacak stream
    const [mediaRecorder, setMediaRecorder] = useState(null); // MediaRecorder nesnesi
    const [audioChunks, setAudioChunks] = useState([]); // Kaydedilen sesin parçaları

    const timerRef = useRef(null); // Timer'ı kontrol etmek için ref

    // Kayıt sırasında timer'ı yönet
    useEffect(() => {
        let timerInterval;
        if (isRecording) {
            timerInterval = setInterval(() => {
                setTimer(prev => prev + 1); // Timer her saniyede bir artacak
            }, 1000);
        } else if (!isRecording && timer > 0) {
            clearInterval(timerInterval);
        }

        return () => clearInterval(timerInterval);
    }, [isRecording]);

    // Ses kaydını başlatan fonksiyon
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });  // Ses kaydını almak için izin iste
            setAudioStream(stream);
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            const chunks = [];
            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            recorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);  // Ses kaydını URL'ye çevir
                setAudioChunks(chunks);  // Ses parçalarını sakla
            };

            recorder.start();
            setAudioChunks(chunks);
            setIsRecording(true);
            setRecordStarted(true); // Kayıt başladığını işaretle
            setWavesAnimation(true);  // Dalgaların animasyonunu başlat
        } catch (err) {
            console.error('Error accessing audio devices: ', err);
        }
    };

    // Kaydı bitiren fonksiyon
    const stopRecording = () => {
        setIsRecording(false);
        setWavesAnimation(false);  // Dalgaların animasyonunu durdur
        if (mediaRecorder) {
            mediaRecorder.stop();  // Kaydı durdur
        }
        if (audioStream) {
            const tracks = audioStream.getTracks();
            tracks.forEach(track => track.stop());  // Ses kaydını durdur
        }
        setRecordFinished(true);  // Kayıt tamamlandı
    };

    // Kaydın bitirilmesi ve timer'ı sıfırlama
    const finishRecording = () => {
        stopRecording();
        setTimer(0);  // Timer'ı sıfırla
    };

    // Audio parçalarını birleştir ve yeni URL oluştur
    const combineAudioChunks = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl;
    };

    return (
        <div className='sound-record-box'>
            <CloseModalButton closeModal={closeModal} />
            <div className="sound-record-content">
                <div className="title-box">
                    <BiSolidMicrophone />
                    <p>Sesini Kaydet</p>
                </div>
                <div className="sound-waves-box">
                    <div className={`wave ${wavesAnimation ? 'animate first' : ''}`}></div>
                    <div className={`wave ${wavesAnimation ? 'animate second' : ''}`}></div>
                    <div className={`wave ${wavesAnimation ? 'animate last' : ''}`}></div>
                </div>
                <div className="record-time">
                    {String(Math.floor(timer / 60)).padStart(2, '0')}:
                    {String(timer % 60).padStart(2, '0')}
                </div>
                <div className="options-box">
                    {/* Kayıt başlamışsa "Bitir" butonunu göster */}
                    {recordStarted && !recordFinished && (
                        <button className="record-button" onClick={finishRecording}>Kaydı Bitir</button>
                    )}

                    {/* Kayıt başlamamışsa "Başlat" butonunu göster */}
                    {!recordStarted && !recordFinished && (
                        <button className="record-button" onClick={startRecording}>Kaydı Başlat</button>
                    )}
                </div>

                {/* Kaydedilen sesin dinletilmesi, sadece Kaydı Bitir'den sonra */}
                {recordFinished && audioUrl && (
                    <div className="audio-player-wrapper">
                        <ReactAudioPlayer
                            src={combineAudioChunks()} // Kaydedilen sesin URL'si
                            autoPlay={false} // Otomatik başlatmasın
                            controls
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SoundRecordModal;
