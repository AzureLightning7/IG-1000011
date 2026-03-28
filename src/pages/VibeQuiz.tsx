import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';

const INTERESTS = [
  'Anime', 'Gaming', 'Music', 'Sports', 'Plants', 'Art', 'Photography', 
  'Reading', 'Minimalism', 'Tech', 'Cottagecore', 'Streetwear', 'Film', 'Cooking', 'Fitness'
];

const COLOR_PALETTES = [
  { name: 'Warm Earth', colors: ['bg-[#D27D2D]', 'bg-[#F5F5DC]', 'bg-[#808000]', 'bg-[#5C4033]'] },
  { name: 'Cool Ocean', colors: ['bg-[#000080]', 'bg-[#87CEEB]', 'bg-[#FFFFFF]', 'bg-[#2E8B57]'] },
  { name: 'Soft Pastels', colors: ['bg-[#E6E6FA]', 'bg-[#FFC0CB]', 'bg-[#F5FFFA]', 'bg-[#FFFFE0]'] },
  { name: 'Dark & Moody', colors: ['bg-[#36454F]', 'bg-[#301934]', 'bg-[#014421]', 'bg-[#000000]'] },
  { name: 'Bright & Bold', colors: ['bg-[#FFA500]', 'bg-[#0000FF]', 'bg-[#FF69B4]', 'bg-[#FFFF00]'] },
  { name: 'Neutral Minimal', colors: ['bg-[#FFFFFF]', 'bg-[#D3D3D3]', 'bg-[#F5F5DC]', 'bg-[#000000]'] },
];

const PRIORITIES = [
  'Perfect study space', 'Cozy sleep zone', 'Social hangout spot', 'All of the above'
];

const VibeQuiz: React.FC = () => {
  const navigate = useNavigate();
  const setQuizData = useStore((state) => state.setQuizData);
  const [formData, setFormData] = useState({
    interests: [] as string[],
    colorPalette: '',
    budget: 200,
    isInternational: false,
    country: '',
    priority: '',
  });

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
    if (formData.interests.length === 0 || !formData.colorPalette || !formData.priority) {
      alert('Please fill out all sections!');
      return;
    }
    setQuizData(formData);
    navigate('/loading');
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

      {/* Interests Section */}
      <section className="h-screen snap-start flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-8">What are you into?</h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
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
      </section>

      {/* Color Vibe Section */}
      <section className="h-screen snap-start flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-8">Pick your color vibe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.name}
              onClick={() => setFormData({ ...formData, colorPalette: palette.name })}
              className={`p-4 rounded-2xl border transition-all duration-300 group ${
                formData.colorPalette === palette.name
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'
              }`}
            >
              <div className="flex gap-2 mb-3">
                {palette.colors.map((color, idx) => (
                  <div key={idx} className={`w-full h-8 rounded-md ${color}`} />
                ))}
              </div>
              <span className={`font-medium ${formData.colorPalette === palette.name ? 'text-teal-400' : 'text-zinc-400'}`}>
                {palette.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Budget & Student Status Section */}
      <section className="h-screen snap-start flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <div className="w-full space-y-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">What's your budget?</h2>
            <div className="px-4">
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between mt-4 text-zinc-500 font-medium">
                <span>$50</span>
                <span className="text-teal-400 text-xl font-bold">${formData.budget}</span>
                <span>$500</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold">Are you an international student?</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setFormData({ ...formData, isInternational: true })}
                className={`px-8 py-4 rounded-xl border transition-all ${
                  formData.isInternational ? 'bg-teal-500 border-teal-500 text-black' : 'border-zinc-800 text-zinc-400'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setFormData({ ...formData, isInternational: false, country: '' })}
                className={`px-8 py-4 rounded-xl border transition-all ${
                  !formData.isInternational ? 'bg-teal-500 border-teal-500 text-black' : 'border-zinc-800 text-zinc-400'
                }`}
              >
                No
              </button>
            </div>
            {formData.isInternational && (
              <motion.input
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                type="text"
                placeholder="Where are you coming from?"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 mt-4 focus:outline-none focus:border-teal-500"
              />
            )}
          </div>
        </div>
      </section>

      {/* Priority & Final Submit */}
      <section className="h-screen snap-start flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-12">What matters most?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mb-16">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => setFormData({ ...formData, priority: p })}
              className={`p-6 rounded-2xl border transition-all text-left text-lg ${
                formData.priority === p
                  ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="bg-teal-500 text-black font-black text-xl px-12 py-6 rounded-2xl flex items-center gap-3 shadow-[0_0_40px_rgba(45,212,191,0.3)] hover:shadow-[0_0_60px_rgba(45,212,191,0.5)] transition-all"
        >
          Generate My DormVibe <Sparkles className="w-6 h-6" />
        </motion.button>
      </section>
    </div>
  );
};

export default VibeQuiz;
