import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team } from '../types/team';
import { teamApi } from '../services/api/teamApi';
import { TeamService } from '../services/teamService';

interface TeamContextType {
  currentTeam: Team | null;
  teams: Team[];
  loading: boolean;
  error: Error | null;
  setCurrentTeam: (team: Team) => Promise<void>;
  refreshTeams: () => Promise<void>;
  createTeam: (name: string) => Promise<Team>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshTeams = async () => {
    try {
      setLoading(true);
      const [currentTeamResponse, teamsResponse] = await Promise.all([
        teamApi.getCurrentTeam(),
        teamApi.listTeams(),
      ]);
      setCurrentTeamState(currentTeamResponse.data);
      setTeams(teamsResponse.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentTeam = async (team: Team) => {
    try {
      setCurrentTeamState(team);
      TeamService.getInstance().setCurrentTeam(team);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const createTeam = async (name: string) => {
    try {
      const response = await teamApi.createTeam(name);
      await refreshTeams();
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    refreshTeams();
  }, []);

  return (
    <TeamContext.Provider
      value={{
        currentTeam,
        teams,
        loading,
        error,
        setCurrentTeam,
        refreshTeams,
        createTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
