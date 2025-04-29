import React from 'react';
import { Hexagon } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Hexagon className="w-8 h-8 text-pink-500 fill-pink-500/20" strokeWidth={1.5} />
      <span className="ml-2 text-white font-bold text-lg tracking-tight">QSwap</span>
    </div>
  );
};

export default Logo;