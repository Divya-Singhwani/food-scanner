import { useState, useRef, useEffect } from 'react';
import './App.css';
import { 
  Camera, Volume2, RotateCcw, ScanLine, Image as ImageIcon, 
  ArrowLeft, LogOut, Flame, Droplets, Wheat, Cuboid as Cube, Dumbbell, ShieldAlert,
  ChevronRight, Sparkles, X, Award
} from 'lucide-react';

const MAGGI_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' rx='16' fill='%23fef08a'/><circle cx='50' cy='50' r='36' fill='%23dc2626'/><path d='M30 45 Q50 35 70 45 Q50 55 30 45 Z' fill='%23fef08a'/><path d='M32 54 Q50 44 68 54 Q50 64 32 54 Z' fill='%23fef08a'/><text x='50' y='76' font-family='sans-serif' font-weight='900' font-size='12' fill='%23ffffff' text-anchor='middle'>MAGGI</text></svg>";

const RUSK_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' rx='16' fill='%23ffedd5'/><rect x='22' y='28' width='56' height='44' rx='8' fill='%23d97706'/><rect x='28' y='34' width='44' height='32' rx='5' fill='%23b45309'/><circle cx='38' cy='44' r='2' fill='%2378350f'/><circle cx='50' cy='42' r='2' fill='%2378350f'/><circle cx='62' cy='46' r='2' fill='%2378350f'/><circle cx='42' cy='54' r='2' fill='%2378350f'/><circle cx='56' cy='56' r='2' fill='%2378350f'/><text x='50' y='88' font-family='sans-serif' font-weight='800' font-size='10' fill='%239a3412' text-anchor='middle'>RUSK</text></svg>";

const HARDCODED_FOOD_DB = {
  maggi: {
    title: "Maggi 2-Minute Masala Noodles, 70 g",
    category: "Instant Noodles",
    serving: "Per 100 g",
    calories: "450 kcal",
    calNum: 450,
    sugarNum: 3,
    sodiumNum: 1100,
    image: MAGGI_SVG,
    caution: "RED FLAG: High sodium content (1,100 mg). Highly unsafe for High Blood Pressure and heart health.",
    audioText: "Dhyan dein! Is noodles packet mein namak aur sodium lagbhag 1,100 milligram hai. High blood pressure ke liye yeh hanikarak hai.",
    nutrients: [
      { name: "Energy", val: "~450 kcal", percent: 65, color: "#f59e0b", iconKey: "Flame" },
      { name: "Total Fat", val: "~17 g", percent: 45, color: "#f59e0b", iconKey: "Droplets" },
      { name: "Saturated Fat", val: "~8 g", percent: 55, color: "#ef4444", iconKey: "Droplets" },
      { name: "Carbohydrates", val: "~63 g", percent: 80, color: "#22c55e", iconKey: "Wheat" },
      { name: "Sugars", val: "~3 g", percent: 18, color: "#22c55e", iconKey: "Cube" },
      { name: "Protein", val: "~9 g", percent: 25, color: "#22c55e", iconKey: "Dumbbell" },
      { name: "Sodium", val: "~1,100 mg", percent: 95, color: "#ef4444", iconKey: "ShieldAlert" },
    ]
  },
  rusk: {
    title: "Parle Toastea Premium Bake Rusk",
    category: "Bakery & Toast",
    serving: "Per 100 g",
    calories: "432 kcal",
    calNum: 432,
    sugarNum: 23,
    sodiumNum: 180,
    image: RUSK_SVG,
    caution: "CAUTION: Contains high refined sugar (23 g) and Maida. Unsuitable for regular diabetic consumption.",
    audioText: "Dhyan dein! Is Rusk packet mein sugar aur maida ki matra adhik hai. Diabetes ke marijon ko iska niyamit sewan karne se bachna chahiye.",
    nutrients: [
      { name: "Energy", val: "~432 kcal", percent: 60, color: "#f59e0b", iconKey: "Flame" },
      { name: "Total Fat", val: "~9 g", percent: 25, color: "#22c55e", iconKey: "Droplets" },
      { name: "Saturated Fat", val: "~4.5 g", percent: 40, color: "#f59e0b", iconKey: "Droplets" },
      { name: "Carbohydrates", val: "~80 g", percent: 85, color: "#ef4444", iconKey: "Wheat" },
      { name: "Sugars", val: "~23 g", percent: 75, color: "#ef4444", iconKey: "Cube" },
      { name: "Protein", val: "~7.5 g", percent: 22, color: "#22c55e", iconKey: "Dumbbell" },
      { name: "Sodium", val: "~180 mg", percent: 15, color: "#22c55e", iconKey: "ShieldAlert" },
    ]
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [currentScreen, setCurrentScreen] = useState('scanner');
  const [profile, setProfile] = useState('normal');
  const [imagePreview, setImagePreview] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [scanHistory, setScanHistory] = useState(() => {
    const saved = localStorage.getItem('nutri_scan_history_prod_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nutri_scan_history_prod_v2', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [productData, setProductData] = useState(null);

  const speakAudioHindi = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && String(password).trim() === '1234') {
      setIsLoggedIn(true);
    } else {
      alert("Demo credentials -> Username: admin, Password: 1234");
    }
  };

  const analyzeProductImage = async (file) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('profile', profile);

        const response = await fetch(`${apiUrl}/scan`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn("Backend API unreachable, fallback to hardcoded mock data:", err);
      }
    }

    const fileName = file.name.toLowerCase();
    if (fileName.includes('rusk') || fileName.includes('toast') || fileName.includes('biscuit')) {
      return HARDCODED_FOOD_DB.rusk;
    } else if (fileName.includes('maggi') || fileName.includes('noodle')) {
      return HARDCODED_FOOD_DB.maggi;
    }

    const lastItemTitle = scanHistory[0]?.data?.title || '';
    return lastItemTitle.includes('Maggi') ? HARDCODED_FOOD_DB.rusk : HARDCODED_FOOD_DB.maggi;
  };

  const handleCapture = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Img = reader.result;
        setImagePreview(base64Img);
        setCurrentScreen('processing');

        const detected = await analyzeProductImage(file);
        setProductData(detected);

        setTimeout(() => {
          const now = new Date();
          const dateStr = `Today, ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const newEntry = {
            id: Date.now(),
            date: dateStr,
            time: timeStr,
            data: detected,
            image: base64Img
          };

          setScanHistory(prev => [newEntry, ...prev]);
          setCurrentScreen('result');
          speakAudioHindi(detected.audioText);
        }, 1200);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setProductData(item.data);
    setImagePreview(item.image || null);
    setCurrentScreen('result');
    speakAudioHindi(item.data.audioText);
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setImagePreview(null);
    setCurrentScreen('scanner');
  };

  const getComparisonAnalysis = () => {
    if (!scanHistory || scanHistory.length < 2) return null;

    const items = scanHistory.map(entry => ({ id: entry.id, ...entry.data }));

    let best;
    let reason;

    if (profile === 'diabetes') {
      best = items.reduce((prev, curr) => (curr.sugarNum < prev.sugarNum ? curr : prev), items[0]);
      reason = `it has significantly lower sugar (~${best.sugarNum}g vs 23g in Rusk), preventing glucose spikes.`;
    } else if (profile === 'hypertension') {
      best = items.reduce((prev, curr) => (curr.sodiumNum < prev.sodiumNum ? curr : prev), items[0]);
      reason = `it contains significantly lower sodium (~${best.sodiumNum}mg vs 1,100mg in Maggi), preventing blood pressure risks.`;
    } else {
      best = items[0];
      reason = `both options are acceptable in moderation for a healthy individual. Choose Maggi for savory lower sugar, or Rusk with tea for lower sodium.`;
    }

    return { best, reason, allItems: items };
  };

  const comparison = getComparisonAnalysis();

  const renderNutrientIcon = (iconKey) => {
    switch (iconKey) {
      case 'Flame': return <Flame size={16} color="#ef4444" />;
      case 'Droplets': return <Droplets size={16} color="#f59e0b" />;
      case 'Wheat': return <Wheat size={16} color="#eab308" />;
      case 'Cube': return <Cube size={16} color="#94a3b8" />;
      case 'Dumbbell': return <Dumbbell size={16} color="#eab308" />;
      case 'ShieldAlert': return <ShieldAlert size={16} color="#64748b" />;
      default: return <Flame size={16} color="#ef4444" />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mobile-container">
        <div className="login-screen">
          <div className="login-card">
            <h2 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>NutriScan AI</h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '18px' }}>
              Sign in to scan and compare foods
            </p>
            <form onSubmit={handleLogin}>
              <input 
                type="text" 
                placeholder="Username (admin)" 
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Password (1234)" 
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="login-submit-btn">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <header className="top-nav">
        {currentScreen === 'result' ? (
          <button className="lang-btn" onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} /> Back
          </button>
        ) : (
          <select 
            className="select-box"
            value={profile} 
            onChange={(e) => setProfile(e.target.value)}
          >
            <option value="normal">Profile: Normal</option>
            <option value="diabetes">Profile: Diabetes</option>
            <option value="hypertension">Profile: High BP</option>
          </select>
        )}

        <button 
          className="lang-btn" 
          onClick={() => setIsLoggedIn(false)} 
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <LogOut size={14} /> Exit
        </button>
      </header>

      {currentScreen !== 'processing' && (
        <div className="app-nav-tabs">
          <button 
            className={`tab-btn ${currentScreen === 'scanner' || currentScreen === 'result' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('scanner')}
          >
            Camera Scanner
          </button>
          <button 
            className={`tab-btn ${currentScreen === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('history')}
          >
            Scan & Compare ({scanHistory.length})
          </button>
        </div>
      )}

      {/* CAMERA SCREEN */}
      {currentScreen === 'scanner' && (
        <>
          <div className="camera-view">
            <div className="target-frame">
              <ScanLine size={44} color="#059669" style={{ marginBottom: '12px' }} />
              <div className="target-text">
                Align food packaging or plate inside frame
              </div>
            </div>
            <p className="sub-instruct">Take photo or select from gallery</p>
          </div>

          <div className="bottom-bar">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={cameraInputRef} 
              style={{ display: 'none' }} 
              onChange={handleCapture}
            />
            <input 
              type="file" 
              accept="image/*" 
              ref={galleryInputRef} 
              style={{ display: 'none' }} 
              onChange={handleCapture}
            />

            <button className="gallery-btn" onClick={() => galleryInputRef.current.click()}>
              <ImageIcon size={22} color="#0f172a" />
            </button>
            <button className="shutter-btn" onClick={() => cameraInputRef.current.click()}>
              <Camera size={28} color="#ffffff" />
            </button>
          </div>
        </>
      )}

      {/* PROCESSING */}
      {currentScreen === 'processing' && (
        <div className="processing-view">
          <div className="spinner"></div>
          <h3 style={{ color: '#0f172a' }}>Analyzing Food...</h3>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Reading nutrients and checking health flags
          </p>
        </div>
      )}

      {/* RESULT VIEW (Without Swap Button) */}
      {currentScreen === 'result' && productData && (
        <div className="result-view">
          <div className="summary-card">
            <div className="product-row">
              <img 
                src={imagePreview || productData.image || (productData.calNum === 450 ? MAGGI_SVG : RUSK_SVG)} 
                alt={productData.title} 
                className="product-img"
              />
              <div className="product-info">
                <input 
                  type="text" 
                  className="editable-title-input"
                  value={productData.title}
                  onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                  title="Click to edit name"
                />
                <p>{productData.category} • {productData.serving}</p>
              </div>
            </div>

            <div className="caution-box">
              <div className="caution-title">DHYAN DEIN / CAUTION:</div>
              <p className="caution-desc">{productData.caution}</p>
            </div>

            <div className="calorie-badge-row">
              <span className="cal-label">Total Calorie Estimation:</span>
              <span className="cal-highlight">{productData.calories}</span>
            </div>

            <div className="nutrition-summary-card">
              <div className="summary-header">
                <h3>Nutrition Summary</h3>
                <span className="per-serving">{productData.serving}</span>
              </div>

              {productData.nutrients.map((item, idx) => (
                <div key={idx} className="nutrient-row">
                  <div>{renderNutrientIcon(item.iconKey)}</div>
                  <div className="nutrient-info">
                    <span className="nutrient-title">{item.name}</span>
                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                  <span className="nutrient-value">{item.val}</span>
                </div>
              ))}
            </div>

            <button className="audio-btn" onClick={() => speakAudioHindi(productData.audioText)}>
              <Volume2 size={20} /> Replay Spoken Verdict (हिंदी)
            </button>

            <button className="reset-btn" onClick={handleReset} style={{ marginTop: '10px' }}>
              <RotateCcw size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Scan Another Item
            </button>
          </div>
        </div>
      )}

      {/* 4. DATE-WISE SCAN HISTORY & COMPARISON */}
      {currentScreen === 'history' && (
        <div className="history-view">
          {comparison && (
            <div className="compare-header-box">
              <div className="compare-title-row">
                <Sparkles size={18} color="#059669" />
                <span>Smart AI Health Comparison</span>
              </div>
              <div className="compare-recommendation">
                For <strong>{profile.toUpperCase()}</strong>:{' '}
                {profile === 'normal' ? (
                  <span>{comparison.reason}</span>
                ) : (
                  <span>
                    the safer choice is <strong>{comparison.best.title.split(',')[0]}</strong> because {comparison.reason}
                  </span>
                )}
              </div>
              <button 
                className="compare-breakdown-btn" 
                onClick={() => setShowCompareModal(true)}
              >
                <Award size={14} /> Compare Scanned Items
              </button>
            </div>
          )}

          <h3 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Scanned Products</h3>
          
          {scanHistory.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', marginTop: '30px' }}>
              No items scanned yet. Use the camera to scan a product!
            </p>
          ) : (
            scanHistory.map((item) => {
              const thumbImg = item.image || (item.data?.calNum === 450 ? MAGGI_SVG : RUSK_SVG);
              const isSpecificWinner = profile !== 'normal' && comparison?.best?.title === item.data?.title;

              return (
                <div key={item.id}>
                  <div className="date-group-title">{item.date} • {item.time}</div>
                  <div 
                    className="history-card" 
                    onClick={() => handleSelectHistoryItem(item)}
                    title="Click to view full analysis"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={thumbImg} 
                        alt="Thumbnail" 
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: '#f8fafc', border: '1px solid #e2e8f0' }} 
                      />
                      <div>
                        <h4>{item.data?.title}</h4>
                        {/* Normal profile: both get Safe badge */}
                        {profile === 'normal' && scanHistory.length > 1 && (
                          <span className="best-choice-badge">✓ Safe in Moderation</span>
                        )}
                        {/* Diabetes / High BP: only winner gets Recommended badge */}
                        {isSpecificWinner && scanHistory.length > 1 && (
                          <span className="best-choice-badge">★ Recommended For Current Profile</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="history-cal-tag">{item.data?.calories}</span>
                      <ChevronRight size={18} color="#94a3b8" />
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {scanHistory.length > 0 && (
            <button 
              className="reset-btn" 
              onClick={() => {
                localStorage.removeItem('nutri_scan_history_prod_v2');
                setScanHistory([]);
              }}
              style={{ marginTop: '18px', border: '1px solid #cbd5e1' }}
            >
              Clear History
            </button>
          )}

          {/* Side-by-Side Comparison Modal Table */}
          {showCompareModal && comparison && (
            <div className="modal-overlay" onClick={() => setShowCompareModal(false)}>
              <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Side-by-Side Product Comparison</h3>
                  <button className="modal-close-btn" onClick={() => setShowCompareModal(false)}>
                    <X size={16} />
                  </button>
                </div>

                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  Health Evaluation for: <strong>{profile.toUpperCase()} profile</strong>
                </p>

                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Calories</th>
                      <th>Sugars</th>
                      <th>Sodium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.allItems.map((p, idx) => {
                      const isWinner = p.title === comparison.best.title;
                      return (
                        <tr key={idx} style={{ background: profile !== 'normal' && isWinner ? '#f0fdf4' : 'transparent' }}>
                          <td>
                            <strong>{p.title.split(',')[0]}</strong>
                            {profile === 'normal' ? (
                              <div className="best-choice-badge">✓ Safe in Moderation</div>
                            ) : (
                              isWinner && <div className="best-choice-badge">Better Option</div>
                            )}
                          </td>
                          <td>{p.calories}</td>
                          <td>{p.sugarNum} g</td>
                          <td>{p.sodiumNum} mg</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}