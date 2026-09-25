import React, { useState } from 'react';
import { X, Lock, Shield, User, CheckCircle2, AlertCircle, Key, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  setCurrentTab: (tab: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  setCurrentTab
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [loginInput, setLoginInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('Даниил Мапола');
  const [groupInput, setGroupInput] = useState<string>('302 группа, Лечебный факультет');
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedLogin = loginInput.trim();
    const trimmedPassword = passwordInput.trim();

    if (authMode === 'login') {
      // Admin Check: login === 'admin123' && password === 'magaadmin'
      if (trimmedLogin === 'admin123' && trimmedPassword === 'magaadmin') {
        const adminUser: UserProfile = {
          id: 'admin-maga',
          name: 'Администратор (magaadmin)',
          email: 'admin123@med-materials.ru',
          universityGroup: 'Администрация платформы',
          role: 'admin',
          purchasedMaterialIds: ['mat-1', 'mat-2', 'mat-3', 'mat-4', 'mat-5', 'mat-6', 'mat-7']
        };

        setSuccessMessage('Успешный вход! Вы вошли как Администратор.');
        onLoginSuccess(adminUser);
        
        setTimeout(() => {
          setCurrentTab('admin');
          onClose();
        }, 600);
        return;
      }

      // Check if trying to use admin login with wrong password
      if (trimmedLogin === 'admin123' && trimmedPassword !== 'magaadmin') {
        setErrorMessage('Неверный пароль.');
        return;
      }

      // Regular Student Login
      if (!trimmedLogin || !trimmedPassword) {
        setErrorMessage('Введите логин и пароль.');
        return;
      }

      const studentUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: trimmedLogin.includes('@') ? trimmedLogin.split('@')[0] : trimmedLogin,
        email: trimmedLogin.includes('@') ? trimmedLogin : `${trimmedLogin}@student.med.ru`,
        universityGroup: groupInput || 'Студент',
        role: 'student',
        purchasedMaterialIds: ['mat-1', 'mat-3', 'mat-5']
      };

      setSuccessMessage('Успешная авторизация!');
      onLoginSuccess(studentUser);
      setTimeout(() => {
        onClose();
      }, 500);

    } else {
      // Registration Mode
      if (!nameInput.trim() || !loginInput.trim() || !passwordInput.trim()) {
        setErrorMessage('Пожалуйста, заполните все обязательные поля.');
        return;
      }

      const newStudentUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: nameInput.trim(),
        email: loginInput.includes('@') ? loginInput.trim() : `${loginInput.trim()}@student.med.ru`,
        universityGroup: groupInput.trim() || 'Студент',
        role: 'student',
        purchasedMaterialIds: ['mat-1', 'mat-3']
      };

      setSuccessMessage('Регистрация успешно завершена!');
      onLoginSuccess(newStudentUser);
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] max-w-md w-full overflow-hidden text-[#1A1A1A] shadow-2xl">
        {/* Header */}
        <div className="bg-[#1A1A1A] text-[#EAE8E4] px-6 py-4 flex items-center justify-between border-b-2 border-[#1A1A1A]">
          <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold">
            <Lock className="w-4 h-4 text-[#F25C05]" />
            <span>Вход в систему</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#EAE8E4] hover:text-[#F25C05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 font-sans">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs uppercase font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 border transition-colors ${
                authMode === 'login'
                  ? 'bg-[#1A1A1A] text-[#EAE8E4] border-[#1A1A1A]'
                  : 'bg-transparent text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
              }}
              className={`py-2 border transition-colors ${
                authMode === 'register'
                  ? 'bg-[#1A1A1A] text-[#EAE8E4] border-[#1A1A1A]'
                  : 'bg-transparent text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {authMode === 'register' && (
              <div>
                <label className="block text-[#1A1A1A] mb-1 font-bold uppercase text-[11px]">
                  ФИО студента:
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-2.5 font-sans focus:outline-none focus:border-[#F25C05]"
                />
              </div>
            )}

            <div>
              <label className="block text-[#1A1A1A] mb-1 font-bold uppercase text-[11px]">
                E-mail:
              </label>
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="E-mail"
                className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-2.5 font-sans focus:outline-none focus:border-[#F25C05]"
              />
            </div>

            <div>
              <label className="block text-[#1A1A1A] mb-1 font-bold uppercase text-[11px]">
                Пароль:
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-2.5 font-sans focus:outline-none focus:border-[#F25C05]"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-[#1A1A1A] mb-1 font-bold uppercase text-[11px]">
                  Группа и факультет:
                </label>
                <input
                  type="text"
                  value={groupInput}
                  onChange={(e) => setGroupInput(e.target.value)}
                  placeholder="302 группа, Лечебный факультет"
                  className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-2.5 font-sans focus:outline-none focus:border-[#F25C05]"
                />
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-900 border border-red-700 text-[#EAE8E4] p-3 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 text-[#F25C05] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-900 border border-emerald-700 text-[#EAE8E4] p-3 text-xs flex items-center gap-2 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] font-mono text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>{authMode === 'login' ? 'Войти в аккаунт' : 'Зарегистрироваться'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
