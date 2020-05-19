import React , { useEffect, useState } from 'react';
import './App.css';
import CurrencyFlow from './CurrencyFlow';

const baseURL = 'https://api.exchangeratesapi.io/latest';


function App() {
  
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount 

  if (amountInFromCurrency){
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  
  useEffect(() => {
    fetch(baseURL)
    .then(res => res.json() )
    .then(data => {
      const FirstCurrency = Object.keys(data.rates)[0]
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(FirstCurrency)
      setExchangeRate(data.rates[FirstCurrency])
    })
  }, [])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`${baseURL}?base=${fromCurrency}&symbols=${toCurrency}`)
       .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
    
  }, [fromCurrency, toCurrency])

  return (
    <div>
      <h1>Convert</h1>
      <CurrencyFlow 
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value) }
        onChangeAmount = {handleFromAmountChange}
        amount = {fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyFlow 
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value) }
        onChangeAmount = {handleToAmountChange}
        amount = {toAmount}
      />
    </div>
  );
}

export default App;
