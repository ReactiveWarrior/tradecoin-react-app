import React, { FC } from 'react'
import { User } from '../../types/User';

type Props = {
  user: User,
}

const UserContainer: FC<Props> = ({ user }) => {
  const {
    name,
    coins,
  } = user;

  return (
    <div className='border-b-2 border-gray-900'>
      <h2 className='font-bold'>Welcome back {name}</h2>
      <ul className='flex justify-between gap-3 pb-2 relative overflow-x-auto'>
        {coins.map(coin => (
          <li key={coin.id} className='flex-shrink-0'>
            {coin.name}: {coin.coinAmount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserContainer;