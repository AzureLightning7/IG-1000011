import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowLeft, Mail as MailIcon } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'china' | 'international'>('china');
  const [chinaType, setChinaType] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/quiz');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-3xl font-bold">Dorm<span className="text-teal-400">Vibe</span></span>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-zinc-500 text-center mb-8">Sign in to continue</p>

          <div className="flex bg-zinc-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => setLoginType('china')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                loginType === 'china' 
                  ? 'bg-zinc-700 text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              China
            </button>
            <button
              onClick={() => setLoginType('international')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                loginType === 'international' 
                  ? 'bg-zinc-700 text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              International
            </button>
          </div>

          {loginType === 'china' ? (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setChinaType('phone')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    chinaType === 'phone'
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                      : 'text-zinc-500 border border-zinc-800'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Phone
                </button>
                <button
                  onClick={() => setChinaType('email')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    chinaType === 'email'
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                      : 'text-zinc-500 border border-zinc-800'
                  }`}
                >
                  <MailIcon className="w-4 h-4" />
                  Email
                </button>
              </div>

              <div>
                <input
                  type={chinaType === 'phone' ? 'tel' : 'email'}
                  placeholder={chinaType === 'phone' ? 'Phone number' : 'Email address'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading || !identifier || !password}
                className="w-full py-3 bg-teal-500 text-black rounded-xl font-bold hover:bg-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="flex justify-between text-sm">
                <button className="text-teal-400 hover:text-teal-300">Forgot password?</button>
                <button className="text-teal-400 hover:text-teal-300">Register</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={handleLogin}
                className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button 
                onClick={handleLogin}
                className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-all flex items-center justify-center gap-3 border border-zinc-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                  <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                Continue with Microsoft
              </button>
            </div>
          )}
        </div>

        <p className="text-zinc-500 text-sm text-center mt-6">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/quiz')}
            className="text-teal-400 hover:text-teal-300"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
}