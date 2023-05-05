import React, { FC, useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import CurrencyRow from '../CurrencyRow/CurrencyRow';
import { client } from '../../api/apiClient';
import { Coin } from '../../types/Coin';
import { User } from '../../types/User';
import UserContainer from '../UserContainer/UserContainer';

const ExchangeContainer: FC = () => {
  const [userData, setUserData] = useState<User | null>(() => {
    const localData = localStorage.getItem('userData');
    return localData ? JSON.parse(localData) : null;
  });
  const [currencyOptions, setCurrencyOptions] = useState<Coin[]>([]);
  const [fromCoin, setFromCoin] = useState('');
  const [toCoin, setToCoin] = useState('');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [amount, setAmount] = useState<number>(0);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount: number;
  let fromAmount: number;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount / exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount * exchangeRate;
  }

  useEffect(() => {
    const getUpdatedData = async () => {
      try {
        const currencyData = await client.get<Coin[]>(`?vs_currency=${fromCoin || 'btc'}&orders=market_cap_asc&per_page=5`)

        setCurrencyOptions(currencyData);

        if (!userData) {
          const userCoins = currencyData.map(coin => {
            if (coin.symbol === 'btc') {
              return {
                ...coin,
                coinAmount: 5,
              }
            }

            return {
              ...coin,
              coinAmount: 0,
            };
          })

          setUserData({
            id: "1",
            name: "User",
            email: "some@gmail.com",
            coins: [...userCoins],
          })
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message);
        }
      }
    };

    getUpdatedData();
  }, [fromCoin, toCoin]);

  useEffect(() => {
    if (toCoin) {
      const coinRate = currencyOptions.find(coin => coin.symbol === toCoin);

      coinRate && setExchangeRate(coinRate?.current_price);
    }
  }, [currencyOptions]);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  const tradeCoins = () => {
    if (!toAmount || !fromAmount) {
      toast.error("Please set how much coins would you like to trade!");
      return;
    }

    if (userData) {
      const coinToTrade = userData.coins.find(coin => coin.symbol === fromCoin);

      if (!coinToTrade || coinToTrade.coinAmount < fromAmount) {
        toast.error("You don't have that much coins!");
        return;
      }

      const updatedUserCoins = userData?.coins.map(coin => {
        if (coin.symbol === fromCoin) {
          return {
            ...coin,
            coinAmount: coin.coinAmount - fromAmount,
          }
        }

        if (coin.symbol === toCoin) {
          return {
            ...coin,
            coinAmount: coin.coinAmount + toAmount,
          }
        }

        return coin;
      })

      toast.success("Trade successfully complete!");
      setUserData({ ...userData, coins: updatedUserCoins });
    }
    setAmount(0);
  }

  const handleFromAmountChange = (amountValue: number) => {
    setAmount(amountValue)
    setAmountInFromCurrency(true)
  }

  const handleToAmountChange = (amountValue: number) => {
    setAmount(amountValue)
    setAmountInFromCurrency(false)
  }

  return (
    <div className='flex flex-col gap-3 bg-white p-10 rounded-md border-2 border-sky-700 w-full max-w-lg'>
      {userData && <UserContainer user={userData} />}
      <h1 className='text-lg font-bold'>Exchange Coins</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCoin}
        onChangeCurrency={setFromCoin}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className='self-center font-bold'> = </div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCoin}
        onChangeCurrency={setToCoin}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
      <button
        className='w-fit px-3 py-2 mt-3 rounded-md bg-sky-700 text-white font-bold hover:bg-sky-600'
        onClick={tradeCoins}
      >
        Trade
      </button>
    </div>
  )
}

export default ExchangeContainer