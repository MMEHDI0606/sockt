'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SyncCredits({ currentBalance }: { currentBalance: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [initialBalance] = useState(currentBalance);
  
  useEffect(() => {
    const status = searchParams.get('status');
    const checkoutId = searchParams.get('checkout_id');
    
    if (status === 'success' && checkoutId) {
      if (currentBalance === initialBalance) {
        const interval = setInterval(() => {
          router.refresh();
        }, 2000);
        
        return () => clearInterval(interval);
      } else {
        // Balance has updated, clean up the URL
        router.replace('/dashboard');
      }
    }
  }, [searchParams, currentBalance, initialBalance, router]);

  if (searchParams.get('status') === 'success' && currentBalance === initialBalance) {
    return (
      <div className="mt-4 text-xs font-mono text-[var(--accent-btc)] animate-pulse uppercase tracking-wider">
        Verifying payment...
      </div>
    );
  }

  return null;
}
