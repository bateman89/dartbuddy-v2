import type { NextApiRequest, NextApiResponse } from 'next'

type Team = {
  id: number
  name: string
  score: number
}

type GameState = {
  teams: Team[]
  activeTeamId: number
  winner: Team | null
  history: Array<{
    teamId: number
    points: number
    newScore: number
    timestamp: string
  }>
}

// In-Memory Storage (für Demo-Zwecke)
let gameState: GameState = {
  teams: [
    { id: 1, name: 'Team 1', score: 501 },
    { id: 2, name: 'Team 2', score: 501 }
  ],
  activeTeamId: 1,
  winner: null,
  history: []
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameState | { message: string } | { error: string }>
) {
  const { method } = req

  // CORS Headers für lokale Entwicklung
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  switch (method) {
    case 'GET':
      // Aktuellen Spielstand abrufen
      return res.status(200).json(gameState)

    case 'POST':
      // Neuen Wurf hinzufügen
      try {
        const { teamId, points } = req.body

        if (!teamId || typeof points !== 'number') {
          return res.status(400).json({ error: 'TeamId and points are required' })
        }

        // Team finden und Score aktualisieren
        const teamIndex = gameState.teams.findIndex(team => team.id === teamId)
        if (teamIndex === -1) {
          return res.status(404).json({ error: 'Team not found' })
        }

        const team = gameState.teams[teamIndex]
        const newScore = Math.max(0, team.score - points)

        // Score aktualisieren
        gameState.teams[teamIndex] = { ...team, score: newScore }

        // History hinzufügen
        gameState.history.push({
          teamId,
          points,
          newScore,
          timestamp: new Date().toISOString()
        })

        // Gewinner prüfen
        if (newScore === 0) {
          gameState.winner = gameState.teams[teamIndex]
        }

        // Nächstes Team aktivieren (nur wenn kein Gewinner)
        if (!gameState.winner) {
          gameState.activeTeamId = gameState.activeTeamId === 1 ? 2 : 1
        }

        return res.status(200).json(gameState)
      } catch (error) {
        return res.status(500).json({ error: 'Internal server error' })
      }

    case 'PUT':
      // Spiel zurücksetzen
      gameState = {
        teams: [
          { id: 1, name: 'Team 1', score: 501 },
          { id: 2, name: 'Team 2', score: 501 }
        ],
        activeTeamId: 1,
        winner: null,
        history: []
      }
      return res.status(200).json(gameState)

    case 'DELETE':
      // Letzten Wurf rückgängig machen
      if (gameState.history.length > 0) {
        const lastMove = gameState.history.pop()!
        const teamIndex = gameState.teams.findIndex(team => team.id === lastMove.teamId)
        
        if (teamIndex !== -1) {
          // Score zurücksetzen
          gameState.teams[teamIndex].score += lastMove.points
          
          // Winner zurücksetzen falls nötig
          gameState.winner = null
          
          // Aktives Team zurücksetzen
          gameState.activeTeamId = lastMove.teamId
        }
      }
      return res.status(200).json(gameState)

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      return res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}