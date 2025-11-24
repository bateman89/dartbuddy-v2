import { useState } from 'react'

interface NumberPadProps {
  onScoreSubmit: (points: number) => void
  maxScore: number
  className?: string
}

export default function NumberPad({ onScoreSubmit, maxScore, className = '' }: NumberPadProps) {
  const [currentValue, setCurrentValue] = useState('')
  const [error, setError] = useState('')

  // Große Nummern-Buttons 0-9
  const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

  // Dart-Werte nach Kategorien
  const quickScores = {
    high: [180, 140, 100, 60],
    mid: [45, 41, 26],
    singles: [20, 19, 18, 17, 16]
  }

  const handleNumberClick = (num: number) => {
    const newValue = currentValue + num.toString()
    if (parseInt(newValue) <= 180) {
      setCurrentValue(newValue)
      setError('')
    }
  }

  const handleClear = () => {
    setCurrentValue('')
    setError('')
  }

  const handleBackspace = () => {
    setCurrentValue(prev => prev.slice(0, -1))
    setError('')
  }

  const handleSubmit = (points?: number) => {
    const finalPoints = points !== undefined ? points : parseInt(currentValue)
    
    if (isNaN(finalPoints) || finalPoints < 0) {
      setError('Ungültige Eingabe')
      return
    }

    if (finalPoints > 180) {
      setError('Maximum 180 Punkte möglich')
      return
    }

    if (finalPoints > maxScore) {
      setError(`Nur noch ${maxScore} Punkte übrig`)
      return
    }

    setError('')
    setCurrentValue('')
    onScoreSubmit(finalPoints)
  }

  return (
    <div className={`bg-gray-800/50 rounded-lg p-6 ${className}`}>
      {/* Display */}
      <div className="mb-4">
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {currentValue || '0'}
          </div>
          <div className="text-sm text-gray-400">
            Max: {maxScore} Punkte
          </div>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-500 text-white rounded-lg text-center font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Nummer-Pad */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 rounded-lg transition-colors active:bg-blue-800"
          >
            {num}
          </button>
        ))}
        
        {/* Unterste Reihe */}
        <button
          onClick={handleClear}
          className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-4 rounded-lg transition-colors"
        >
          C
        </button>
        
        <button
          onClick={() => handleNumberClick(0)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 rounded-lg transition-colors active:bg-blue-800"
        >
          0
        </button>
        
        <button
          onClick={handleBackspace}
          className="bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold py-4 rounded-lg transition-colors"
        >
          ⌫
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={() => handleSubmit()}
        disabled={!currentValue || parseInt(currentValue) === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold py-4 rounded-lg transition-colors mb-4"
      >
        Punkte eingeben
      </button>

      {/* Quick Score Buttons */}
      <div>
        <div className="text-center text-white text-sm font-medium mb-3">
          Häufige Werte:
        </div>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {quickScores.high.map(score => (
            <button
              key={score}
              onClick={() => handleSubmit(score)}
              disabled={score > maxScore}
              className={`py-5 px-2 rounded-lg font-black text-xl transition-all ${
                score > maxScore
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white active:bg-gray-500'
              }`}
            >
              {score}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {quickScores.mid.map(score => (
            <button
              key={score}
              onClick={() => handleSubmit(score)}
              disabled={score > maxScore}
              className={`py-5 px-2 rounded-lg font-black text-xl transition-all ${
                score > maxScore
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white active:bg-gray-500'
              }`}
            >
              {score}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {quickScores.singles.map(score => (
            <button
              key={score}
              onClick={() => handleSubmit(score)}
              disabled={score > maxScore}
              className={`py-5 px-2 rounded-lg font-black text-xl transition-all ${
                score > maxScore
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white active:bg-gray-500'
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      {/* Special Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => handleSubmit(0)}
          className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
        >
          Miss (0)
        </button>
        <button
          onClick={() => handleSubmit(maxScore)}
          disabled={maxScore > 180}
          className={`py-3 rounded-lg font-semibold ${
            maxScore > 180
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
          }`}
        >
          Finish ({maxScore})
        </button>
      </div>
    </div>
  )
}