
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const NavBrand = () => {
  return (
    <Link to="/dashboard" className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-sm ring-1 ring-primary-950/10">
        <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className="font-display font-bold text-lg text-neutral-800 dark:text-neutral-100">
          PACT Platform
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Advanced MMP Management
        </span>
      </div>
    </Link>
  );
};

export default NavBrand;
