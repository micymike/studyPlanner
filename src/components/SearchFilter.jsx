import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export default function SearchFilter({ items = [], onResults, placeholder = "Search..." }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [availableFilters, setAvailableFilters] = useState([]);
  
  // Detect available filters from items
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    // Get all possible filter keys from the first few items
    const sampleSize = Math.min(items.length, 10);
    const filterKeys = new Set();
    
    for (let i = 0; i < sampleSize; i++) {
      const item = items[i];
      Object.keys(item).forEach(key => {
        // Only add keys that have string or boolean values and aren't IDs
        if (
          (typeof item[key] === 'string' || typeof item[key] === 'boolean') && 
          !key.includes('id') && 
          !key.includes('_id') &&
          !key.includes('At') &&
          key !== 'description' &&
          key !== 'content'
        ) {
          filterKeys.add(key);
        }
      });
    }
    
    // For each filter key, get all possible values
    const newAvailableFilters = [];
    
    filterKeys.forEach(key => {
      const values = new Set();
      
      items.forEach(item => {
        if (item[key] !== undefined && item[key] !== null) {
          values.add(item[key].toString());
        }
      });
      
      if (values.size > 0 && values.size <= 10) {
        newAvailableFilters.push({
          key,
          values: Array.from(values)
        });
      }
    });
    
    setAvailableFilters(newAvailableFilters);
  }, [items]);
  
  // Filter and search items
  const filterItems = useCallback(() => {
    if (!items || items.length === 0) return [];
    
    let results = [...items];
    
    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(item => {
        return Object.values(item).some(value => {
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(lowerQuery);
        });
      });
    }
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        results = results.filter(item => {
          if (item[key] === undefined || item[key] === null) return false;
          return item[key].toString() === value;
        });
      }
    });
    
    return results;
  }, [items, query, filters]);
  
  // Update results when query or filters change
  useEffect(() => {
    if (onResults) {
      const filteredItems = filterItems();
      onResults(filteredItems);
    }
  }, [query, filters, items, onResults, filterItems]);
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };
  
  // Toggle a filter value
  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm"
          />
          {query && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setQuery('')}
              title="Clear search"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        
        {availableFilters.length > 0 && (
          <button
            className={`ml-2 p-2 rounded-md border ${
              Object.values(filters).some(v => v) 
                ? 'border-blue-500 text-blue-600' 
                : 'border-gray-300 text-gray-600'
            }`}
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        )}
        
        {Object.values(filters).some(v => v) && (
          <button
            className="ml-2 px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
            onClick={clearFilters}
            title="Clear all filters"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Filters Panel */}
      {showFilters && availableFilters.length > 0 && (
        <div className="p-3 border border-gray-200 rounded-md mb-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Filters</h3>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setShowFilters(false)}
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableFilters.map(filter => (
              <div key={filter.key} className="mb-2">
                <h4 className="text-xs font-medium mb-1 capitalize">
                  {filter.key.replace(/_/g, ' ')}
                </h4>
                <div className="space-y-1">
                  {filter.values.map(value => (
                    <label 
                      key={value} 
                      className="flex items-center text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters[filter.key] === value}
                        onChange={() => toggleFilter(filter.key, value)}
                        className="mr-2"
                      />
                      <span className="capitalize">{value.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
