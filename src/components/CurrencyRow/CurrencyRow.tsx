import React, { FC } from 'react'
import { Coin } from '../../types/Coin';

type Props = {
  currencyOptions: Coin[],
  selectedCurrency: string,
  onChangeCurrency: (coin: string) => void,
  onChangeAmount: (amountValue: number) => void,
  amount: number,
}

const CurrencyRow: FC<Props> = ({
  currencyOptions,
  selectedCurrency,
  onChangeCurrency,
  onChangeAmount,
  amount,
}) => {

  return (
    <div className='flex gap-3'>
      <input
        type="number"
        min={0}
        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
        value={amount}
        onChange={(event) => onChangeAmount(+event.target.value)}
      />
      <select
        value={selectedCurrency}
        onChange={(event) => onChangeCurrency(event.target.value)}
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
      >
        <option disabled value='' selected>Choose Coin</option>
        {currencyOptions.map(option => (
          <option key={option.id} value={option.symbol}>{option.symbol.toLocaleUpperCase()}</option>
        ))}
      </select>
    </div>
  )
}

export default CurrencyRow;