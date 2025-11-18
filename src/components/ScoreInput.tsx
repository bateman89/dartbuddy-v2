import { useState } from 'react'

interface ScoreInputProps {
  onScoreSubmit: (points: number) => void
  maxScore: number
}

export default function ScoreInput({ onScoreSubmit, maxScore }: ScoreInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const quickScoreButtons = [1, 5, 10, 15, 20, 25, 26, 30, 40, 45, 50, 60, 80, 100, 180]

  const handleSubmit = (points: number) => {
    if (points < 0 || points > 180) {
      setError('Punkte müssen zwischen 0 und 180 liegen')
      return
    }

    if (points > maxScore) {
      setError(`Nicht möglich! Team hat nur noch ${maxScore} Punkte`)
      return
    }

    // Bust-Check: Wenn Punkte das Team unter 0 bringen würden
    if (maxScore - points < 0) {
      setError('Bust! Zu viele Punkte - Wurf ungültig')
      return
    }

    setError('')
    setInputValue('')
    onScoreSubmit(points)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const points = parseInt(inputValue)
    if (isNaN(points)) {
      setError('Bitte eine gültige Zahl eingeben')
      return
    }
    handleSubmit(points)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (error) setError('')
  }

  return (
    <div className="space-y-6">
      {/* Manuelle Eingabe */}
      <div className="text-center">
        <form onSubmit={handleInputSubmit} className="space-y-4">
          <div>
            <label htmlFor="score-input" className="block text-white text-lg font-medium mb-2">
              Punkte eingeben:
            </label>
            <div className="flex justify-center gap-2">
              <input
                id="score-input"
                type="number"
                min="0"
                max="180"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="z.B. 60"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg text-xl text-center border border-gray-600 focus:border-blue-400 focus:outline-none w-32"
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Eingeben
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-3 p-3 bg-red-500 text-white rounded-lg font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Schnell-Buttons */}
      <div>
        <h4 className="text-white text-center text-lg font-medium mb-3">
          Häufige Werte:
        </h4>
        <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
          {quickScoreButtons.map(score => (
            <button
              key={score}
              onClick={() => handleSubmit(score)}
              disabled={score > maxScore}
              className={`py-2 px-1 rounded-lg font-semibold transition-all text-sm
                ${score > maxScore 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105'
                }`}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      {/* Spezielle Aktionen */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSubmit(0)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
        >
          Miss (0 Punkte)
        </button>
        <button
          onClick={() => handleSubmit(maxScore)}
          disabled={maxScore > 180}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors
            ${maxScore > 180 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
        >
          Finish ({maxScore})
        </button>
      </div>

      {/* Hilfetext */}
      <div className="text-center text-gray-400 text-sm">
        <p>Maximal mögliche Punkte: {Math.min(maxScore, 180)}</p>
        <p>Bei 0 Punkten: Team hat gewonnen!</p>
      </div>
    </div>
  )
}