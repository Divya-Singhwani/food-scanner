import { useState, useRef } from 'react';
import './App.css';
import { Camera, Volume2, RotateCcw, ScanLine, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('scanner');
  const [language, setLanguage] = useState('hi');
  const [profile, setProfile] = useState('diabetes');
  const [imagePreview, setImagePreview] = useState(null);
  
  // Separate refs for camera shutter and gallery file picker
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const verdictData = {
    productName: "Parle Rusks / Digestive Biscuits",
    status: "avoid",
    statusText: "RED FLAG: AVOID FOR DIABETES",
    sugar: "4.5 Teaspoons",
    salt: "0.5 Teaspoon",
    fat: "Palm Oil Flagged",
    audioText: language === 'hi' 
      ? "Dhyan dein! Is biscuit mein lagbhag paanch chammach cheeni hai. Sugar ke marijon ke liye yeh theek nahi hai." 
      : "Caution! This packet contains around five teaspoons of sugar. It is not recommended for diabetic patients."
  };

  const handleCapture = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setCurrentScreen('processing');

      setTimeout(() => {
        setCurrentScreen('result');
        speakAudio(verdictData.audioText);
      }, 2000);
    }
  };

  const speakAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setImagePreview(null);
    setCurrentScreen('scanner');
  };

  return (
    <div className="mobile-container">
      {/* 1. TOP HEADER */}
      <header className="top-nav">
        <select 
          className="select-box"
          value={profile} 
          onChange={(e) => setProfile(e.target.value)}
        >
          <option value="diabetes">Profile: Diabetes</option>
          <option value="hypertension">Profile: High BP</option>
          <option value="normal">Profile: Normal</option>
        </select>

        <button 
          className="lang-btn"
          onClick={() => setLanguage(l => l === 'hi' ? 'en' : 'hi')}
        >
          {language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
        </button>
      </header>

      {/* 2. SCREEN 3: CAMERA SCANNER WITH GALLERY OPTION */}
      {currentScreen === 'scanner' && (
        <>
          <div className="camera-view">
            <div className="target-frame">
              <ScanLine size={44} color="#059669" style={{ marginBottom: '12px' }} />
              <div className="target-text">Align nutrition table or barcode inside frame</div>
            </div>
            <p className="sub-instruct">Snap a photo or pick an existing image from gallery</p>
          </div>

          <div className="bottom-bar">
            {/* Hidden Input 1: Camera Capture */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={cameraInputRef} 
              style={{ display: 'none' }} 
              onChange={handleCapture}
            />

            {/* Hidden Input 2: Gallery / File Picker */}
            <input 
              type="file" 
              accept="image/*" 
              ref={galleryInputRef} 
              style={{ display: 'none' }} 
              onChange={handleCapture}
            />

            {/* Gallery Upload Button */}
            <button 
              className="gallery-btn" 
              title="Upload from gallery" 
              onClick={() => galleryInputRef.current.click()}
            >
              <ImageIcon size={22} color="#0f172a" />
            </button>

            {/* Live Camera Button */}
            <button 
              className="shutter-btn" 
              title="Take photo"
              onClick={() => cameraInputRef.current.click()}
            >
              <Camera size={28} color="#ffffff" />
            </button>
          </div>
        </>
      )}

      {/* 3. SCREEN 4: PROCESSING SCREEN */}
      {currentScreen === 'processing' && (
        <div className="processing-view">
          <div className="spinner"></div>
          <h3 style={{ color: '#0f172a' }}>Analyzing Food Packaging...</h3>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Reading ingredients & checking health thresholds
          </p>
        </div>
      )}

      {/* 4. SCREEN 5: RESULT / VERDICT SCREEN */}
      {currentScreen === 'result' && (
        <div className="result-view">
          {imagePreview && (
            <img src={imagePreview} alt="Scanned item" className="preview-thumbnail" />
          )}

          <h2 className="product-title">{verdictData.productName}</h2>
          
          <div className={`badge ${verdictData.status}`}>
            {verdictData.statusText}
          </div>

          <span className="section-label">What This Means (Kitchen Units)</span>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="label">Sugar</div>
              <div className="val" style={{ color: '#dc2626' }}>{verdictData.sugar}</div>
            </div>
            <div className="metric-card">
              <div className="label">Salt</div>
              <div className="val" style={{ color: '#059669' }}>{verdictData.salt}</div>
            </div>
            <div className="metric-card">
              <div className="label">Oil / Fat</div>
              <div className="val" style={{ color: '#d97706' }}>{verdictData.fat}</div>
            </div>
          </div>

          <div className="audio-script-box">
            "{verdictData.audioText}"
          </div>

          <button className="audio-btn" onClick={() => speakAudio(verdictData.audioText)}>
            <Volume2 size={20} /> Replay Spoken Verdict
          </button>

          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Scan Another Item
          </button>
        </div>
      )}
    </div>
  );
}