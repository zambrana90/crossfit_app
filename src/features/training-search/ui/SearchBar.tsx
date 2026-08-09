'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { useTrainingFilters } from '@/features/training-search/model/use-training-filters';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Buscar entrenamientos…' }: SearchBarProps) {
  const { search, setSearch } = useTrainingFilters();
  const [value, setValue] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const isFirstRender = useRef(true);

  // Adjust state during render when the URL `q` changes externally
  // (back/forward, defaultSearch effect) — React's "adjusting state when a
  // prop changes" pattern, avoids a setState-in-effect cascade.
  if (search !== prevSearch) {
    setPrevSearch(search);
    setValue(search);
  }

  // Live search: debounce keystrokes, then sync to the URL `q` param.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (value.trim() !== search) {
        setSearch(value.trim());
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, search, setSearch]);

  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-primary-container"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-full border-white/10 bg-white/5 pl-11 font-brand-mono text-xs uppercase tracking-[0.08em] text-white backdrop-blur-md placeholder:text-on-surface-variant/50 focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container/50 focus-visible:ring-offset-0"
        aria-label="Buscar entrenamientos por ejercicio"
      />
    </div>
  );
}
