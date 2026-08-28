import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  // Centralized Settings Data Structure
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('inclusive-user-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          accessibility: {
            dyslexiaFont: false,
            highContrast: false,
            reducedMotion: false,
            largeControls: false,
            increasedLineSpacing: false,
            increasedLetterSpacing: false,
            ...parsed.accessibility
          },
          learning: {
            easyRead: false,
            ...parsed.learning
          },
          audio: {
            textToSpeech: true,
            autoRead: false,
            speed: 1.0,
            ...parsed.audio
          },
          language: {
            preferred: "en",
            ...parsed.language
          },
          notifications: {
            aiProcessing: true,
            translation: true,
            accessibility: true,
            errors: true,
            ...parsed.notifications
          },
          appearance: {
            theme: "system",
            fontSize: "md",
            ...parsed.appearance
          }
        };
      } catch (e) {
        console.error("Error parsing settings, using defaults", e);
      }
    }
    return {
      accessibility: {
        dyslexiaFont: false,
        highContrast: false,
        reducedMotion: false,
        largeControls: false,
        increasedLineSpacing: false,
        increasedLetterSpacing: false
      },
      learning: {
        easyRead: false
      },
      audio: {
        textToSpeech: true,
        autoRead: false,
        speed: 1.0
      },
      language: {
        preferred: "en"
      },
      notifications: {
        aiProcessing: true,
        translation: true,
        accessibility: true,
        errors: true
      },
      appearance: {
        theme: "system",
        fontSize: "md"
      }
    };
  });

  // central helper to update specific setting keys
  const updateSetting = (category, key, value) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      };
      return updated;
    });
  };

  // Backward compatibility getters
  const fontSize = settings.appearance.fontSize;
  const setFontSize = (size) => updateSetting('appearance', 'fontSize', size);

  const dyslexiaMode = settings.accessibility.dyslexiaFont;
  const setDyslexiaMode = (val) => updateSetting('accessibility', 'dyslexiaFont', val);

  const themeTint = settings.appearance.theme === 'dark' ? 'dark' : (settings.learning.easyRead ? 'warm' : 'default');
  const setThemeTint = (tint) => {
    if (tint === 'dark') {
      updateSetting('appearance', 'theme', 'dark');
    } else if (tint === 'warm') {
      setSettings(prev => ({
        ...prev,
        appearance: { ...prev.appearance, theme: 'light' },
        learning: { ...prev.learning, easyRead: true }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        appearance: { ...prev.appearance, theme: 'light' },
        learning: { ...prev.learning, easyRead: false }
      }));
    }
  };

  const highContrast = settings.accessibility.highContrast;
  const setHighContrast = (val) => updateSetting('accessibility', 'highContrast', val);

  const speechRate = settings.audio.speed;
  const setSpeechRate = (val) => updateSetting('audio', 'speed', val);

  const [speechVoice, setSpeechVoiceState] = useState(() => {
    return localStorage.getItem('inclusive-speech-voice') || '';
  });
  const setSpeechVoice = (val) => {
    setSpeechVoiceState(val);
    localStorage.setItem('inclusive-speech-voice', val);
  };

  // Effect to apply classes and sync to localStorage
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // Font size scaling
    let sizePx = '18px';
    const fs = settings.appearance.fontSize;
    if (fs === 'sm') sizePx = '16px';
    if (fs === 'md') sizePx = '18px';
    if (fs === 'lg') sizePx = '22px';
    if (fs === 'xl') sizePx = '26px';
    html.style.fontSize = sizePx;

    // Clean previous classes
    body.classList.remove(
      'dyslexia-mode',
      'high-contrast',
      'reduced-motion',
      'large-controls',
      'increased-line-spacing',
      'increased-letter-spacing',
      'dark',
      'tint-default',
      'tint-warm',
      'tint-cool',
      'tint-dark'
    );
    html.classList.remove('dark');

    // Determine Theme & Dark Classes
    let isDarkTheme = false;
    if (settings.appearance.theme === 'dark') {
      isDarkTheme = true;
    } else if (settings.appearance.theme === 'system') {
      isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDarkTheme) {
      body.classList.add('dark', 'tint-dark');
      html.classList.add('dark');
    } else {
      if (settings.learning.easyRead) {
        body.classList.add('tint-warm');
      } else {
        body.classList.add('tint-default');
      }
    }

    // Apply layout modifier toggles
    if (settings.accessibility.dyslexiaFont) body.classList.add('dyslexia-mode');
    if (settings.accessibility.highContrast) body.classList.add('high-contrast');
    if (settings.accessibility.reducedMotion) body.classList.add('reduced-motion');
    if (settings.accessibility.largeControls) body.classList.add('large-controls');
    if (settings.accessibility.increasedLineSpacing) body.classList.add('increased-line-spacing');
    if (settings.accessibility.increasedLetterSpacing) body.classList.add('increased-letter-spacing');

    // Save configuration
    localStorage.setItem('inclusive-user-settings', JSON.stringify(settings));
  }, [settings]);

  const resetSettings = () => {
    setSettings({
      accessibility: {
        dyslexiaFont: false,
        highContrast: false,
        reducedMotion: false,
        largeControls: false,
        increasedLineSpacing: false,
        increasedLetterSpacing: false
      },
      learning: {
        easyRead: false
      },
      audio: {
        textToSpeech: true,
        autoRead: false,
        speed: 1.0
      },
      language: {
        preferred: "en"
      },
      notifications: {
        aiProcessing: true,
        translation: true,
        accessibility: true,
        errors: true
      },
      appearance: {
        theme: "system",
        fontSize: "md"
      }
    });
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      setSettings,
      updateSetting,
      fontSize,
      setFontSize,
      dyslexiaMode,
      setDyslexiaMode,
      themeTint,
      setThemeTint,
      highContrast,
      setHighContrast,
      speechRate,
      setSpeechRate,
      speechVoice,
      setSpeechVoice,
      resetSettings
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
