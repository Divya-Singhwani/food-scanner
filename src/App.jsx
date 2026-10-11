import { useState, useRef, useEffect } from 'react';
import './App.css';

// Default Fallback Database jab tak API connect na ho
const FALLBACK_DB = {
  maggi: {
    id: 'maggi',
    title: 'Maggi 2-Minute Masala Noodles, 70 g',
    category: 'Instant Noodles',
    calories: 450,
    defaultImage: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
    kitchenUnits: {
      sugar: '0.6 Teaspoon',
      sugarColor: '#10B981',
      salt: '1.8 Teaspoons',
      saltColor: '#D32F2F',
      oil: 'Palm Oil Flagged',
      oilColor: '#D97706'
    },
    nutrientsList: [
      { name: 'Energy', icon: '🔥', val: '~450 kcal', fill: 80, color: '#F59E0B' },
      { name: 'Total Fat', icon: '💧', val: '~17 g', fill: 50, color: '#F59E0B' },
      { name: 'Saturated Fat', icon: '💧', val: '~8 g', fill: 40, color: '#EF4444' },
      { name: 'Carbohydrates', icon: '🌾', val: '~63 g', fill: 85, color: '#10B981' },
      { name: 'Sugars', icon: '🧊', val: '~3 g', fill: 20, color: '#10B981' },
      { name: 'Protein', icon: '💪', val: '~9 g', fill: 45, color: '#10B981' },
      { name: 'Sodium', icon: '🧂', val: '~1,100 mg', fill: 95, color: '#EF4444' }
    ],
    profileFeedback: {
      Normal: { 
        flagText: 'YELLOW FLAG: MODERATE INTAKE',
        flagColor: '#92400E',
        flagBg: '#FEF3C7',
        dhyanQuote: 'Dhyan dein! Is noodles packet mein namak lagbhag do chammach ke barabar hai. Rozana khane se bachein.'
      },
      Diabetes: { 
        flagText: 'SAFE ON SUGAR: LOW GLUCOSE RISK',
        flagColor: '#065F46',
        flagBg: '#D1FAE5',
        dhyanQuote: 'Dhyan dein! Isme cheeni sirf aadha chammach hai jo diabetes ke liye theek hai, lekin refined maida zyada hai.'
      },
      'Blood Pressure': { 
        flagText: 'RED FLAG: AVOID FOR HIGH BP',
        flagColor: '#991B1B',
        flagBg: '#FEE2E2',
        dhyanQuote: 'Dhyan dein! Isme 1100 mg sodium hai. High blood pressure ke marijon ke liye yeh bilkul surakshit nahi hai.'
      },
      Child: { 
        flagText: 'ORANGE FLAG: LIMIT FOR CHILDREN',
        flagColor: '#9A3412',
        flagBg: '#FFEDD5',
        dhyanQuote: 'Dhyan dein! Bachhon ke liye is packet mein namak aur preservatives ki matra kafi zyada hai.'
      }
    }
  },
  rusk: {
    id: 'rusk',
    title: 'Britannia Toastea Premium Bake Rusk',
    category: 'Bakery Snack',
    calories: 432,
    defaultImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
    kitchenUnits: {
      sugar: '4.5 Teaspoons',
      sugarColor: '#D32F2F',
      salt: '0.5 Teaspoon',
      saltColor: '#10B981',
      oil: 'Palm Oil Flagged',
      oilColor: '#D97706'
    },
    nutrientsList: [
      { name: 'Energy', icon: '🔥', val: '~432 kcal', fill: 78, color: '#F59E0B' },
      { name: 'Total Fat', icon: '💧', val: '~9.5 g', fill: 35, color: '#10B981' },
      { name: 'Saturated Fat', icon: '💧', val: '~4.2 g', fill: 25, color: '#10B981' },
      { name: 'Carbohydrates', icon: '🌾', val: '~78 g', fill: 85, color: '#F59E0B' },
      { name: 'Sugars', icon: '🧊', val: '~23 g', fill: 90, color: '#EF4444' },
      { name: 'Protein', icon: '💪', val: '~7.2 g', fill: 38, color: '#10B981' },
      { name: 'Sodium', icon: '🧂', val: '~180 mg', fill: 20, color: '#10B981' }
    ],
    profileFeedback: {
      Normal: { 
        flagText: 'GREEN FLAG: RECOMMENDED SNACK',
        flagColor: '#065F46',
        flagBg: '#D1FAE5',
        dhyanQuote: 'Dhyan dein! Chai ke sath Rusk ek accha vikalp hai kyunki isme namak bohot kam hai.'
      },
      Diabetes: { 
        flagText: 'RED FLAG: AVOID FOR DIABETES',
        flagColor: '#991B1B',
        flagBg: '#FEE2E2',
        dhyanQuote: 'Dhyan dein! Is biscuit mein lagbhag paanch chammach cheeni hai. Sugar ke marijon ke liye yeh theek nahi hai.'
      },
      'Blood Pressure': { 
        flagText: 'GREEN FLAG: SAFE FOR HIGH BP',
        flagColor: '#065F46',
        flagBg: '#D1FAE5',
        dhyanQuote: 'Dhyan dein! Sodium sirf 180 mg hai, isliye high blood pressure walon ke liye yeh noodles se kaafi surakshit hai.'
      },
      Child: { 
        flagText: 'RED FLAG: HIGH ADDED SUGAR',
        flagColor: '#991B1B',
        flagBg: '#FEE2E2',
        dhyanQuote: 'Dhyan dein! Isme added sugar ki matra zyada hai, bachhon ko din me do se zyada na dein.'
      }
    }
  }
};

// API Integration Client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const scanProductViaAPI = async (file, userProfile) => {
  if (API_BASE_URL) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('profile', userProfile);

      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: data.id || `scanned-${Date.now()}`,
          title: data.product_name || data.title || 'Scanned Food Product',
          category: data.category || 'Packaged Food',
          calories: data.calories || 350,
          defaultImage: data.image_url || null,
          kitchenUnits: data.kitchen_units || {
            sugar: `${data.sugar_spoons || 2} Teaspoons`,
            sugarColor: (data.sugar_spoons || 2) > 3 ? '#D32F2F' : '#10B981',
            salt: `${data.salt_spoons || 0.8} Teaspoon`,
            saltColor: (data.salt_spoons || 0.8) > 1.2 ? '#D32F2F' : '#10B981',
            oil: data.oil_status || 'Palm Oil Flagged',
            oilColor: '#D97706'
          },
          nutrientsList: [
            { name: 'Energy', icon: '🔥', val: `~${data.calories || 350} kcal`, fill: 70, color: '#F59E0B' },
            { name: 'Total Fat', icon: '💧', val: `~${data.fat || 12} g`, fill: 45, color: '#F59E0B' },
            { name: 'Saturated Fat', icon: '💧', val: `~${data.sat_fat || 5} g`, fill: 35, color: '#EF4444' },
            { name: 'Carbohydrates', icon: '🌾', val: `~${data.carbs || 60} g`, fill: 75, color: '#10B981' },
            { name: 'Sugars', icon: '🧊', val: `~${data.sugars || 8} g`, fill: 40, color: '#10B981' },
            { name: 'Protein', icon: '💪', val: `~${data.protein || 6} g`, fill: 30, color: '#10B981' },
            { name: 'Sodium', icon: '🧂', val: `~${data.sodium || 600} mg`, fill: 70, color: '#EF4444' }
          ],
          profileFeedback: data.profile_feedback || {
            [userProfile]: {
              flagText: data.flag_text || 'FLAG: EVALUATED BY AI',
              flagColor: '#92400E',
              flagBg: '#FEF3C7',
              dhyanQuote: data.hindi_warning || `Dhyan dein! Is product ko apne ${userProfile} profile ke hisaab se simit matra me khayein.`
            }
          }
        };
      }
    } catch (err) {
      console.warn('API call failed, falling back to smart simulation:', err);
    }
  }

  // Fallback simulation
  await new Promise(r => setTimeout(r, 1200));
  const isMaggi = file.name.toLowerCase().includes('maggi');
  return isMaggi ? FALLBACK_DB.maggi : FALLBACK_DB.rusk;
};

export default function App() {
  const [screen, setScreen] = useState('login');
  const [profile, setProfile] = useState('Blood Pressure');
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // LocalStorage History
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('nutriscan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('nutriscan_history', JSON.stringify(scanHistory));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [scanHistory]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (authForm.username.trim().toLowerCase() === 'admin' && authForm.password === '1234') {
      setLoginError('');
      setScreen('scanner');
    } else {
      setLoginError('Galat details! username: admin aur password: 1234 enter karein.');
    }
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('nutriscan_history');
  };

  const speakHindiAudio = (feedbackQuote) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(feedbackQuote);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
      if (hindiVoice) utterance.voice = hindiVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (screen === 'result' && currentProduct) {
      const feedback = currentProduct.profileFeedback[profile] || currentProduct.profileFeedback['Normal'];
      if (feedback?.dhyanQuote) {
        speakHindiAudio(feedback.dhyanQuote);
      }
    }
  }, [screen, currentProduct, profile]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setScreen('loading');

    const analyzedProduct = await scanProductViaAPI(file, profile);
    
    const now = new Date();
    const dateFormatted = `TODAY, ${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' }).toUpperCase()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const scannedItem = {
      ...analyzedProduct,
      imageSrc: previewUrl,
      scanDate: dateFormatted,
      uniqueId: Date.now()
    };

    setCurrentProduct(scannedItem);
    setScanHistory(prev => [scannedItem, ...prev]);
    setScreen('result');
  };

  const activeFeedback = currentProduct ? (currentProduct.profileFeedback[profile] || currentProduct.profileFeedback['Normal']) : null;

  return (
    <div className="mobile-app-wrapper">
      {/* Top Navbar */}
      {screen !== 'login' && (
        <header className="top-nav">
          <button className="nav-link-btn" onClick={() => setScreen('scanner')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Scanner
          </button>
          <button className="profile-pill-trigger" onClick={() => setScreen('profile')}>
            Profile: {profile} ▾
          </button>
        </header>
      )}

      {/* 1. Login Screen */}
      {screen === 'login' && (
        <main className="screen-body auth-container">
          <div className="logo-badge">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <h1 className="brand-title">NutriScan AI</h1>
          <p className="brand-tagline">Scan your food. Know your nutrients. Eat safe.</p>

          <form onSubmit={handleLoginSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>
                username: admin
              </label>
              <input 
                className="clean-input" 
                placeholder="username: admin" 
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>
                password: 1234
              </label>
              <input 
                className="clean-input" 
                type="password" 
                placeholder="password: 1234" 
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              />
            </div>

            {loginError && (
              <p style={{ color: '#D32F2F', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
                {loginError}
              </p>
            )}

            <button type="submit" className="btn-solid-orange" style={{ marginTop: '4px' }}>
              Get Started
            </button>
          </form>
        </main>
      )}

      {/* 2. Profile Selection Screen */}
      {screen === 'profile' && (
        <main className="screen-body">
          <h2 style={{ fontSize: '19px', marginBottom: '16px', fontWeight: 700 }}>Choose Your Health Profile</h2>
          
          {[
            { key: 'Diabetes', title: 'Diabetes Profile', desc: 'Focuses on added sugar and refined carbohydrate limits', color: '#D32F2F' },
            { key: 'Blood Pressure', title: 'Hypertension (High BP)', desc: 'Focuses on low-sodium intake', color: '#1976D2' },
            { key: 'Normal', title: 'Standard / Fitness', desc: 'Standard daily nutritional threshold', color: '#2E7D32' },
            { key: 'Child', title: 'Child Nutrition', desc: 'Monitors added sugars and preservatives', color: '#FFB300' }
          ].map((item) => (
            <div 
              key={item.key} 
              className={`profile-card-option ${profile === item.key ? 'active' : ''}`}
              onClick={() => { setProfile(item.key); setScreen('scanner'); }}
            >
              <div className="indicator-dot" style={{ backgroundColor: item.color }}></div>
              <div>
                <strong>{item.title}</strong>
                <p style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* 3. Camera Scanner Screen */}
      {screen === 'scanner' && (
        <main className="camera-container">
          <div className="camera-nav-tabs">
            <span className="active">Scanner</span>
            <span onClick={() => setScreen('history')}>History & Compare</span>
          </div>

          <div className="viewfinder-frame">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" style={{ marginBottom: '8px' }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12a14.5 14.5 0 0 0 20 0"/>
            </svg>
            <p style={{ fontWeight: 600 }}>Align Food Label</p>
            <p style={{ fontSize: '11px', color: '#e0e0e0', marginTop: '4px' }}>
              Front packet or nutrition table
            </p>
          </div>

          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />

          <div className="camera-control-dock">
            <button className="dock-circle-btn" onClick={() => fileInputRef.current.click()} title="Open Gallery">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </button>

            <button className="capture-action-circle" onClick={() => fileInputRef.current.click()} title="Capture Photo"></button>

            <button 
              className="dock-circle-btn" 
              onClick={() => activeFeedback && speakHindiAudio(activeFeedback.dhyanQuote)} 
              title="Audio Summary (Hindi)"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            </button>
          </div>
        </main>
      )}

      {/* 4. Loader Screen */}
      {screen === 'loading' && (
        <main className="loading-view">
          <div className="pulsing-dot-spinner"></div>
          <h3>Analyzing Food Packet...</h3>
          <p style={{ fontSize: '13px', color: '#888' }}>Calculating kitchen units & safety flags</p>
        </main>
      )}

      {/* 5. Result Screen */}
      {screen === 'result' && currentProduct && activeFeedback && (
        <main className="screen-body">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img 
              src={currentProduct.imageSrc || currentProduct.defaultImage} 
              alt={currentProduct.title} 
              style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} 
            />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{currentProduct.title}</h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>{currentProduct.category}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #10B981', padding: '1px 6px', borderRadius: '4px', marginTop: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>Veg</span>
              </div>
            </div>
          </div>

          <div 
            className="flag-banner" 
            style={{ backgroundColor: activeFeedback.flagBg, color: activeFeedback.flagColor }}
          >
            {activeFeedback.flagText}
          </div>

          <div className="kitchen-section-title">WHAT THIS MEANS (KITCHEN UNITS)</div>
          <div className="kitchen-units-grid">
            <div className="kitchen-unit-card">
              <div className="kitchen-unit-label">Sugar</div>
              <div className="kitchen-unit-val" style={{ color: currentProduct.kitchenUnits.sugarColor }}>
                {currentProduct.kitchenUnits.sugar}
              </div>
            </div>
            <div className="kitchen-unit-card">
              <div className="kitchen-unit-label">Salt</div>
              <div className="kitchen-unit-val" style={{ color: currentProduct.kitchenUnits.saltColor }}>
                {currentProduct.kitchenUnits.salt}
              </div>
            </div>
            <div className="kitchen-unit-card">
              <div className="kitchen-unit-label">Oil / Fat</div>
              <div className="kitchen-unit-val" style={{ color: currentProduct.kitchenUnits.oilColor }}>
                {currentProduct.kitchenUnits.oil}
              </div>
            </div>
          </div>

          <div className="dhyan-de-quote-box">
            "{activeFeedback.dhyanQuote}"
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Nutrition Summary</span>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Per 100 g</span>
          </div>

          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
            {currentProduct.nutrientsList.map((item, index) => (
              <div key={index} className="nutrient-icon-row">
                <div className="nutrient-left">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <div className="progress-track-wrapper">
                  <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.fill}%`, backgroundColor: item.color, borderRadius: '3px' }}></div>
                  </div>
                </div>
                <div className="nutrient-val-tag">{item.val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            <button className="btn-solid-emerald" onClick={() => speakHindiAudio(activeFeedback.dhyanQuote)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
              Replay Spoken Verdict
            </button>
            <button className="btn-solid-orange" onClick={() => setScreen('history')}>
              📊 Compare With Other Items
            </button>
            <button className="btn-outline" onClick={() => setScreen('scanner')}>
              🔄 Scan Another Item
            </button>
          </div>
        </main>
      )}

      {/* 6. History Screen */}
      {screen === 'history' && (
        <main className="screen-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Scanned Products</h2>
            {scanHistory.length > 0 && (
              <button className="clear-btn" onClick={handleClearHistory}>
                Clear History
              </button>
            )}
          </div>

          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065F46', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
              <span>🍃</span> Smart AI Health Comparison
            </div>
            <p style={{ fontSize: '12px', color: '#047857', lineHeight: '1.4' }}>
              For <strong>{profile.toUpperCase()}</strong>: Britannia Toastea Rusk is safer for BP patients, while Maggi is lower in sugars for Diabetes.
            </p>
            <button 
              className="btn-solid-emerald" 
              style={{ marginTop: '10px', padding: '10px' }} 
              onClick={() => setIsCompareModalOpen(true)}
              disabled={scanHistory.length < 2}
            >
              {scanHistory.length < 2 ? 'Scan at least 2 items to compare' : '⚖️ Compare Scanned Items'}
            </button>
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>
            Recent History ({scanHistory.length})
          </h3>

          {scanHistory.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px', color: '#9CA3AF', margin: '40px 0' }}>
              <span style={{ fontSize: '48px' }}>📬</span>
              <strong style={{ color: '#4B5563' }}>No Saved Scans Yet</strong>
              <p style={{ fontSize: '12px', textAlign: 'center' }}>Scan a food package to view nutritional analysis here.</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {scanHistory.map((item) => (
                <div key={item.uniqueId || Math.random()} style={{ marginBottom: '14px' }}>
                  {item.scanDate && (
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', marginBottom: '4px', letterSpacing: '0.5px' }}>
                      {item.scanDate}
                    </div>
                  )}
                  <div 
                    className="history-card-row"
                    onClick={() => {
                      setCurrentProduct(item);
                      setScreen('result');
                    }}
                  >
                    <img src={item.imageSrc || item.defaultImage} alt={item.title} className="history-thumb-img" />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '13px', color: '#111827' }}>{item.title}</strong>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                        {item.calories} kcal
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: (item.profileFeedback[profile] || item.profileFeedback['Normal']).flagColor }}>
                      View →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="btn-solid-orange" style={{ marginTop: 'auto' }} onClick={() => setScreen('scanner')}>
            + Scan New Product
          </button>
        </main>
      )}

      {/* Pop-up Toggle Modal */}
      {isCompareModalOpen && (
        <div className="comparison-modal-backdrop" onClick={() => setIsCompareModalOpen(false)}>
          <div className="comparison-bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-line">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                Side-by-Side Product Comparison
              </h3>
              <button className="modal-close-icon" onClick={() => setIsCompareModalOpen(false)}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
              Health Evaluation for: <strong>{profile.toUpperCase()} profile</strong>
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Product</th>
                  <th style={{ padding: '8px 4px' }}>Calories</th>
                  <th style={{ padding: '8px 4px' }}>Sugars</th>
                  <th style={{ padding: '8px 4px' }}>Sodium</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 4px' }}>
                    <strong>Britannia Toastea Rusk</strong>
                    {profile === 'Blood Pressure' && (
                      <span className="better-option-badge">Better Option</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 4px' }}>432 kcal</td>
                  <td style={{ padding: '10px 4px', color: '#D32F2F', fontWeight: 600 }}>23 g</td>
                  <td style={{ padding: '10px 4px', color: '#10B981', fontWeight: 600 }}>180 mg</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 4px' }}>
                    <strong>Maggi 2-Minute Noodles</strong>
                    {profile === 'Diabetes' && (
                      <span className="better-option-badge">Better Option</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 4px' }}>450 kcal</td>
                  <td style={{ padding: '10px 4px', color: '#10B981', fontWeight: 600 }}>3 g</td>
                  <td style={{ padding: '10px 4px', color: '#D32F2F', fontWeight: 600 }}>1100 mg</td>
                </tr>
              </tbody>
            </table>

            <button 
              className="btn-solid-emerald" 
              style={{ marginTop: '16px' }}
              onClick={() => setIsCompareModalOpen(false)}
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}