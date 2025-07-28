import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const performSearch = (query) => {
    setSearchQuery(query);
    // This will be implemented to search through photos data
  };

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      searchResults, 
      setSearchResults,
      performSearch 
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
} 