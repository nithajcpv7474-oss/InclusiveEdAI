import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Auth & Seed Sessions
  useEffect(() => {
    // 1. Get current active user session
    const activeUser = localStorage.getItem('sensusai_user');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
    }

    // 2. Hydrate users list or seed default users
    const storedUsers = localStorage.getItem('sensusai_registered_users');
    let registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Seed demo user if missing
    const demoUserExists = registeredUsers.some(u => u.email === 'demo@sensusai.ai');
    if (!demoUserExists) {
      const demoUser = {
        name: 'Alex Learner',
        email: 'demo@sensusai.ai',
        password: 'password123',
        preferences: ['adhd', 'dyslexia', 'auditory'],
        lang: 'te'
      };
      registeredUsers.push(demoUser);
      localStorage.setItem('sensusai_registered_users', JSON.stringify(registeredUsers));
    }

    // 3. Hydrate sessions or seed default lectures
    const storedSessions = localStorage.getItem('sensusai_sessions');
    let userSessions = storedSessions ? JSON.parse(storedSessions) : [];

    if (userSessions.length === 0) {
      // Seed interesting demo sessions
      userSessions = [
        {
          id: 'session-1',
          userEmail: 'demo@sensusai.ai',
          title: 'Ecology 101: Photosynthesis & Biosphere Balance',
          category: 'Lecture',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
          lang: 'te',
          profiles: ['adhd', 'dyslexia', 'esl', 'auditory'],
          originalText: 'Photosynthesis is the highly intricate biological system used by photoautotrophic organisms to convert light energy, typically derived from solar radiation, into chemical energy. This chemical potential energy is sequestered in the synthetic molecular bonds of carbohydrate compounds, such as glucose and fructose, which are synthesized from simple inorganic carbon dioxide and water molecules. The reaction releases diatomic oxygen as a gaseous metabolic byproduct, driving terrestrial respiration.',
          simplifiedText: 'Plants, algae, and some bacteria use a biological process called photosynthesis to turn sunlight into food. They absorb carbon dioxide from the air and water from the soil, combining them using light energy. This process makes sugars (glucose) which plants store as energy to grow and survive. As a useful byproduct, plants release oxygen back into the air, which humans and animals need to breathe.',
          translatedText: 'మొక్కలు, శైవలాలు మరియు కొన్ని బ్యాక్టీరియా సూర్యరశ్మిని ఆహారంగా మార్చడానికి కిరణజన్య సంయోగ క్రియ అనే జీవ ప్రక్రియను ఉపయోగిస్తాయి. అవి గాలి నుండి కార్బన్ డై ఆక్సైడ్‌ను మరియు నేల నుండి నీటిని గ్రహించి, కాంతి శక్తిని ఉపయోగించి వాటిని కలుపుతాయి. ఈ ప్రక్రియ మొక్కలు పెరగడానికి మరియు మనుగడ సాగించడానికి శక్తిగా నిల్వ చేసే చక్కెరలను (గ్లూకోజ్) తయారు చేస్తుంది. ఒక ఉపయోగకరమైన ఉప ఉత్పత్తిగా, మొక్కలు ఆక్సిజన్‌ను తిరిగి గాలిలోకి విడుదల చేస్తాయి, దీనిని మానవులు మరియు జంతువులు శ్వాసించడానికి ఉపయోగిస్తాయి.'
        },
        {
          id: 'session-2',
          userEmail: 'demo@sensusai.ai',
          title: 'Hydrology 202: The Global Water Cycle',
          category: 'Study Notes',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          lang: 'es',
          profiles: ['dyslexia', 'esl'],
          originalText: 'The global hydrological cycle describes the continuous movement of water on, above, and below the surface of the Earth. Solar radiation heats water in oceans and seas, inducing evaporation as water vapor. The vapor rises into the atmosphere where it cools and condenses into clouds. Driven by atmospheric winds, cloud particles collide and grow, eventually falling back to the surface as precipitation. Gravity then pulls this runoff into rivers and groundwater channels, completing the loop.',
          simplifiedText: 'The water cycle is the continuous movement of water on Earth. Sunlight warms ocean water, turning it into vapor (steam) that rises into the air. This vapor cools to form clouds. Clouds drop rain or snow (precipitation) back to the ground. Gravity guides the water into lakes and oceans so the cycle can repeat.',
          translatedText: 'El ciclo global del agua describe el movimiento continuo del agua sobre, arriba y debajo de la superficie de la Tierra. La radiación solar calienta el agua en océanos y mares, induciendo la evaporación como vapor de agua. El vapor se eleva a la atmósfera donde se enfría y se condensa en nubes.'
        }
      ];
      localStorage.setItem('sensusai_sessions', JSON.stringify(userSessions));
    }
    
    setSessions(userSessions);
    setLoading(false);
  }, []);

  // Login handler
  const login = (email, password) => {
    const storedUsers = localStorage.getItem('sensusai_registered_users');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const sessionUser = {
        name: foundUser.name,
        email: foundUser.email,
        preferences: foundUser.preferences || [],
        lang: foundUser.lang || 'es'
      };
      setUser(sessionUser);
      localStorage.setItem('sensusai_user', JSON.stringify(sessionUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  // Signup handler
  const signup = (name, email, password, preferences = [], lang = 'es') => {
    const storedUsers = localStorage.getItem('sensusai_registered_users');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = { name, email, password, preferences, lang };
    registeredUsers.push(newUser);
    localStorage.setItem('sensusai_registered_users', JSON.stringify(registeredUsers));

    const sessionUser = { name, email, preferences, lang };
    setUser(sessionUser);
    localStorage.setItem('sensusai_user', JSON.stringify(sessionUser));
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sensusai_user');
  };

  // Add processed lecture session
  const addSession = (session) => {
    const storedSessions = localStorage.getItem('sensusai_sessions');
    let userSessions = storedSessions ? JSON.parse(storedSessions) : [];

    const newSession = {
      ...session,
      id: `session-${Date.now()}`,
      userEmail: user?.email || 'demo@sensusai.ai',
      date: new Date().toLocaleDateString()
    };

    userSessions.unshift(newSession);
    localStorage.setItem('sensusai_sessions', JSON.stringify(userSessions));
    setSessions(userSessions);
    return newSession;
  };

  // Delete lecture session
  const deleteSession = (sessionId) => {
    const storedSessions = localStorage.getItem('sensusai_sessions');
    let userSessions = storedSessions ? JSON.parse(storedSessions) : [];

    userSessions = userSessions.filter(s => s.id !== sessionId);
    localStorage.setItem('sensusai_sessions', JSON.stringify(userSessions));
    setSessions(userSessions);
  };

  // Update User Preference Settings
  const updatePreferences = (updatedPrefs, updatedLang) => {
    if (!user) return;
    
    // Update active user state
    const updatedUser = { ...user, preferences: updatedPrefs, lang: updatedLang };
    setUser(updatedUser);
    localStorage.setItem('sensusai_user', JSON.stringify(updatedUser));

    // Update registered list
    const storedUsers = localStorage.getItem('sensusai_registered_users');
    let registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    registeredUsers = registeredUsers.map(u => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, preferences: updatedPrefs, lang: updatedLang };
      }
      return u;
    });
    localStorage.setItem('sensusai_registered_users', JSON.stringify(registeredUsers));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessions: sessions.filter(s => s.userEmail === user?.email),
        loading,
        login,
        signup,
        logout,
        addSession,
        deleteSession,
        updatePreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
