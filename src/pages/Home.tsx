import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Home as HomeIcon, Users, ShoppingBag, Palette, Heart, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Design',
    description: 'Our AI creates personalized room vibes tailored to your style, interests, and budget.'
  },
  {
    icon: Palette,
    title: 'Curated Products',
    description: 'Get shopping recommendations from trusted brands that fit your dorm and budget perfectly.'
  },
  {
    icon: ShoppingBag,
    title: 'Campus Marketplace',
    description: 'Buy and sell with students on your campus. Save money, find deals, reduce waste.'
  },
  {
    icon: Heart,
    title: 'Sustainable Living',
    description: 'Freecycle items from graduating students. Eco-friendly and budget-friendly.'
  }
];

const STEPS = [
  { number: '01', title: 'Take the Quiz', description: 'Share your style preferences and budget' },
  { number: '02', title: 'Get Your Vibe', description: 'AI generates your personalized room design' },
  { number: '03', title: 'Shop & Customize', description: 'Buy essentials and customize your mood board' }
];

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, demoMode, user } = useStore();

  const handleStartDesign = () => {
    if (isLoggedIn || demoMode || user) {
      navigate('/quiz');
    } else {
      toast.info('Please sign in to generate your personalized dorm vibe');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">Dorm<span className="text-teal-400">Vibe</span></span>
          </div>
          <div className="flex items-center gap-6">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-4">
                <span className="text-zinc-300">Welcome, {user.name}</span>
                <button 
                  onClick={() => navigate('/quiz')}
                  className="px-5 py-2 bg-teal-500 text-black rounded-full font-bold hover:bg-teal-400 transition-colors"
                >
                  Go to Quiz
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-zinc-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleStartDesign}
                  className="px-5 py-2 bg-teal-500 text-black rounded-full font-bold hover:bg-teal-400 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium mb-6">
              🎓 AI-Powered Dorm Room Styling
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Design Your Perfect
              <br />
              <span className="text-teal-400">Dorm Vibe</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              Transform your dorm room into a space that reflects your unique personality. 
              AI-powered design recommendations tailored to your style, budget, and campus life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleStartDesign}
                className="px-8 py-4 bg-teal-500 text-black rounded-2xl font-bold text-lg hover:bg-teal-400 transition-all flex items-center gap-2"
              >
                Start Designing <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50K+', label: 'Students Served' },
            { value: '100+', label: 'Campus Partners' },
            { value: '4.8', label: 'Average Rating' },
            { value: '$2M+', label: 'Savings Generated' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">{stat.value}</div>
              <div className="text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Your Dorm
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              From AI-powered design to campus marketplace, we've got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-teal-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 text-lg">
              Get your dream dorm in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-teal-500/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-zinc-500">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Students
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "My dorm went from boring to amazing in just 10 minutes! The AI totally got my vibe.",
                author: "Sarah T.",
                school: "UCLA"
              },
              {
                quote: "Saved so much money by buying from other students on the marketplace. Everyone's so friendly!",
                author: "Mike L.",
                school: "NYU"
              },
              {
                quote: "Love that I could freecycle my old stuff instead of throwing it away. So sustainable!",
                author: "Emma K.",
                school: "Stanford"
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-teal-400 text-teal-400" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-4">"{testimonial.quote}"</p>
                <p className="text-teal-400 font-medium">{testimonial.author}</p>
                <p className="text-zinc-500 text-sm">{testimonial.school}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-teal-500/10 to-transparent border border-teal-500/20 rounded-3xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              Join thousands of students who designed their dream dorms
            </p>
            <button 
              onClick={handleStartDesign}
              className="px-8 py-4 bg-teal-500 text-black rounded-2xl font-bold text-lg hover:bg-teal-400 transition-all inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Dorm<span className="text-teal-400">Vibe</span></span>
          </div>
          <div className="flex items-center gap-6 text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-zinc-500">
            © 2025 DormVibe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}