interface GameControlsProps {
  onReset: () => void
  onClearHistory?: () => void
  hasHistory?: boolean
}

export default function GameControls({ onReset, onClearHistory, hasHistory = false }: GameControlsProps) {
  const handleReset = () => {
    if (confirm('Möchtest du wirklich ein neues Spiel starten? Der aktuelle Spielstand geht verloren.')) {
      onReset()
    }
  }

  const handleClearHistory = () => {
    if (confirm('Möchtest du wirklich die komplette Spielhistorie löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      onClearHistory?.()
    }
  }

  return (
    <div className="text-center">
      <div className="space-y-3">
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          🔄 Neues Spiel
        </button>
        
        {hasHistory && onClearHistory && (
          <div>
            <button
              onClick={handleClearHistory}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              🗑️ Historie löschen
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-400 text-sm">
        <p>Tipps:</p>
        <p>• Klicke auf Teamnamen zum Bearbeiten</p>
        <p>• Das aktive Team ist hervorgehoben</p>
        <p>• Bei 0 Punkten gewinnt das Team</p>
      </div>
    </div>
  )
}