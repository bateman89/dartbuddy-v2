import { useState } from 'react'

interface NumberPadProps {
  onScoreSubmit: (points: number, darts?: number) => void
  maxScore: number
  className?: string
}

export default function NumberPad({ onScoreSubmit, maxScore, className = '' }: NumberPadProps) {
  const [currentValue, setCurrentValue] = useState('')
  const [dartsValue, setDartsValue] = useState('3')
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

  const handleSubmit = (points?: number, darts?: number) => {
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
    setDartsValue('3')
    const dartCount = darts || parseInt(dartsValue) || 3
    onScoreSubmit(finalPoints, dartCount)
  }

  return (
    <div className={`bg-gray-800/50 rounded-lg p-4 ${className}`}>
      {/* Main Layout: Left Quick Scores | Center NumPad | Right Quick Scores */}
      <div className="grid grid-cols-12 gap-4 items-start">
        
        {/* Linke Seite: Hohe Werte */}
        <div className="col-span-3 space-y-2">
          <div className="text-center text-white text-xs font-medium mb-2">
            Hohe Werte
          </div>
          {quickScores.high.map(score => (
            <button
              key={score}
              onClick={() => handleSubmit(score)}
              disabled={score > maxScore}
              className={`w-full py-4 px-2 rounded-lg font-black text-lg transition-all ${
                score > maxScore
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white active:bg-gray-500'
              }`}
            >
              {score}
            </button>
          ))}
          {quickScores.mid.map(score => (
            <button
              key={score}
              onClick={() => handleSubmit(score)}
              disabled={score > maxScore}
              className={`w-full py-4 px-2 rounded-lg font-black text-lg transition-all ${
                score > maxScore
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white active:bg-gray-500'
              }`}
            >
              {score}
            </button>
          ))}
        </div>

        {/* Mitte: Numpad */}
        <div className="col-span-6">
          {/* Spacer um NumPad auf gleiche Höhe zu bringen */}
          <div className="text-center text-white text-xs font-medium mb-2 opacity-0">
            Spacer
          </div>
          
          {/* Display */}
          <div className="mb-4">
            <div className="bg-black/30 rounded-lg p-4 text-center border border-gray-600">
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

          {/* Number Grid (1-9) */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="bg-gray-600 hover:bg-gray-500 border border-gray-500 text-white text-xl font-bold py-4 rounded-lg transition-colors active:bg-gray-400"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Bottom Row (Clear, 0, Backspace) */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-3 rounded-lg transition-colors border border-yellow-400"
            >
              C
            </button>
            
            <button
              onClick={() => handleNumberClick(0)}
              className="bg-gray-600 hover:bg-gray-500 border border-gray-500 text-white text-xl font-bold py-3 rounded-lg transition-colors active:bg-gray-400"
            >
              0
            </button>
            
            <button
              onClick={handleBackspace}
              className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-3 rounded-lg transition-colors border border-yellow-400"
            >
              ⌫
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={!currentValue || parseInt(currentValue) === 0}
            className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed border border-gray-500 text-white text-lg font-bold py-3 rounded-lg transition-colors"
          >
            Punkte eingeben
          </button>
        </div>

        {/* Rechte Seite: Singles + Special */}
        <div className="col-span-3 space-y-2">
          <div className="text-center text-white text-xs font-medium mb-2">
            Singles
          </div>
          {quickScores.singles.map(score => (
            <button
              key={score}
              onClick={() => handleSubmit(score)}
              disabled={score > maxScore}
              className={`w-full py-4 px-2 rounded-lg font-black text-lg transition-all ${
                score > maxScore
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white active:bg-gray-500'
              }`}
            >
              {score}
            </button>
          ))}
          
          {/* Special Buttons */}
          <button
            onClick={() => handleSubmit(0)}
            className="w-full bg-black/30 hover:bg-black/40 border border-gray-600 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
          >
            Miss (0)
          </button>
          <button
            onClick={() => handleSubmit(maxScore)}
            disabled={maxScore > 180}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
              maxScore > 180
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-600'
                : 'bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-400'
            }`}
          >
            Finish ({maxScore})
          </button>
        </div>
      </div>
    </div>
  )
}