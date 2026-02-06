import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  type CurrencyCode,
  CURRENCIES,
  DEFAULT_CURRENCY,
} from "@/lib/types";

interface StepIncomeProps {
  onComplete: (amount: number, currency: CurrencyCode) => void;
  initialValue?: number;
  initialCurrency?: CurrencyCode;
}

export function StepIncome({
  onComplete,
  initialValue,
  initialCurrency,
}: StepIncomeProps) {
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(
    initialCurrency || DEFAULT_CURRENCY
  );
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currencyPickerRef = useRef<HTMLDivElement>(null);

  const currencyConfig = CURRENCIES[currency];

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue.toLocaleString());
    }
    inputRef.current?.focus();
  }, [initialValue]);

  // Close currency picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        currencyPickerRef.current &&
        !currencyPickerRef.current.contains(event.target as Node)
      ) {
        setShowCurrencyPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digits
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (!rawValue) {
      setValue("");
      return;
    }
    // Format with commas
    const numberValue = parseInt(rawValue, 10);
    setValue(numberValue.toLocaleString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanValue = parseInt(value.replace(/,/g, ""), 10);
    if (cleanValue > 0) {
      onComplete(cleanValue, currency);
    }
  };

  const handleCurrencySelect = (code: CurrencyCode) => {
    setCurrency(code);
    setShowCurrencyPicker(false);
    inputRef.current?.focus();
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg flex flex-col items-center gap-8"
      onSubmit={handleSubmit}
    >
      {/* Currency Selector */}
      <div className="relative" ref={currencyPickerRef}>
        <button
          type="button"
          onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-full transition-colors"
        >
          <span className="text-xl">{currencyConfig.flag}</span>
          <span className="text-white font-medium">{currencyConfig.code}</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              showCurrencyPicker ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {showCurrencyPicker && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2 max-h-64 overflow-y-auto">
                {Object.values(CURRENCIES).map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCurrencySelect(c.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      currency === c.code
                        ? "bg-teal-500/20 text-teal-400"
                        : "hover:bg-slate-700/50 text-white"
                    }`}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{c.code}</div>
                      <div className="text-xs text-slate-400">{c.name}</div>
                    </div>
                    <span className="text-slate-400">{c.symbol}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Income Input */}
      <div className="relative w-full flex items-center justify-center pixel-antialiased">
        <span className="text-4xl sm:text-6xl text-slate-600 font-extralight mr-4 shrink-0">
          {currencyConfig.symbol}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="0"
          className="w-auto bg-transparent border-none text-6xl sm:text-8xl font-bold text-white text-center focus:outline-none transition-all placeholder:text-slate-800 min-w-[100px]"
          style={{ width: `${value.length + 1}ch` }}
        />
      </div>

      <p className="text-slate-400 text-lg font-light text-center max-w-xs">
        This is just a baseline. We can refine it later.
      </p>

      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="group mt-4 flex items-center justify-center gap-3 px-10 py-4 bg-teal-500 text-white text-xl font-medium rounded-full shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] transition-all duration-300"
          >
            Continue
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
