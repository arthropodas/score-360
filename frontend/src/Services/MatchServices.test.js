import { 
    matchFixture,
    deleteMatch,
    listMatches,
    getMatch,
    updateMatchSchedule,
    getMatchScore,
    getPlayingEleven,
    getMatchCurrentScore,
    matchToss
  } from "../Services/MatchServices";
  import MockAdapter from 'axios-mock-adapter';
  import axios from 'axios';


  
  // Mocking axiosPrivate module
  jest.mock('./CommonService/Interceptor', () => ({
    axiosPrivate: {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      put: jest.fn()
    }
  }));
  
  describe('Match Functions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('matchFixture should send a POST request with tournamentId', async () => {
      const tournamentId = 'tournament123';
      await matchFixture(tournamentId);
    
    });
  
    test('deleteMatch should send a PATCH request with matchId', async () => {
      const matchId = 'match456';
      await deleteMatch(matchId);
     
    });
  
    test('listMatches should send a GET request with tournamentId, sort, search, page, and pageSize', async () => {
      const tournamentId = 'tournament789';
      const sort = 'asc';
      const search = 'example';
      const page = 1;
      const pageSize = 10;
      await listMatches(tournamentId, sort, search, page, pageSize);
     
    });
  
    test('getMatch should send a GET request with matchId', async () => {
      const matchId = 'match101112';
      await getMatch(matchId);
    
    });
  
    test('updateMatchSchedule should send a PUT request with matchId and data', async () => {
      const matchId = '12';
      const data = { /* your data */ };
      await updateMatchSchedule(matchId, data);
     
    });

      test('should fetch match score successfully', async () => {
        // Arrange
        const mockAxios = new MockAdapter(axios);
        const matchId = 'your-match-id';
        const mockScoreData = { score: 'your-mock-score' };
        mockAxios.onGet('/match/get_match_score', { params: { matchId } }).reply(200, mockScoreData);
    
        // Act
        const response = await getMatchScore(matchId);
    
            });
    
      test('should handle errors when fetching match score', async () => {
        // Arrange
        const mockAxios = new MockAdapter(axios);
        const matchId = 'your-match-id';
        const errorMessage = 'Error message';
        mockAxios.onGet('/match/get_match_score', { params: { matchId } }).reply(500, { error: errorMessage });
    
        // Act and assert
    });
    it('should successfully update match toss', async () => {
      // Arrange
      const mockAxios = new MockAdapter(axios);
      const tossData = { matchId: 'your-match-id', teamId: 'your-team-id', choice: 'your-choice' };
      const mockResponseData = { message: 'Toss updated successfully' };
      mockAxios.onPatch('/match/toss', tossData).reply(200, mockResponseData);
  
      // Act
      const response = await matchToss(tossData);
  
    });
    it('should fetch playing eleven correctly', async () => {
      // Arrange
      const mockAxios = new MockAdapter(axios);
      const team1id = 'your-team1-id';
      const team2id = 'your-team2-id';
      const id = 'your-match-id';
      const responseData = { /* mocked response data */ };
      mockAxios.onGet('/match/getPlaying11').reply(200, responseData);
  
      // Act
      await getPlayingEleven(team1id, team2id, id);
  
     
    });
    it('should fetch current match score correctly', async () => {
      // Arrange
      const mockAxios = new MockAdapter(axios);
      const matchId = 'your-match-id';
      const responseData = { /* mocked response data */ };
      mockAxios.onGet('/score/match_score_data').reply(200, responseData);
  
      // Act
       await getMatchCurrentScore(matchId);
  
      
    });
   
  });
  