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
  gameHistory: Array<{teamId: number, points: number, newScore: number, darts?: number}>
  className?: string
}

export default function CompactTeamCard({ 
  team, 
  isActive, 
  onNameChange, 
  stats, 
  gameHistory,
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

      {/* Score-Anzeige und Historie nebeneinander */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Linke Seite: Score-Anzeige */}
        <div className="text-center bg-black/30 rounded-lg py-4">
          <div className="text-6xl font-black text-white mb-1 leading-none tracking-tight drop-shadow-lg">
            {team.score}
          </div>
          <div className="text-white text-xs font-semibold">
            Punkte verbleibend
          </div>
        </div>

        {/* Rechte Seite: Statistiken und Historie vertikal */}
        <div className="space-y-2 flex flex-col">
          {/* Kompakte Statistiken oben */}
          {stats.totalThrows > 0 && (
            <div className="bg-black/30 rounded-lg p-2 border border-gray-600">
              <div className="grid grid-cols-3 gap-1 text-center">
                <div>
                  <div className="font-black text-blue-300 text-sm">{stats.totalDarts}</div>
                  <div className="text-white text-xs font-semibold">Darts</div>
                </div>
                <div>
                  <div className="font-black text-green-300 text-sm">{stats.totalPoints}</div>
                  <div className="text-white text-xs font-semibold">Punkte</div>
                </div>
                <div>
                  <div className="font-black text-yellow-300 text-sm">{stats.average}</div>
                  <div className="text-white text-xs font-semibold">AVG</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Wurf-Historie unten */}
          <div className="bg-black/30 rounded-lg p-3 border border-gray-600 flex-1">
            <h5 className="text-white text-xs font-semibold mb-2 text-center">Letzte Würfe</h5>
            <div className="space-y-1">
              {gameHistory.filter(entry => entry.teamId === team.id).length > 0 ? (
                gameHistory.filter(entry => entry.teamId === team.id).slice(-8).map((entry, index) => (
                  <div key={index} className="text-gray-300 text-xs bg-black/20 rounded p-1 text-center">
                    <span className="font-bold text-blue-200">{entry.points}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-xs text-center italic py-2">
                  Noch keine Würfe
                </div>
              )}
            </div>
          </div>
        </div>
      </div>








    </div>
  )
}