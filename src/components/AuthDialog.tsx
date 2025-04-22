import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup';
}

export const AuthDialog = ({ isOpen, onClose, initialTab = 'signin' }: AuthDialogProps) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Check your email for the confirmation link!",
          variant: "success"
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Successfully signed in!",
          variant: "success"
        });
        onClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'signin' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'signup' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}; 