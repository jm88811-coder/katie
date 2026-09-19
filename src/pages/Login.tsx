import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Field, Input } from '../components/ui';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function Login() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const err = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    if (mode === 'signup') {
      setInfo('가입 확인 이메일을 보냈습니다. 이메일 인증 후 로그인해주세요.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <p className="text-xl font-bold text-indigo-600">Katie</p>
        <p className="mb-6 mt-1 text-xs text-slate-400">1인 사업가 비즈니스 매니저</p>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
            Supabase 환경변수가 설정되지 않았습니다. 프로젝트 루트에 .env 파일을 만들고
            VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 값을 입력한 뒤 개발 서버를 재시작해주세요.
            (README 참고)
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Field label="이메일">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </Field>
          <Field label="비밀번호">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </Field>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {info && <p className="text-sm text-emerald-600">{info}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {mode === 'signin' ? '로그인' : '회원가입'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
            setError(null);
            setInfo(null);
          }}
          className="mt-4 w-full text-center text-xs text-slate-500 hover:text-indigo-600"
        >
          {mode === 'signin' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
        </button>
      </Card>
    </div>
  );
}
