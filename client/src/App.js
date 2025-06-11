import { useState } from 'react';
import './App.css';

function App() {
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceAmount: Number(amount) }),
      });

      const data = await response.json();
      setResult(data.flagged ? 'Potential Fraud' : 'Looks Good');
    } catch (err) {
      setResult('⚠️ Error checking invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Fraud Checker</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Invoice Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Submit'}
        </button>
      </form>

      {result && <div className="result">{result}</div>}
    </div>
  );
}

export default App;
