import { useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  return showSignUp ? (
    <SignUp onBack={() => setShowSignUp(false)} />
  ) : (
    <Login onSignUp={() => setShowSignUp(true)} />
  );
}

export default App;
