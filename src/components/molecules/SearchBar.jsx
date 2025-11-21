import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search issues...", className }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        isFocused && "transform scale-105"
      )}>
        <ApperIcon 
          name="Search" 
          size={18} 
          className={cn(
            "absolute left-3 transition-colors duration-200",
            isFocused ? "text-blue-600" : "text-slate-400"
          )}
        />
        
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 bg-white border-slate-200 focus:border-blue-500 transition-all duration-200",
            isFocused && "shadow-lg"
          )}
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={16} />
          </motion.button>
        )}
      </div>

      {/* Search suggestions or recent searches could go here */}
      {isFocused && query.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
        >
          <div className="p-3 text-sm text-slate-500">
            Press Enter to search for "{query}"
          </div>
        </motion.div>
      )}
    </form>
  );
};

export default SearchBar;