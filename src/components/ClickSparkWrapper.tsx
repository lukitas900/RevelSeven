'use client';

import ClickSpark from '@/components/ClickSpark';
import { ReactNode } from 'react';

export default function ClickSparkWrapper({ children }: { children: ReactNode }) {
  return (
    <ClickSpark
      sparkColor="#50098b"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
      easing="ease-out"
      extraScale={1.2}
    >
      {children}
    </ClickSpark>
  );
}
