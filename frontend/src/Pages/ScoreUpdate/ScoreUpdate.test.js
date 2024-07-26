import { fireEvent, render, screen,act, waitFor } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";
import { getPlayingEleven,getMatchCurrentScore } from "../../Services/MatchServices";
import AddScore from "./ScoreUpdate";
import { MemoryRouter} from "react-router-dom";
const KEY = "ArrowDown";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useParams: jest.fn(),
  }));
  jest.mock('../../Services/MatchServices', () => ({
   getPlayingEleven: jest.fn(),
   getMatchCurrentScore:jest.fn().mockImplementation(() => Promise.resolve())
   }));

   const mockData1 = { 
    data: {'battingTeamId': 37, 'bowlingTeamId': 36, 'teamTotal': 156, 'teamWickets': 7, 'teamOvers': 4.4, 'crr': 33.43, 'batterOneStats': {'runs': 85, 'fours': 12, 'sixes': 2, 'ballsFaced': 21, 'strikeRate': 404.76, 'name': 'Adsif Ray'}, 'batterTwoStats': {'runs': 0, 'fours': 0, 'sixes': 0, 'ballsFaced': 0, 'strikeRate': 0, 'name': 'Biljo Babu'}, 'currentOverStats': ['1', '1', '1', '1', '1WD', '1WD', '1WD', '1WD', '1WD', '1WD', '1WD', '1WD', '1WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '0WD', '2WD', '2WD', '2WD'], 'bowlerStats': {'balls': 4.4, 'wkts': 7, 'name': 'Ashwin T', 'runs': 85, 'eco': 18.21}, 'inningsNo': 2}
  };
  

const mockData={
    "teamOnePlayers": [
        {
            "id": 3,
            "email": "adarshvargheseaaa@gmail",
            "first_name": "asif",
            "last_name": "np",
            "phone_number": "9037704758",
            "bowling_style": "Left arm pace/seam bowling",
            "batting_style": "right",
            "player_id": "PL102byoYsDnqNQaZVMi4eqrxT"
        },
        {
            "id": 17,
            "email": "adarshvarghese2kss@gmail.com",
            "first_name": "asdfsdfsdfas",
            "last_name": "asdfsdfsda",
            "phone_number": "1212121212",
            "bowling_style": "Left arm pace/seam bowling",
            "batting_style": "right",
            "player_id": "PL10017"
        },
        {
            "id": 74,
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "1234567890",
            "bowling_style": "Fast",
            "batting_style": "Right-handed",
            "player_id": "PL001"
        },
        {
            "id": 75,
            "email": "jane@example.com",
            "first_name": "Jane",
            "last_name": "Smith",
            "phone_number": "0987654321",
            "bowling_style": "Spin",
            "batting_style": "Left-handed",
            "player_id": "PL002"
        },
        {
            "id": 78,
            "email": "david@example.com",
            "first_name": "David",
            "last_name": "Wilson",
            "phone_number": "1357924680",
            "bowling_style": "Spin",
            "batting_style": "Right-handed",
            "player_id": "PL005"
        },
        {
            "id": 77,
            "email": "emily@example.com",
            "first_name": "Emily",
            "last_name": "Brown",
            "phone_number": "0123456789",
            "bowling_style": "Fast",
            "batting_style": "Left-handed",
            "player_id": "PL004"
        },
        {
            "id": 79,
            "email": "sarah@example.com",
            "first_name": "Sarah",
            "last_name": "Miller",
            "phone_number": "2468013579",
            "bowling_style": "Medium",
            "batting_style": "Left-handed",
            "player_id": "PL006"
        },
        {
            "id": 80,
            "email": "alex@example.com",
            "first_name": "Alex",
            "last_name": "Martinez",
            "phone_number": "9870123456",
            "bowling_style": "Fast",
            "batting_style": "Right-handed",
            "player_id": "PL007"
        },
        {
            "id": 81,
            "email": "sophia@example.com",
            "first_name": "Sophia",
            "last_name": "Garcia",
            "phone_number": "0129876543",
            "bowling_style": "Spin",
            "batting_style": "Left-handed",
            "player_id": "PL008"
        },
        {
            "id": 83,
            "email": "olivia@example.com",
            "first_name": "Olivia",
            "last_name": "Lopez",
            "phone_number": "4561237890",
            "bowling_style": "Fast",
            "batting_style": "Left-handed",
            "player_id": "PL010"
        },
        {
            "id": 84,
            "email": "william@example.com",
            "first_name": "William",
            "last_name": "Hernandez",
            "phone_number": "9876541230",
            "bowling_style": "Spin",
            "batting_style": "Right-handed",
            "player_id": "PL011"
        },
        {
            "id": 85,
            "email": "ava@example.com",
            "first_name": "Ava",
            "last_name": "Gonzalez",
            "phone_number": "0123459876",
            "bowling_style": "Medium",
            "batting_style": "Left-handed",
            "player_id": "PL012"
        },
        {
            "id": 86,
            "email": "james@example.com",
            "first_name": "James",
            "last_name": "Perez",
            "phone_number": "9876543210",
            "bowling_style": "Fast",
            "batting_style": "Right-handed",
            "player_id": "PL013"
        },
        {
            "id": 87,
            "email": "mia@example.com",
            "first_name": "Mia",
            "last_name": "Torres",
            "phone_number": "0123456789",
            "bowling_style": "Spin",
            "batting_style": "Left-handed",
            "player_id": "PL014"
        }
    ],
    "teamTwoPlayers": [
        {
            "id": 4,
            "email": "demoptb456@gmail.com",
            "first_name": "ddddddddddddddddddddddddddaaaaaaaaaaaammmmmmmmmooooooo",
            "last_name": "pp",
            "phone_number": "9846113132",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL10aBsWtf2kKLikmWQaiQrEPk"
        },
        {
            "id": 5,
            "email": "ukNownzz@gmail.com",
            "first_name": "Adarsh",
            "last_name": "varghese",
            "phone_number": "9037704758",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL105TVe9Dby7xGZQeCcx7WnhN"
        },
        {
            "id": 6,
            "email": "adarshvarghese2k@gmail.in",
            "first_name": "asdfsfd",
            "last_name": "asdfdf",
            "phone_number": "1212121212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL1006"
        },
        {
            "id": 7,
            "email": "adarshvarghese+2k@gmail.com",
            "first_name": "sdf",
            "last_name": "asdfasdf",
            "phone_number": "1212121212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL1007"
        },
        {
            "id": 8,
            "email": "adarshvar+ghese2k@gmail.com",
            "first_name": "sdf",
            "last_name": "asdfasdf",
            "phone_number": "1212121212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL1008"
        },
        {
            "id": 9,
            "email": "adarshvarghes+e2k@gmail.com",
            "first_name": "safsfdas",
            "last_name": "Reynolds",
            "phone_number": "9090909094",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL1009"
        },
        {
            "id": 10,
            "email": "yadotik521@sentrau.com",
            "first_name": "akash",
            "last_name": "hs",
            "phone_number": "1212121212",
            "bowling_style": "Left arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL10010"
        },
        {
            "id": 12,
            "email": "adarshvarghese3k@gmail.com",
            "first_name": "asdfsfd",
            "last_name": "asdfdf",
            "phone_number": "1212113212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "right",
            "player_id": "PL10012"
        },
        {
            "id": 13,
            "email": "ukNownzzz@gmail.com",
            "first_name": "asdfsfd",
            "last_name": "asdfdf",
            "phone_number": "1212113212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "right",
            "player_id": "PL10013"
        },
        {
            "id": 16,
            "email": "san@gmail.com",
            "first_name": "asdfsadf",
            "last_name": "asdfsdf",
            "phone_number": "1212121212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL10016"
        },
        {
            "id": 31,
            "email": "asdfsdf@gmail.com",
            "first_name": "assd",
            "last_name": "sdafsf",
            "phone_number": "1212121212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL10031"
        },
        {
            "id": 32,
            "email": "asdfsfdf@gmail.com",
            "first_name": "assd",
            "last_name": "sdafsf",
            "phone_number": "1212121212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL10032"
        },
        {
            "id": 33,
            "email": "asdfsfdsf@gmail.com",
            "first_name": "assd",
            "last_name": "sdafsf asdf d",
            "phone_number": "1212121212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "left",
            "player_id": "PL10033"
        },
        {
            "id": 43,
            "email": "teqovoke@citmo.net",
            "first_name": "asdf",
            "last_name": "asdf",
            "phone_number": "1212121212",
            "bowling_style": "Right arm pace/seam bowling",
            "batting_style": "right",
            "player_id": "PL10043"
        },
        {
            "id": 73,
            "email": "adarshvargheseaaa@gmail.com",
            "first_name": "adarsh",
            "last_name": "asdf",
            "phone_number": "1212121212",
            "bowling_style": "Left-arm spin bowling",
            "batting_style": "right",
            "player_id": "PL10073"
        }
    ],
    "toss_winner": 150,
    "toss_decision": 1
}
describe("render ",()=>{
    const mockWebSocket = {
        onopen: jest.fn(),
        onmessage: jest.fn(),
        replace:jest.fn()
      };

    test('renders with correct params', () => {

        const mockParams = { id: '123' };
        const { useLocation, useParams } = require('react-router-dom');
        const handleRunClickMock = jest.fn();
        useParams.mockReturnValue(mockParams);
        getMatchCurrentScore.mockResolvedValueOnce(mockData1)
    
        const mockLocation = {
            state: {
              team1: { id: 150 , team_name:"TEAMEE"},
              team2: { id: 151 , team_name:"TEAMW2222" },
            },
          };
         
          useLocation.mockReturnValue(mockLocation);

        render(
          <MemoryRouter >
              <AddScore />
          </MemoryRouter>)


const cbox=screen.getAllByRole('checkbox')
expect(cbox.length).toBe(5)
fireEvent.click(cbox[2])
const zeroButton = screen.getByTestId("zero");
        const oneButton = screen.getByTestId("one");
        const twoButton = screen.getByTestId("two");
        const threeButton = screen.getByTestId("three");
        const fourButton = screen.getByTestId("four");
        const fiveButton = screen.getByTestId("five");
        const sixButton = screen.getByTestId("six");
        const widebox = screen.getByTestId("wide");
        const addPlayers= screen.getByTestId("add-players")
    
        
            fireEvent.click(zeroButton);
            fireEvent.click(oneButton);
            fireEvent.click(twoButton)
            fireEvent.click(threeButton)
            fireEvent.click(fourButton)
            fireEvent.click(fiveButton)
            fireEvent.click(sixButton)
            fireEvent.click(widebox)
            fireEvent.click(addPlayers)

            const submitAddplayers=screen.getByTestId("Cancel-players")
            fireEvent.click(submitAddplayers)
      const b1=screen.getByTestId("change-bowler-button")
        fireEvent.click(b1)
        const b2=screen.getByTestId("error-code-button")
        fireEvent.click(b2)


      })


      test('renders with correct params', async() => {
        const mockParams = { id: '123' };
        const { useLocation, useParams } = require('react-router-dom');
        const handleRunClickMock = jest.fn();
        useParams.mockReturnValue(mockParams);
        getPlayingEleven.mockResolvedValueOnce(mockData)
        getMatchCurrentScore.mockResolvedValueOnce(mockData1)

        global.WebSocket = jest.fn().mockImplementation(() => mockWebSocket);


      const mockScoreData = {
        teamTotal: "100",
      };
  

    
        const mockLocation = {
            state: {
             
              team1: { id: 33 ,team_name:"FFFFFhjkk"},
              team2: { id: 45, team_name:"fdgmRRQQQQQQQQQQDFVGRSDVGJBNBVGER" },
            },
          };
          // Set the return value of useLocation
          useLocation.mockReturnValue(mockLocation);

          const replaceMock = jest.fn().mockReturnValue({"errorCode":"9140","message":"Something went  wrong"});
      const jsonData = {
        replace: replaceMock,
      };
  
      jest.spyOn(JSON, 'parse').mockReturnValue(jsonData);
        render(
          <MemoryRouter >
              <AddScore />
          </MemoryRouter>)
            act(() => {
                mockWebSocket.onopen(); 
              });



              act(() => {
                mockWebSocket.onmessage({
                  data: JSON.stringify(mockScoreData), 
                });
              });


          expect(getPlayingEleven).toHaveBeenCalled()
          const cbox=screen.getAllByRole('checkbox')
          expect(cbox.length).toBe(5)
          fireEvent.click(cbox[1])
          const addButton = screen.getByText('Add players')
          fireEvent.click(addButton)
          const striker=screen.getByLabelText('Striker*')
          expect(striker).toBeInTheDocument()
          fireEvent.click(striker)
          fireEvent.keyDown(striker.firstChild, { key: KEY });
        //   await waitFor(()=>{
        //     expect(screen.findByText(/asif/i)).toBeInTheDocument()
        //   })
          const nonStriker=screen.getByLabelText('Non-striker*')
          expect(nonStriker).toBeInTheDocument()
          fireEvent.click(nonStriker)
          fireEvent.keyDown(nonStriker.firstChild, { key: KEY });
          const bowler=screen.getByLabelText('Bowler*')
          expect(striker).toBeInTheDocument()
          fireEvent.click(striker)
          fireEvent.keyDown(striker.firstChild, { key: KEY });
         
})

test('renders with correct params', async() => {
    const mockParams = { id: '123' };
    const { useLocation, useParams } = require('react-router-dom');
    const handleRunClickMock = jest.fn();
    useParams.mockReturnValue(mockParams);
    getPlayingEleven.mockResolvedValueOnce(mockData)

    const mockLocation = {
        state: {
         
          team1: { id: 33, team_name:"TeamERH" },
          team2: { id: 45, team_name:"Teamtrh" },
        },
      };
      // Set the return value of useLocation
      useLocation.mockReturnValue(mockLocation);
    render(
      <MemoryRouter >
          <AddScore />
      </MemoryRouter>)
     
  
      expect(getPlayingEleven).toHaveBeenCalled()

    const cbox=screen.getAllByRole('checkbox')
    expect(cbox.length).toBe(5)
    fireEvent.click(cbox[0])
    
})
test('renders with correct params', async() => {
    const mockParams = { id: '123' };
    const { useLocation, useParams } = require('react-router-dom');
    const handleRunClickMock = jest.fn();
    useParams.mockReturnValue(mockParams);
    getPlayingEleven.mockResolvedValueOnce(mockData)

    const mockLocation = {
        state: {
         
          team1: { id: 33, team_name:"TeamERH" },
          team2: { id: 45, team_name:"Teamtrh" },
        },
      };
      // Set the return value of useLocation
      useLocation.mockReturnValue(mockLocation);
    render(
      <MemoryRouter >
          <AddScore />
      </MemoryRouter>)
     
  
      expect(getPlayingEleven).toHaveBeenCalled()

    const cbox=screen.getAllByRole('checkbox')
    expect(cbox.length).toBe(5)
    fireEvent.click(cbox[4])
    const zeroButton = screen.getByTestId("zero");
    fireEvent.click(zeroButton)
await waitFor(()=>{
expect(screen.queryByLabelText(/Dismissal*/i)).toBeInTheDocument()

})    
fireEvent.click(screen.getByLabelText(/Dismissal*/i))
fireEvent.keyDown(screen.getByLabelText(/Dismissal*/i).firstChild, { key: KEY });
fireEvent.click(screen.getByText("Bowled"))
// fireEvent.click(screen.getByLabelText("confirm"))
})


test('renders with correct params', async() => {
    const mockParams = { id: '123' };
    const { useLocation, useParams } = require('react-router-dom');
    const handleRunClickMock = jest.fn();
    useParams.mockReturnValue(mockParams);
    getPlayingEleven.mockResolvedValueOnce(mockData)

    const mockLocation = {
        state: {
         
          team1: { id: 33, team_name:"TeamERH" },
          team2: { id: 45, team_name:"Teamtrh" },
        },
      };
      // Set the return value of useLocation
      useLocation.mockReturnValue(mockLocation);
    render(
      <MemoryRouter >
          <AddScore />
      </MemoryRouter>)
     
  
      expect(getPlayingEleven).toHaveBeenCalled()

    const cbox=screen.getAllByRole('checkbox')
    expect(cbox.length).toBe(5)
    fireEvent.click(cbox[4])
    const zeroButton = screen.getByTestId("zero");
    fireEvent.click(zeroButton)

// fireEvent.click(screen.getByLabelText("close")
// )
})

    })
  

