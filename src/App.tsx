import React, { FC } from 'react';
import ExchangeContainer from './components/ExchangeContainer/ExchangeContainer';
import { Toaster } from 'react-hot-toast';

const App: FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-full px-10 flex justify-center items-center">
      <ExchangeContainer />
      <Toaster />
    </div>
  );
}

export default App;
