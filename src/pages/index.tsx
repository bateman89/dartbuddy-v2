import { useState, useEffect } from 'react'
import Head from 'next/head'
import TeamCard from '@/components/TeamCard'
import CompactTeamCard from '@/components/CompactTeamCard'
import ScoreInput from '@/components/ScoreInput'
import NumberPad from '@/components/NumberPad'
import GameControls from '@/components/GameControls'

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

interface GameResult {
  id: string
  date: string
  winner: Team
  teams: Team[]
  history: Array<{teamId: number, points: number, newScore: number, darts?: number}>
  duration: number
  stats: { [teamId: number]: TeamStats }
}

interface PersistentData {
  currentGame: {
    teams: Team[]
    activeTeamId: number
    gameHistory: Array<{teamId: number, points: number, newScore: number, darts?: number}>
    gameWinner: Team | null
  } | null
  gameResults: GameResult[]
  settings: {
    teamNames: string[]
  }
}

const STORAGE_KEY = 'dartbuddy-data'

// LocalStorage Hilfsfunktionen
const loadFromStorage = (): PersistentData => {
  if (typeof window === 'undefined') return getDefaultData()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Fehler beim Laden der gespeicherten Daten:', error)
  }
  
  return getDefaultData()
}

const saveToStorage = (data: PersistentData) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Fehler beim Speichern der Daten:', error)
  }
}

const getDefaultData = (): PersistentData => ({
  currentGame: null,
  gameResults: [],
  settings: {
    teamNames: ['Team 1', 'Team 2']
  }
})

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Team 1', score: 501 },
    { id: 2, name: 'Team 2', score: 501 }
  ])
  
  const [activeTeamId, setActiveTeamId] = useState<number>(1)
  const [gameWinner, setGameWinner] = useState<Team | null>(null)
  const [gameHistory, setGameHistory] = useState<Array<{teamId: number, points: number, newScore: number, darts?: number}>>([])  
  const [showDartModal, setShowDartModal] = useState<boolean>(false)
  const [finishingTeam, setFinishingTeam] = useState<Team | null>(null)
  const [finishPoints, setFinishPoints] = useState<number>(0)
  const [gameStartTime] = useState<number>(Date.now())
  const [gameResults, setGameResults] = useState<GameResult[]>([])

  // Daten beim Start laden
  useEffect(() => {
    const data = loadFromStorage()
    
    // Gespeicherte Spielergebnisse laden
    setGameResults(data.gameResults)
    
    // Gespeicherte Teamnamen laden
    if (data.settings.teamNames.length >= 2) {
      setTeams([
        { id: 1, name: data.settings.teamNames[0], score: 501 },
        { id: 2, name: data.settings.teamNames[1], score: 501 }
      ])
    }
    
    // Laufendes Spiel wiederherstellen (falls vorhanden)
    if (data.currentGame) {
      setTeams(data.currentGame.teams)
      setActiveTeamId(data.currentGame.activeTeamId)
      setGameHistory(data.currentGame.gameHistory)
      setGameWinner(data.currentGame.gameWinner)
    }
  }, [])

  // Aktuelles Spiel bei Änderungen speichern
  useEffect(() => {
    const data = loadFromStorage()
    data.currentGame = {
      teams,
      activeTeamId,
      gameHistory,
      gameWinner
    }
    data.settings.teamNames = teams.map(team => team.name)
    saveToStorage(data)
  }, [teams, activeTeamId, gameHistory, gameWinner])

  const updateTeamScore = (teamId: number, points: number, darts: number = 3) => {
    setTeams(prevTeams => {
      const newTeams = prevTeams.map(team => {
        if (team.id === teamId) {
          const newScore = Math.max(0, team.score - points)
          
          // Prüfe auf Gewinner
          if (newScore === 0) {
            setFinishingTeam(team)
            setFinishPoints(points)
            setShowDartModal(true)
            return { ...team, score: newScore }
          }
          
          // Füge zur Historie hinzu
          setGameHistory(prev => [...prev, { teamId, points, newScore, darts }])
          
          return { ...team, score: newScore }
        }
        return team
      })
      
      return newTeams
    })
    
    // Wechsle zum nächsten Team (nur wenn das Spiel noch läuft)
    if (!gameWinner) {
      setActiveTeamId(prevId => prevId === 1 ? 2 : 1)
    }
  }

  const handleDartSubmit = (darts: number) => {
    if (finishingTeam) {
      const finalHistory = [...gameHistory, { 
        teamId: finishingTeam.id, 
        points: finishPoints, 
        newScore: 0, 
        darts 
      }]
      
      setGameWinner(finishingTeam)
      setGameHistory(finalHistory)
      
      // Spiel als abgeschlossen speichern
      saveCompletedGame(finishingTeam, teams, finalHistory)
    }
    setShowDartModal(false)
    setFinishingTeam(null)
    setFinishPoints(0)
  }

  const saveCompletedGame = (winner: Team, finalTeams: Team[], finalHistory: Array<{teamId: number, points: number, newScore: number, darts?: number}>) => {
    const gameResult: GameResult = {
      id: `game-${Date.now()}`,
      date: new Date().toISOString(),
      winner,
      teams: finalTeams,
      history: finalHistory,
      duration: Date.now() - gameStartTime,
      stats: {
        1: calculateTeamStatsFromHistory(1, finalHistory),
        2: calculateTeamStatsFromHistory(2, finalHistory)
      }
    }
    
    const data = loadFromStorage()
    data.gameResults = [gameResult, ...data.gameResults.slice(0, 9)] // Behalte nur die letzten 10 Spiele
    data.currentGame = null // Aktuelles Spiel ist beendet
    saveToStorage(data)
    
    setGameResults(data.gameResults)
  }

  const calculateTeamStatsFromHistory = (teamId: number, history: Array<{teamId: number, points: number, newScore: number, darts?: number}>): TeamStats => {
    const teamThrows = history.filter(entry => entry.teamId === teamId)
    
    if (teamThrows.length === 0) {
      return { totalThrows: 0, totalDarts: 0, totalPoints: 0, average: 0 }
    }

    const totalPoints = teamThrows.reduce((sum, entry) => sum + entry.points, 0)
    const totalDarts = teamThrows.reduce((sum, entry) => sum + (entry.darts || 3), 0)
    const totalThrows = teamThrows.length
    const average = totalPoints / totalThrows

    return {
      totalThrows,
      totalDarts,
      totalPoints,
      average: Math.round(average * 100) / 100
    }
  }

  const calculateTeamStats = (teamId: number): TeamStats => {
    const teamThrows = gameHistory.filter(entry => entry.teamId === teamId)
    
    if (teamThrows.length === 0) {
      return { totalThrows: 0, totalDarts: 0, totalPoints: 0, average: 0 }
    }

    const totalPoints = teamThrows.reduce((sum, entry) => sum + entry.points, 0)
    const totalDarts = teamThrows.reduce((sum, entry) => sum + (entry.darts || 3), 0)
    const totalThrows = teamThrows.length
    const average = totalPoints / totalThrows

    return {
      totalThrows,
      totalDarts,
      totalPoints,
      average: Math.round(average * 100) / 100 // Runde auf 2 Dezimalstellen
    }
  }

  const switchActiveTeam = () => {
    if (!gameWinner) {
      setActiveTeamId(prevId => prevId === 1 ? 2 : 1)
    }
  }

  const undoLastThrow = () => {
    if (gameHistory.length === 0) return
    
    const lastThrow = gameHistory[gameHistory.length - 1]
    
    // Entferne den letzten Wurf aus der Historie
    setGameHistory(prev => prev.slice(0, -1))
    
    // Stelle den Score des Teams wieder her
    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === lastThrow.teamId) {
          return { ...team, score: team.score + lastThrow.points }
        }
        return team
      })
    )
    
    // Wechsle zurück zum Team das den korrigierten Wurf gemacht hat
    setActiveTeamId(lastThrow.teamId)
    
    // Falls das Spiel als beendet markiert war, setze es zurück
    if (gameWinner) {
      setGameWinner(null)
      setFinishingTeam(null)
      setShowDartModal(false)
    }
  }

  const resetGame = () => {
    const data = loadFromStorage()
    const savedTeamNames = data.settings.teamNames
    
    const newTeams = [
      { id: 1, name: savedTeamNames[0] || 'Team 1', score: 501 },
      { id: 2, name: savedTeamNames[1] || 'Team 2', score: 501 }
    ]
    
    setTeams(newTeams)
    setActiveTeamId(1)
    setGameWinner(null)
    setGameHistory([])
    setShowDartModal(false)
    setFinishingTeam(null)
    setFinishPoints(0)
    
    // Aktuelles Spiel aus LocalStorage entfernen
    data.currentGame = null
    saveToStorage(data)
  }

  const clearHistory = () => {
    const data = loadFromStorage()
    data.gameResults = []
    saveToStorage(data)
    setGameResults([])
  }

  const updateTeamName = (teamId: number, newName: string) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId ? { ...team, name: newName } : team
      )
    )
  }

  const activeTeam = teams.find(team => team.id === activeTeamId)

  return (
    <>
      <Head>
        <title>Dartkumpel - 501 Spiel Tracker</title>
        <meta name="description" content="Professional Dart 501 tournament tracker with large number pad for iPad tournaments" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dartkumpel" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        
        {/* Prevent zoom on input focus */}
        <meta name="format-detection" content="telephone=no" />
      </Head>
      
      <main className="min-h-screen dart-board px-2">
        <div className="w-full max-w-none">
          {/* Gewinner Anzeige */}
          {gameWinner && (
            <div className="bg-green-500 text-white p-6 rounded-lg mb-6 text-center">
              <h2 className="text-3xl font-bold mb-2">🎉 Gewonnen! 🎉</h2>
              <p className="text-xl mb-2">{gameWinner.name} hat das Spiel gewonnen!</p>
              {(() => {
                const finishEntry = gameHistory.find(entry => 
                  entry.teamId === gameWinner.id && entry.newScore === 0
                )
                return finishEntry?.darts && (
                  <p className="text-lg opacity-90">
                    🎯 Finish mit {finishEntry.darts} Dart{finishEntry.darts !== 1 ? 's' : ''} 
                    ({finishEntry.points} Punkte)
                  </p>
                )
              })()}
            </div>
          )}

          {/* Hauptlayout: Portrait vs Landscape */}
          <div className="landscape-layout">
            {/* Portrait Layout (Hochformat - wie bisher) */}
            <div className="block lg:hidden">
              {/* Teams Portrait */}
              <div className="grid gap-6 mb-8">
                {teams.map(team => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    isActive={team.id === activeTeamId && !gameWinner}
                    onNameChange={(newName) => updateTeamName(team.id, newName)}
                    stats={calculateTeamStats(team.id)}
                  />
                ))}
              </div>

              {/* Aktuelle Eingabe Portrait */}
              {!gameWinner && activeTeam && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                  <h3 className="text-white text-xl font-semibold mb-4 text-center">
                    {activeTeam.name} ist am Zug
                  </h3>
                  <ScoreInput
                    onScoreSubmit={(points, darts) => updateTeamScore(activeTeamId, points, darts)}
                    maxScore={activeTeam.score}
                  />
                </div>
              )}
            </div>

            {/* Landscape Layout (Querformat - neue Turnierversion) */}
            <div className="hidden lg:block min-h-screen flex flex-col">
              {/* Oberer Bereich: Team-Karten nebeneinander auf voller Breite */}
              <div className="grid grid-cols-2 gap-4 px-2 py-4 flex-shrink-0">
                {teams.map(team => (
                  <CompactTeamCard
                    key={team.id}
                    team={team}
                    isActive={team.id === activeTeamId && !gameWinner}
                    onNameChange={(newName) => updateTeamName(team.id, newName)}
                    stats={calculateTeamStats(team.id)}
                    gameHistory={gameHistory}
                    onUndo={gameHistory.length > 0 ? undoLastThrow : undefined}
                  />
                ))}
              </div>

              {/* Anwurf-Wechsel Button - nur vor dem ersten Wurf */}
              {!gameWinner && gameHistory.length === 0 && (
                <div className="px-2 pb-2">
                  <button
                    onClick={switchActiveTeam}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors border border-yellow-400"
                  >
                    Anwurf wechseln → {teams.find(t => t.id !== activeTeamId)?.name}
                  </button>
                </div>
              )}



              {/* Unterer Bereich: Vollflächige Punkteeingabe */}
              <div className="flex-1 px-2 pb-2">
                {!gameWinner && activeTeam ? (
                  <NumberPad
                    onScoreSubmit={(points, darts) => updateTeamScore(activeTeamId, points, darts)}
                    maxScore={activeTeam.score}
                    className="w-full"
                  />
                ) : (
                  <div className="w-full bg-gray-800/50 rounded-lg p-8 text-center">
                    <div className="text-gray-400 text-xl">
                      {gameWinner ? 'Spiel beendet' : 'Bereit zum Spielen'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spiel Kontrollen */}
          <GameControls 
            onReset={resetGame} 
            onClearHistory={clearHistory}
            hasHistory={gameResults.length > 0}
          />

          {/* Gesamtstatistiken bei Spielende */}
          {gameWinner && gameHistory.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-6">
              <h3 className="text-white text-xl font-semibold mb-4 text-center">
                📊 Spielstatistiken
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {teams.map(team => {
                  const stats = calculateTeamStats(team.id)
                  return (
                    <div key={team.id} className={`p-4 rounded-lg ${
                      team.id === gameWinner.id ? 'bg-green-500/20 border border-green-400' : 'bg-gray-500/20'
                    }`}>
                      <h4 className="text-white font-bold text-lg mb-3 text-center">
                        {team.name} {team.id === gameWinner.id && '👑'}
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="text-blue-300 text-xl font-bold">{stats.totalThrows}</div>
                          <div className="text-gray-300">Würfe gesamt</div>
                        </div>
                        <div>
                          <div className="text-green-300 text-xl font-bold">{stats.totalPoints}</div>
                          <div className="text-gray-300">Punkte gesamt</div>
                        </div>
                        <div>
                          <div className="text-yellow-300 text-xl font-bold">{stats.average}</div>
                          <div className="text-gray-300">⌀ Average</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}



          {/* Spielhistorie */}
          {gameResults.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mt-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                📚 Letzte Spiele
                <span className="text-sm text-gray-400 font-normal">({gameResults.length}/10)</span>
              </h3>
              <div className="space-y-3">
                {gameResults.slice(0, 5).map((game, index) => {
                  const gameDate = new Date(game.date)
                  const duration = Math.round(game.duration / 1000 / 60) // Minuten
                  return (
                    <div key={game.id} className="bg-black/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-semibold">
                            🏆 {game.winner.name} gewonnen
                          </div>
                          <div className="text-gray-400 text-xs">
                            {gameDate.toLocaleDateString('de-DE')} um {gameDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                            {duration > 0 && ` • ${duration} Min`}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          #{gameResults.length - index}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {game.teams.map(team => {
                          const stats = game.stats[team.id]
                          return (
                            <div key={team.id} className={`p-2 rounded ${
                              team.id === game.winner.id ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-500/20'
                            }`}>
                              <div className="text-white font-medium">
                                {team.name} {team.id === game.winner.id && '👑'}
                              </div>
                              <div className="text-gray-300 text-xs grid grid-cols-3 gap-1 mt-1">
                                <span>{stats?.totalThrows || 0} Würfe</span>
                                <span>{stats?.totalPoints || 0} Punkte</span>
                                <span>⌀ {stats?.average || 0}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
              {gameResults.length > 5 && (
                <div className="text-center mt-4">
                  <div className="text-gray-400 text-sm">
                    ... und {gameResults.length - 5} weitere Spiele
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dart Modal */}
          {showDartModal && finishingTeam && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  🎉 Glückwunsch {finishingTeam.name}!
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Du hast mit {finishPoints} Punkten gewonnen!
                  <br />
                  Wie viele Darts hast du für den letzten Wurf benötigt?
                </p>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1, 2, 3].map(dartCount => (
                    <button
                      key={dartCount}
                      onClick={() => handleDartSubmit(dartCount)}
                      className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-xl transition-colors"
                    >
                      {dartCount} Dart{dartCount !== 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handleDartSubmit(3)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Überspringen (3 Darts annehmen)
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}