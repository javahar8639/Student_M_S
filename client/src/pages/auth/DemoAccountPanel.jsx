import { useState } from 'react';
import { CopyIcon, CheckCircleIcon } from '../../components/icons.jsx';

const DEMO_EMAIL = 'javaharreddy20@gmail.com';
const DEMO_PASSWORD = 'edutrack123';

export default function DemoAccountPanel({ onUseDemo }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = `Email: ${DEMO_EMAIL}\nPassword: ${DEMO_PASSWORD}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API may be unavailable; fail silently and just fill the form.
    }
    setCopied(true);
    onUseDemo?.(DEMO_EMAIL, DEMO_PASSWORD);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-accent/20 bg-accent-light/60 p-4">
      <div className="flex items-center justify-between">
        <span className="badge-accent">Demo Account</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-DEFAULT px-2.5 py-1.5 text-xs font-medium text-accent-dark transition-colors hover:bg-white/60"
        >
          {copied ? <CheckCircleIcon width={14} height={14} /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy Credentials'}
        </button>
      </div>
      <dl className="mt-3 space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-ink-soft">Email</dt>
          <dd className="font-medium text-ink">{DEMO_EMAIL}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-ink-soft">Password</dt>
          <dd className="font-medium text-ink">{DEMO_PASSWORD}</dd>
        </div>
      </dl>
    </div>
  );
}
