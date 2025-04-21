"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, RefreshCw } from "lucide-react"

interface CurrencyConverterProps {
  countryCurrency?: {
    code: string
    name: string
    symbol: string
  }
}

interface ExchangeRate {
  code: string
  rate: number
  name: string
  symbol: string
}

export default function CurrencyConverter({ countryCurrency }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<number>(100)
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>(countryCurrency?.code || "EUR")
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [rates, setRates] = useState<ExchangeRate[]>([
    { code: "USD", rate: 1, name: "US Dollar", symbol: "$" },
    { code: "EUR", rate: 0.92, name: "Euro", symbol: "€" },
    { code: "GBP", rate: 0.79, name: "British Pound", symbol: "£" },
    { code: "JPY", rate: 150.14, name: "Japanese Yen", symbol: "¥" },
    { code: "AUD", rate: 1.52, name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", rate: 1.37, name: "Canadian Dollar", symbol: "C$" },
    { code: "CHF", rate: 0.9, name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", rate: 7.24, name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", rate: 83.12, name: "Indian Rupee", symbol: "₹" },
    { code: "BRL", rate: 5.05, name: "Brazilian Real", symbol: "R$" },
  ])

  // Add country currency if it exists and is not already in the list
  useEffect(() => {
    if (countryCurrency && !rates.some((r) => r.code === countryCurrency.code)) {
      // Generate a random exchange rate between 0.5 and 150
      const randomRate = Math.random() * 149.5 + 0.5
      setRates((prev) => [
        ...prev,
        {
          code: countryCurrency.code,
          rate: randomRate,
          name: countryCurrency.name,
          symbol: countryCurrency.symbol,
        },
      ])
    }
  }, [countryCurrency, rates])

  // Set initial "to" currency to country currency if available
  useEffect(() => {
    if (countryCurrency?.code) {
      setToCurrency(countryCurrency.code)
    }
  }, [countryCurrency])

  // Calculate conversion
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const fromRate = rates.find((r) => r.code === fromCurrency)?.rate || 1
      const toRate = rates.find((r) => r.code === toCurrency)?.rate || 1

      const convertedAmount = (amount / fromRate) * toRate
      setResult(convertedAmount)
    }
  }, [amount, fromCurrency, toCurrency, rates])

  // Simulate refreshing rates
  const refreshRates = () => {
    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Update rates with small random variations
      const updatedRates = rates.map((rate) => ({
        ...rate,
        rate: rate.rate * (0.98 + Math.random() * 0.04), // +/- 2% variation
      }))

      setRates(updatedRates)
      setLoading(false)
    }, 1000)
  }

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Get currency symbol
  const getCurrencySymbol = (code: string) => {
    return rates.find((r) => r.code === code)?.symbol || code
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Currency Converter</h3>
        <button
          onClick={refreshRates}
          disabled={loading}
          className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          title="Refresh rates"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Amount input */}
        <div>
          <label htmlFor="amount" className="block text-sm text-white/70 mb-1">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0"
            step="any"
            className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
          />
        </div>

        {/* Currency selectors */}
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="from-currency" className="block text-sm text-white/70 mb-1">
              From
            </label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white appearance-none"
            >
              {rates.map((currency) => (
                <option key={`from-${currency.code}`} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-6">
            <button
              onClick={swapCurrencies}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1">
            <label htmlFor="to-currency" className="block text-sm text-white/70 mb-1">
              To
            </label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white appearance-none"
            >
              {rates.map((currency) => (
                <option key={`to-${currency.code}`} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-sm text-white/70 mb-1">Converted Amount</div>
            <div className="flex justify-between items-center">
              <div className="text-white font-medium">
                {getCurrencySymbol(fromCurrency)} {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-white/50">=</div>
              <div className="text-white font-bold">
                {getCurrencySymbol(toCurrency)} {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-xs text-white/50 mt-2 text-right">
              1 {fromCurrency} ={" "}
              {(rates.find((r) => r.code === toCurrency)?.rate || 0) /
                (rates.find((r) => r.code === fromCurrency)?.rate || 1)}{" "}
              {toCurrency}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
