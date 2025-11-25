import { useState } from 'react'

interface Team {
  id: number
  name: string
  score: number
}

interface TeamStats {
  totalThrows: number
  totalDarts: number
  totalPoints: number
  average: number
}

interface TeamCardProps {
  team: Team
  isActive: boolean
  onNameChange: (newName: string) => void
  stats: TeamStats
}

export default function TeamCard({ team, isActive, onNameChange, stats }: TeamCardProps) {
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

  return (
    <div className={`team-card bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 transition-all ${
      isActive ? 'border-blue-400 active' : 'border-gray-600'
    }`}>
      {/* Team Name */}
      <div className="text-center mb-4">
        {isEditingName ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyPress}
            className="bg-gray-800 text-white px-3 py-1 rounded text-xl font-bold text-center border-none outline-none"
            autoFocus
            maxLength={20}
          />
        ) : (
          <h2 
            className="text-2xl font-bold text-white cursor-pointer hover:text-blue-300 transition-colors"
            onClick={() => setIsEditingName(true)}
            title="Klicken zum Bearbeiten"
          >
            {team.name}
          </h2>
        )}
        {isActive && (
          <div className="text-blue-400 text-sm font-semibold mt-1">
            Am Zug
          </div>
        )}
      </div>

      {/* Score Display */}
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-2">
          {team.score}
        </div>
        <div className="text-gray-300 text-sm">
          Punkte verbleibend
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((501 - team.score) / 501) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {Math.round(((501 - team.score) / 501) * 100)}% geschafft
        </div>
      </div>

      {/* Statistiken */}
      {stats.totalThrows > 0 && (
        <div className="mt-4 bg-black/20 rounded-lg p-3">
          <div className="text-center text-white text-sm">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="font-semibold text-blue-300">{stats.totalDarts}</div>
                <div className="text-gray-400">Darts</div>
              </div>
              <div>
                <div className="font-semibold text-green-300">{stats.totalPoints}</div>
                <div className="text-gray-400">Punkte</div>
              </div>
              <div>
                <div className="font-semibold text-yellow-300">{stats.average}</div>
                <div className="text-gray-400">⌀ Avg</div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}