import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Search, MapPin } from 'lucide-react';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Canada',
  'Chile', 'China', 'Colombia', 'Czech Republic', 'Denmark', 'Egypt', 'Ethiopia', 'Finland', 'France', 'Germany',
  'Ghana', 'Greece', 'Hong Kong', 'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Japan', 'Jordan', 'Kenya', 'South Korea', 'Kuwait', 'Lebanon', 'Malaysia', 'Mexico', 'Morocco',
  'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Turkey', 'UAE', 'Uganda', 'Ukraine', 'United Kingdom', 'United States', 'Venezuela', 'Vietnam'
];

const INTERESTS = [
  'Anime', 'Gaming', 'Music', 'Sports', 'Plants', 'Art', 'Photography', 
  'Reading', 'Minimalism', 'Tech', 'Cottagecore', 'Streetwear', 'Film', 'Cooking', 'Fitness'
];

const MOOD_OPTIONS = [
  { id: 'cozy', label: 'Cozy & Comfortable', emoji: '🧸', description: 'I want my room to feel warm and inviting' },
  { id: 'productive', label: 'Focused & Clean', emoji: '📚', description: 'I need a space that helps me concentrate' },
  { id: 'creative', label: 'Inspired & Artistic', emoji: '🎨', description: 'I want my walls to spark creativity' },
  { id: 'social', label: 'Fun & Social', emoji: '🎮', description: 'I love hosting friends in my space' },
  { id: 'calm', label: 'Peaceful & Minimal', emoji: '🧘', description: 'I need a calm retreat to unwind' },
  { id: 'energetic', label: 'Vibrant & Bold', emoji: '⚡', description: 'I want energy to flow through my room' },
];

const WEEKEND_OPTIONS = [
  { id: 'studying', label: 'Studying & Learning', icon: '📖' },
  { id: 'gaming', label: 'Gaming & Streaming', icon: '🎮' },
  { id: 'friends', label: 'Hanging with Friends', icon: '👥' },
  { id: 'creating', label: 'Creating & Making', icon: '✏️' },
  { id: 'relaxing', label: 'Relaxing & Resting', icon: '🛋️' },
  { id: 'outdoor', label: 'Outdoor & Active', icon: '🏃' },
];

const ORGANIZATION_LEVELS = [
  { id: 'minimalist', label: 'I love clean surfaces', sublabel: 'Everything has its place' },
  { id: 'balanced', label: 'Some items out, some stored', sublabel: 'Organized but lived-in' },
  { id: 'maximalist', label: 'Display everything I love', sublabel: 'My items tell my story' },
];

const TIME_SPENT_OPTIONS = [
  { id: 'rarely', label: 'Just for sleeping', hours: '< 4 hrs/day' },
  { id: 'sometimes', label: 'Study & relax here', hours: '4-8 hrs/day' },
  { id: 'often', label: 'My main hangout spot', hours: '8-12 hrs/day' },
  { id: 'always', label: 'Home office + bedroom', hours: '12+ hrs/day' },
];

const PERSONALITY_TRAITS = [
  { id: 'introvert', label: 'Introvert', description: 'I recharge by being alone' },
  { id: 'extrovert', label: 'Extrovert', description: 'Energy comes from social time' },
  { id: 'ambivert', label: 'Ambivert', description: 'I need both solitude and company' },
];

const CountrySelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search for your country..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-teal-500 text-white"
        />
      </div>
      <AnimatePresence>
        {showDropdown && filteredCountries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl max-h-60 overflow-y-auto shadow-xl"
          >
            {filteredCountries.map((country) => (
              <button
                key={country}
                onClick={() => {
                  onChange(country);
                  setSearch(country);
                  setShowDropdown(false);
                }}
                className="w-full px-6 py-3 text-left text-zinc-300 hover:bg-zinc-800 hover:text-teal-400 flex items-center gap-3"
              >
                <MapPin className="w-4 h-4" />
                {country}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {value && !showDropdown && (
        <div className="mt-3 flex items-center gap-2 text-zinc-400">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>Selected: <span className="text-teal-400 font-medium">{value}</span></span>
        </div>
      )}
    </div>
  );
};

const VibeQuiz: React.FC = () => {
  const navigate = useNavigate();
  const setQuizData = useStore((state) => state.setQuizData);
  
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    mood: '',
    weekendActivity: '',
    organization: '',
    timeSpent: '',
    personality: '',
    interests: [] as string[],
    budget: 200,
    isInternational: false,
    country: '',
  });

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const algorithmResult = calculateVibeAlgorithm(formData);
    
    setQuizData({
      ...formData,
      colorPalette: algorithmResult.colorPalette,
      priority: algorithmResult.theme,
      interests: formData.interests,
    });
    navigate('/loading');
  };

  const calculateVibeAlgorithm = (data: typeof formData) => {
    let theme = 'Cozy Corner';
    let colorPalette = 'Soft Pastels';
    
    const scores = {
      cozy: 0,
      productive: 0,
      creative: 0,
      social: 0,
      calm: 0,
      energetic: 0,
    };

    if (data.mood) scores[data.mood as keyof typeof scores] += 3;
    if (data.weekendActivity === 'studying') scores.productive += 2;
    if (data.weekendActivity === 'gaming') scores.social += 2;
    if (data.weekendActivity === 'creating') scores.creative += 2;
    if (data.weekendActivity === 'relaxing') scores.cozy += 2;
    if (data.weekendActivity === 'friends') scores.social += 3;
    if (data.organization === 'minimalist') scores.calm += 2;
    if (data.organization === 'maximalist') scores.creative += 2;
    if (data.organization === 'balanced') scores.cozy += 1;
    if (data.timeSpent === 'always') scores.cozy += 2;
    if (data.timeSpent === 'rarely') scores.productive += 1;
    if (data.personality === 'introvert') scores.calm += 2;
    if (data.personality === 'extrovert') scores.social += 2;
    if (data.personality === 'ambivert') scores.cozy += 1;

    if (data.interests.includes('Gaming')) scores.social += 1;
    if (data.interests.includes('Minimalism')) scores.calm += 2;
    if (data.interests.includes('Art')) scores.creative += 2;
    if (data.interests.includes('Plants')) scores.cozy += 1;
    if (data.interests.includes('Tech')) scores.productive += 1;

    const maxScore = Math.max(...Object.values(scores));
    const dominantVibe = Object.entries(scores).find(([, score]) => score === maxScore)?.[0];

    const vibeThemes: Record<string, { theme: string; palette: string }> = {
      cozy: { theme: 'Cozy Sanctuary', palette: 'Warm Earth' },
      productive: { theme: 'Study Haven', palette: 'Neutral Minimal' },
      creative: { theme: 'Artistic Studio', palette: 'Bright & Bold' },
      social: { theme: 'Social Hub', palette: 'Cool Ocean' },
      calm: { theme: 'Zen Retreat', palette: 'Soft Pastels' },
      energetic: { theme: 'Energy Zone', palette: 'Dark & Moody' },
    };

    if (vibeThemes[dominantVibe]) {
      theme = vibeThemes[dominantVibe].theme;
      colorPalette = vibeThemes[dominantVibe].palette;
    }

    return { theme, colorPalette };
  };

  const sections = [
    { title: 'How do you want your room to feel?', subtitle: 'Choose the mood that resonates with you' },
    { title: 'What does your ideal weekend look like?', subtitle: 'This helps us understand your lifestyle' },
    { title: 'How do you feel about clutter?', subtitle: 'Your organization style matters' },
    { title: 'How much time do you spend in your room?', subtitle: 'This determines comfort needs' },
    { title: 'Are you more introverted or extroverted?', subtitle: 'Your social battery type' },
    { title: 'What are you into?', subtitle: 'Select all that apply' },
    { title: "What's your budget?", subtitle: 'Set your spending limit' },
    { title: 'Are you an international student?', subtitle: 'This helps us understand your needs better' },
  ];

  const isSectionComplete = (sectionIndex: number) => {
    switch(sectionIndex) {
      case 0: return !!formData.mood;
      case 1: return !!formData.weekendActivity;
      case 2: return !!formData.organization;
      case 3: return !!formData.timeSpent;
      case 4: return !!formData.personality;
      case 5: return formData.interests.length > 0;
      case 6: return formData.budget >= 50;
      case 7: return !formData.isInternational || (formData.isInternational && formData.country.trim().length > 0);
      default: return false;
    }
  };

  const canProceed = isSectionComplete(currentSection);

  const scrollToSection = (index: number) => {
    const allSections = document.querySelectorAll('.quiz-section');
    if (allSections[index]) {
      allSections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToNext = () => {
    if (canProceed && currentSection < sections.length - 1) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setTimeout(() => scrollToSection(nextSection), 100);
    }
  };

  const goToPrevious = () => {
    if (currentSection > 0) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      setTimeout(() => scrollToSection(prevSection), 100);
    }
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-[#0f0f0f]">
      {/* Hero Section */}
      <section className="h-screen snap-start flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            Dorm<span className="text-teal-400">Vibe</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12">
            AI-powered room styling for the next generation of students.
          </p>
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-zinc-600" />
          </div>
        </motion.div>
      </section>

      {/* Survey Sections */}
      <div>
        {sections.map((section, index) => (
          <section 
            key={index} 
            ref={(el) => { sectionRefs.current[index] = el as HTMLDivElement; }}
            className="h-screen snap-start flex flex-col items-center justify-center p-6 quiz-section"
          >
            <div className="max-w-3xl w-full">
              <div className="text-center mb-8">
                <span className="text-teal-400 text-sm font-medium">Question {index + 1} of {sections.length}</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">{section.title}</h2>
                <p className="text-zinc-400 mt-2">{section.subtitle}</p>
              </div>

              <div className="mt-8">
                {index === 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => setFormData({ ...formData, mood: mood.id })}
                        className={`p-4 rounded-2xl border transition-all text-left ${
                          formData.mood === mood.id
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'
                        }`}
                      >
                        <span className="text-3xl block mb-2">{mood.emoji}</span>
                        <span className={`font-medium ${formData.mood === mood.id ? 'text-teal-400' : 'text-zinc-300'}`}>
                          {mood.label}
                        </span>
                        <p className="text-xs text-zinc-500 mt-1">{mood.description}</p>
                      </button>
                    ))}
                  </div>
                )}

                {index === 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {WEEKEND_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFormData({ ...formData, weekendActivity: option.id })}
                        className={`p-6 rounded-2xl border transition-all text-center ${
                          formData.weekendActivity === option.id
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'
                        }`}
                      >
                        <span className="text-4xl block mb-3">{option.icon}</span>
                        <span className={`font-medium ${formData.weekendActivity === option.id ? 'text-teal-400' : 'text-zinc-300'}`}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {index === 2 && (
                  <div className="space-y-4">
                    {ORGANIZATION_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setFormData({ ...formData, organization: level.id })}
                        className={`w-full p-6 rounded-2xl border transition-all text-left ${
                          formData.organization === level.id
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'
                        }`}
                      >
                        <span className={`text-lg font-medium ${formData.organization === level.id ? 'text-teal-400' : 'text-zinc-300'}`}>
                          {level.label}
                        </span>
                        <p className="text-sm text-zinc-500 mt-1">{level.sublabel}</p>
                      </button>
                    ))}
                  </div>
                )}

                {index === 3 && (
                  <div className="space-y-4">
                    {TIME_SPENT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFormData({ ...formData, timeSpent: option.id })}
                        className={`w-full p-6 rounded-2xl border transition-all text-left flex items-center justify-between ${
                          formData.timeSpent === option.id
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'
                        }`}
                      >
                        <span className={`text-lg font-medium ${formData.timeSpent === option.id ? 'text-teal-400' : 'text-zinc-300'}`}>
                          {option.label}
                        </span>
                        <span className="text-zinc-500 text-sm">{option.hours}</span>
                      </button>
                    ))}
                  </div>
                )}

                {index === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PERSONALITY_TRAITS.map((trait) => (
                      <button
                        key={trait.id}
                        onClick={() => setFormData({ ...formData, personality: trait.id })}
                        className={`p-6 rounded-2xl border transition-all text-center ${
                          formData.personality === trait.id
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'
                        }`}
                      >
                        <span className={`text-xl font-bold block mb-2 ${formData.personality === trait.id ? 'text-teal-400' : 'text-zinc-300'}`}>
                          {trait.label}
                        </span>
                        <p className="text-sm text-zinc-500">{trait.description}</p>
                      </button>
                    ))}
                  </div>
                )}

                {index === 5 && (
                  <div className="flex flex-wrap justify-center gap-3">
                    {INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                          formData.interests.includes(interest)
                            ? 'bg-teal-500 border-teal-500 text-black font-bold'
                            : 'border-zinc-700 hover:border-teal-500 text-zinc-400'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                )}

                {index === 6 && (
                  <div className="px-8">
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                      className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-grab active:cursor-grabbing accent-teal-500"
                      style={{
                        background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((formData.budget - 50) / 450) * 100}%, #3f3f46 ${((formData.budget - 50) / 450) * 100}%, #3f3f46 100%)`
                      }}
                    />
                    <div className="flex justify-between mt-6 text-zinc-500 font-medium">
                      <span>$50</span>
                      <span className="text-teal-400 text-2xl font-bold">${formData.budget}</span>
                      <span>$500</span>
                    </div>
                  </div>
                )}

                {index === 7 && (
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, isInternational: true })}
                        className={`px-8 py-4 rounded-xl border transition-all ${
                          formData.isInternational ? 'bg-teal-500 border-teal-500 text-black' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, isInternational: false, country: '' })}
                        className={`px-8 py-4 rounded-xl border transition-all ${
                          formData.isInternational === false ? 'bg-teal-500 border-teal-500 text-black' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        No
                      </button>
                    </div>
                    {formData.isInternational && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="w-full max-w-md mt-4 relative"
                      >
                        <CountrySelector value={formData.country} onChange={(country) => setFormData({ ...formData, country })} />
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-12">
                <button
                  onClick={goToPrevious}
                  disabled={currentSection === 0}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    currentSection === 0
                      ? 'text-zinc-600 cursor-not-allowed'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ← Previous
                </button>
                
                {currentSection < sections.length - 1 ? (
                  <button
                    onClick={goToNext}
                    disabled={!canProceed}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${
                      canProceed
                        ? 'bg-teal-500 text-black hover:bg-teal-400'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed}
                    className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      canProceed
                        ? 'bg-teal-500 text-black hover:bg-teal-400 shadow-[0_0_40px_rgba(45,212,191,0.3)]'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    Generate My DormVibe <Sparkles className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default VibeQuiz;