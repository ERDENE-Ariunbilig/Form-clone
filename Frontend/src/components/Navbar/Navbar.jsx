import { useState, useReducer, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

// SVG Icons

const PaletteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.83 21 13.5 20.33 13.5 19.5C13.5 19.11 13.35 18.76 13.11 18.49C12.88 18.23 12.73 17.88 12.73 17.5C12.73 16.67 13.4 16 14.23 16H16C18.76 16 21 13.76 21 11C21 6.58 16.97 3 12 3ZM6.5 12C5.67 12 5 11.33 5 10.5C5 9.67 5.67 9 6.5 9C7.33 9 8 9.67 8 10.5C8 11.33 7.33 12 6.5 12ZM9.5 8C8.67 8 8 7.33 8 6.5C8 5.67 8.67 5 9.5 5C10.33 5 11 5.67 11 6.5C11 7.33 10.33 8 9.5 8ZM14.5 8C13.67 8 13 7.33 13 6.5C13 5.67 13.67 5 14.5 5C15.33 5 16 5.67 16 6.5C16 7.33 15.33 8 14.5 8ZM17.5 12C16.67 12 16 11.33 16 10.5C16 9.67 16.67 9 17.5 9C18.33 9 19 9.67 19 10.5C19 11.33 18.33 12 17.5 12Z" fill="currentColor"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
  </svg>
);

// Options Menu Component
const OptionsMenu = ({ isOpen, onClose, onDeleteForm }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  const handleMoveToTrash = () => {
    if (window.confirm('Энэ маягтыг хогийн саванд хийх үү?')) {
      onDeleteForm();
      navigate('/');
    }
    onClose();
  };
  
  const options = [
    { label: 'Хувилах', action: () => { alert('Хувилагдлаа'); onClose(); } },
    { label: 'Хогийн сав руу зөөх', action: handleMoveToTrash },
    { label: 'Хэвлэх', action: () => { window.print(); onClose(); } },
    { label: 'Гарын товчлолууд', action: () => { alert('Гарын товчлолууд'); onClose(); } },
  ];

  return (
    <div className="options-menu">
      <div className="menu-overlay" onClick={onClose}></div>
      <ul className="menu-items" onClick={(e) => e.stopPropagation()}>
        {options.map((option, index) => (
          <li key={index} onClick={option.action}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Theme Menu Component
const ThemeMenu = ({ isOpen, onClose, onBgColorChange }) => {
  if (!isOpen) return null;

  const bgColors = [
    { color: '#FFFFFF', label: 'White' },
    { color: '#F3E5F5', label: 'Lavender' },
    { color: '#E8EAF6', label: 'Light Blue' },
    { color: '#E0F2F1', label: 'Mint' },
    { color: '#FFF8E1', label: 'Cream' },
    { color: '#FFEBEE', label: 'Light Pink' },
  ];
  const googleFonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway', 'Poppins', 'Merriweather', 'Nunito',
    'Ubuntu', 'PT Sans', 'Rubik', 'Noto Sans', 'Mukta', 'Inter', 'Quicksand', 'Work Sans', 'Arimo',
    'Cabin', 'Fira Sans', 'Barlow', 'Source Sans Pro', 'Josefin Sans', 'Hind', 'Karla', 'Oxygen',
    'Titillium Web', 'Tajawal', 'Manrope', 'Assistant', 'DM Sans', 'Heebo', 'Mulish', 'Lexend',
    'Cairo', 'Questrial', 'Varela Round', 'Signika', 'Zilla Slab', 'Crimson Text', 'Spectral',
    'Archivo', 'Space Grotesk', 'Catamaran', 'Exo 2', 'Yanone Kaffeesatz', 'Asap', 'Cormorant Garamond',
    'Playfair Display', 'Dosis'
  ];

  const fontOptionsHeader = [...googleFonts];
  const fontOptionsQuestion = [...googleFonts];
  const fontOptionsText = [...googleFonts];
  const headerSizes = ['24', '23', '22', '21', '20', '19', '18'];
  const questionSizes = ['18', '17', '16', '15', '14', '13', '12'];
  const textSizes = ['12', '11', '10', '9'];

  // Тус тусдаа state-үүд
  const [headerFont, setHeaderFont] = useState('Roboto');
  const [questionFont, setQuestionFont] = useState('Roboto');
  const [textFont, setTextFont] = useState('Roboto');
  const [headerSize, setHeaderSize] = useState('24');
  const [questionSize, setQuestionSize] = useState('12');
  const [textSize, setTextSize] = useState('11');
  const [activeBgColor, setActiveBgColor] = useState('#FFFFFF');

  const handleBgColorChange = (color) => {
    setActiveBgColor(color);
    onBgColorChange(color);
    document.body.style.backgroundColor = color;
  };

  // Google Fonts динамикаар дуудах
  useEffect(() => {
    // Сонгогдсон font-уудыг дуудах
    const fontsToLoad = [headerFont, questionFont, textFont, ...googleFonts].filter(
      (font, index, self) => self.indexOf(font) === index
    );
    const fontUrl = `https://fonts.googleapis.com/css2?${fontsToLoad
      .map((font) => `family=${font.replace(' ', '+')}`)
      .join('&')}&display=swap`;
    
    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // CSS custom properties-г шинэчлэх
    document.documentElement.style.setProperty('--header-font', `"${headerFont}", sans-serif`);
    document.documentElement.style.setProperty('--header-size', `${headerSize}px`);
    document.documentElement.style.setProperty('--question-font', `"${questionFont}", sans-serif`);
    document.documentElement.style.setProperty('--question-size', `${questionSize}px`);
    document.documentElement.style.setProperty('--text-font', `"${textFont}", sans-serif`);
    document.documentElement.style.setProperty('--text-size', `${textSize}px`);

    return () => {
      document.head.removeChild(link);
    };
  }, [headerFont, questionFont, textFont, headerSize, questionSize, textSize]);

  return (
    <div className="theme-menu">
      <div className="menu-overlay" onClick={onClose}></div>
      <div className="theme-content" onClick={(e) => e.stopPropagation()}>
        <div className="theme-header">
          <span>Theme</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <h4 className="section-title">Text style</h4>

        <div className="style-section">
          <label>Header</label>
          <div className="font-selectors">
            <select
              className="font-family-select"
              value={headerFont}
              onChange={(e) => setHeaderFont(e.target.value)}
            >
              {fontOptionsHeader.map((font) => (
                <option key={font} value={font} style={{ fontFamily: `"${font}", sans-serif` }}>
                  {font}
                </option>
              ))}
            </select>

            <select
              className="font-size-select"
              value={headerSize}
              onChange={(e) => setHeaderSize(e.target.value)}
            >
              {headerSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="style-section">
          <label>Question</label>
          <div className="font-selectors">
            <select
              className="font-family-select"
              value={questionFont}
              onChange={(e) => setQuestionFont(e.target.value)}
            >
              {fontOptionsQuestion.map((font) => (
                <option key={font} value={font} style={{ fontFamily: `"${font}", sans-serif` }}>
                  {font}
                </option>
              ))}
            </select>

            <select
              className="font-size-select"
              value={questionSize}
              onChange={(e) => setQuestionFont(e.target.value)}
            >
              {questionSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="style-section">
          <label>Text</label>
          <div className="font-selectors">
            <select
              className="font-family-select"
              value={textFont}
              onChange={(e) => setTextFont(e.target.value)}
            >
              {fontOptionsText.map((font) => (
                <option key={font} value={font} style={{ fontFamily: `"${font}", sans-serif` }}>
                  {font}
                </option>
              ))}
            </select>

            <select
              className="font-size-select"
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
            >
              {textSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="style-section">
          <label>Header</label>
          <button className="image-select-btn">
            <span className="image-icon">📷</span>
            Choose Image
          </button>
        </div>

        <h4 className="section-title">Background</h4>
        <div className="background-options">
          {bgColors.map((bgColor, index) => (
            <button
              key={index}
              className={`bg-btn ${activeBgColor === bgColor.color ? 'active' : ''}`}
              style={{ background: bgColor.color }}
              onClick={() => handleBgColorChange(bgColor.color)}
              title={bgColor.label}
            >
              {activeBgColor === bgColor.color && <span className="check-mark">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Navbar Component
function Navbar() {
  const [formStyle, setFormStyle] = useState({
    color: '#800080',
    backgroundColor: '#FFFFFF'
  });
  
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  
  const location = useLocation(); // Get current location
  const isCreateRoute = location.pathname === '/create'; // Check if current path is /create

  // Apply initial background color on component mount
  useEffect(() => {
    if (formStyle.backgroundColor) {
      document.body.style.backgroundColor = formStyle.backgroundColor;
    }
    // Cleanup function to restore original background when component unmounts
    return () => {
      document.body.style.backgroundColor = '#f5f5f5';
    };
  }, []);

  // Handle style changes
  const updateStyle = (changes) => {
    setHistory([...history, {...formStyle}]);
    setRedoStack([]);
    const newStyle = {...formStyle, ...changes};
    setFormStyle(newStyle);
    
    // Apply background color directly to the body
    if (changes.backgroundColor) {
      document.body.style.backgroundColor = changes.backgroundColor;
    }
  };

  const handleDeleteForm = () => {
    console.log('Form deleted');
    // Add actual delete form logic
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <Link to="/">Form clone</Link>
        </div>
        <div className="navbar-actions">
          {isCreateRoute && (
            <>

              <button 
                className="action-button" 
                onClick={() => setThemeMenuOpen(true)}
              >
                <PaletteIcon />
              </button>
              <button 
                className="action-button" 
                onClick={() => setOptionsMenuOpen(true)}
              >
                <MenuIcon />
              </button>
            </>
          )}
        </div>
      </div>
      
      <ul className="navLinks">
        <li>
          <Link to="/create">Create Form</Link>
        </li>
        <li>
          <Link to="/auth">
            <UserIcon />
          </Link>
        </li>
      </ul>
      
      {isCreateRoute && (
        <>
          <OptionsMenu 
            isOpen={optionsMenuOpen}
            onClose={() => setOptionsMenuOpen(false)}
            onDeleteForm={handleDeleteForm}
          />
          
          <ThemeMenu 
            isOpen={themeMenuOpen}
            onClose={() => setThemeMenuOpen(false)}
            onBgColorChange={(backgroundColor) => updateStyle({backgroundColor})}
          />
        </>
      )}
    </nav>
  );
}

export default Navbar;     