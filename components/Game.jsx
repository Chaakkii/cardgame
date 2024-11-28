import { useState} from 'react';
import '../src/App.css';

function Game() {
  const [userName, setUserName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [cardImage, setCardImage] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (userName.trim() === '') {
      setError('Syötä nimi ennen peliä!');
      return;
    }
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        const data = await response.json();
        setError(data.message); 
        return;
      }
      setIsRegistered(true);
    } catch (error) {
      console.error('Virhe käyttäjänimen tarkistuksessa:', error);
      setError('Virhe käyttäjänimen tarkistuksessa');
    }
  };
  
  const handleGuess = async (guessChoice) => {
    setGuess(guessChoice);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: guessChoice }),
        credentials: 'include',
      });
  
      const data = await response.json();
      setCardImage(data.cardImage);
      setMessage(data.result ? 'Oikein! Hienoa!' : 'Väärin, yritä uudelleen.');
      setScore(data.totalScore);
  
    } catch (error) {
      console.error('Virhe kortin arpomisen yhteydessä:', error);
      setError('Virhe kortin arpomisen yhteydessä');
    }
  };
  
  const handleEndGame = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/endgame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, score }),
        credentials: 'include',
      });
      const data = await response.json();
  
      if (response.ok) {
        alert('Lopetit pelin, pisteet tallennettu. Kiitos pelaamisesta!');
        setScore(0);
        setIsRegistered(false);
        setUserName('');
        window.location.reload();
      } else {
        setError(data.message || 'Virhe pisteiden tallennuksessa');
      }
    } catch (error) {
      console.error('Virhe pisteiden tallentamisessa:', error);
      setError('Virhe pisteiden tallentamisessa');
    }
  };

  if (!isRegistered) {
    return (
      <div>
        <h2>Syötä käyttäjänimi</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Käyttäjänimi"
        />
        <button onClick={handleRegister}>Aloita peli</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
      </div>
    );
  }

  return (
    <div>
      <h2>Suuri, pieni vai seiska?</h2>
      <div>
        <button onClick={() => handleGuess('high')}>Suuri</button>
        <button onClick={() => handleGuess('seven')}>Seiska</button>
        <button onClick={() => handleGuess('low')}>Pieni</button>
      </div>

      {cardImage && (
        <div>
          {cardImage && <img src={cardImage} alt="Card" style={{ width: '200px', height: 'auto' }} />}
        </div>
      )}

      <div>
        {message && <p>{message}</p>}
      </div>

      <div>
        <h3>Pisteet: {score}</h3>
        <button onClick={handleEndGame}>Lopeta peli</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
      </div>
    </div>
  );
}

export default Game;
