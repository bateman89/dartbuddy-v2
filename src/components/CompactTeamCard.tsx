import { useState } from 'react'

interface Team {
  id: number
  name: string
  score: number
}

interface TeamStats {
  totalThrows: number
  totalPoints: number
  average: number
}

interface CompactTeamCardProps {
  team: Team
  isActive: boolean
  onNameChange: (newName: string) => void
  stats: TeamStats
  className?: string
}

export default function CompactTeamCard({ 
  team, 
  isActive, 
  onNameChange, 
  stats, 
  className = '' 
}: CompactTeamCardProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(team.name)

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onNameChange(tempName.trim())
    }
    setIsEditingName(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit()
    } else if (e.key === 'Escape') {
      setTempName(team.name)
      setIsEditingName(false)
    }
  }

  // Berechne Fortschritt
  const progress = ((501 - team.score) / 501) * 100

  return (
    <div className={`bg-white/15 backdrop-blur-sm rounded-xl p-6 border-4 transition-all shadow-xl ${
      isActive ? 'border-yellow-400 bg-yellow-500/10 shadow-yellow-500/30 shadow-2xl' : 'border-gray-500'
    } ${className}`}>
      
      {/* Team Name */}
      <div className="text-center mb-3">
        {isEditingName ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyPress}
            className="bg-gray-800 text-white px-3 py-2 rounded text-2xl font-bold text-center border-none outline-none w-full"
            autoFocus
            maxLength={20}
          />
        ) : (
          <h2 
            className="text-3xl font-black text-white cursor-pointer hover:text-blue-300 transition-colors drop-shadow-lg"
            onClick={() => setIsEditingName(true)}
            title="Klicken zum Bearbeiten"
          >
            {team.name}
          </h2>
        )}

      </div>

      {/* Riesige Score-Anzeige für Turnier-Sichtbarkeit */}
      <div className="text-center mb-4 bg-black/30 rounded-lg py-6">
        <div className="text-8xl font-black text-white mb-2 leading-none tracking-tight drop-shadow-lg">
          {team.score}
        </div>
        <div className="text-white text-sm font-semibold">
          Punkte verbleibend
        </div>
      </div>

      {/* Status Indicators - Größer und auffälliger */}
      <div className="mb-4">
        {team.score === 0 && (
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg text-lg font-black text-center animate-pulse shadow-lg">
            🎉 GEWONNEN! 🎉
          </div>
        )}
        {team.score === 1 && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg text-lg font-black text-center shadow-lg animate-pulse">
            ⚠️ BUST MÖGLICH! ⚠️
          </div>
        )}
        {team.score <= 50 && team.score > 1 && (
          <div className="bg-yellow-500 text-black px-4 py-3 rounded-lg text-lg font-black text-center shadow-lg">
            🔥 FINISH-BEREICH! 🔥
          </div>
        )}
      </div>

      {/* Progress Bar - Größer und auffälliger */}
      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-4 shadow-inner">
          <div 
            className={`h-4 rounded-full transition-all duration-500 shadow-lg ${
              progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
              progress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-white font-semibold mt-2 text-center">
          {Math.round(progress)}% geschafft
        </div>
      </div>

      {/* Kompakte Statistiken - Besser lesbar */}
      {stats.totalThrows > 0 && (
        <div className="bg-black/30 rounded-lg p-3 border border-gray-600">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-black text-blue-300 text-lg">{stats.totalThrows}</div>
              <div className="text-white text-xs font-semibold">Würfe</div>
            </div>
            <div>
              <div className="font-black text-green-300 text-lg">{stats.totalPoints}</div>
              <div className="text-white text-xs font-semibold">Punkte</div>
            </div>
            <div>
              <div className="font-black text-yellow-300 text-lg">{stats.average}</div>
              <div className="text-white text-xs font-semibold">AVG</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}