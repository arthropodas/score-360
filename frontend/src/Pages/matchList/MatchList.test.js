import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import MatchList from "./MatchList";
import { matchFixture,listMatches,deleteMatch } from "../../Services/MatchServices";
import "@testing-library/jest-dom";

jest.mock("../../assets/vs.png", () => ({
  default: "vs.png",
}));
jest.mock("../../Services/MatchServices",()=>({
  matchFixture:jest.fn(),
  listMatches:jest.fn(),
  deleteMatch:jest.fn()
}))
describe('render list',()=>{
    const mockMatchData = {
        "results": [
          {
              "id": 15,
              "city": "fsdfsdf",
              "match_date": "2024-04-26",
              "match_time": "18:03:00",
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": 112,
              "created_at": "2024-04-17T11:30:04.745224Z",
              "updated_at": "2024-04-18T09:29:14.658229Z",
              "remarks": "",
              "opponent_one": 92,
              "opponent_two": 103,
              "ground": 4,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 16,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:05.039064Z",
              "updated_at": "2024-04-17T11:30:05.039110Z",
              "remarks": "",
              "opponent_one": 93,
              "opponent_two": 102,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 17,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:05.479331Z",
              "updated_at": "2024-04-18T10:56:33.249886Z",
              "remarks": "",
              "opponent_one": 94,
              "opponent_two": 101,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 18,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:05.612756Z",
              "updated_at": "2024-04-17T11:30:05.612778Z",
              "remarks": "",
              "opponent_one": 95,
              "opponent_two": 100,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 19,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:05.746636Z",
              "updated_at": "2024-04-17T11:30:05.746664Z",
              "remarks": "",
              "opponent_one": 96,
              "opponent_two": 99,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 20,
              "city": "asdf",
              "match_date": "2024-04-27",
              "match_time": "19:05:00",
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": 14,
              "created_at": "2024-04-17T11:30:05.871514Z",
              "updated_at": "2024-04-18T09:29:58.546584Z",
              "remarks": "",
              "opponent_one": 97,
              "opponent_two": 98,
              "ground": 10,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 21,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:06.013663Z",
              "updated_at": "2024-04-17T11:30:06.013689Z",
              "remarks": "",
              "opponent_one": 90,
              "opponent_two": 104,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 22,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:06.146891Z",
              "updated_at": "2024-04-17T11:30:06.146913Z",
              "remarks": "",
              "opponent_one": 91,
              "opponent_two": 102,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 23,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:06.263752Z",
              "updated_at": "2024-04-17T11:30:06.263773Z",
              "remarks": "",
              "opponent_one": 92,
              "opponent_two": 101,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 24,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:06.363920Z",
              "updated_at": "2024-04-17T11:30:06.363942Z",
              "remarks": "",
              "opponent_one": 93,
              "opponent_two": 100,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 25,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:06.539040Z",
              "updated_at": "2024-04-17T11:30:06.539062Z",
              "remarks": "",
              "opponent_one": 94,
              "opponent_two": 99,
              "ground": null,
              "winner": null,
              "tournament": 90
          },
          {
              "id": 26,
              "city": "",
              "match_date": null,
              "match_time": null,
              "result": "",
              "toss_winner": null,
              "toss_decision": null,
              "status": 1,
              "round": 1,
              "number_of_overs": null,
              "created_at": "2024-04-17T11:30:06.630925Z",
              "updated_at": "2024-04-17T11:30:06.630947Z",
              "remarks": "",
              "opponent_one": 95,
              "opponent_two": 98,
              "ground": null,
              "winner": null,
              "tournament": 90
          }
      ]
    }
test("render",()=>{
  
listMatches.mockResolvedValue(mockMatchData)
  render(<BrowserRouter><MatchList/></BrowserRouter>)
  waitFor(()=>{
    const genBtn=screen.getBylabel('generate')
    expect(genBtn).toBeInTheDocument()
    fireEvent.click(genBtn)
    expect(matchFixture).toHaveBeenCalled()
    const srch=screen.getBylabel('Search')
    expect(srch).toBeInTheDocument()
    fireEvent.input(srch, { target: { value: 'sdf' } })
    const searchBtn=screen.getBylabel(/search/i)
    fireEvent.click(searchBtn)
    expect(listMatches).toHaveBeenCalled()
    const loadmore=screen.getBylabel('loadmore')
    fireEvent.click(loadmore)

  })
})
test("Match list error ",()=>{
  
    listMatches.mockRejectedValueOnce("Error")
      render(<BrowserRouter><MatchList/></BrowserRouter>)
      waitFor(()=>{
        expect(listMatches).toHaveBeenCalled()
      })
    })
test("Test match fixture",()=>{
    const mockAddData = "Fixture success"
    matchFixture.mockResolvedValue(mockAddData)
    render(<MemoryRouter><MatchList/></MemoryRouter>)
    const genBtn=screen.getByTestId('generate')
    expect(genBtn).toBeInTheDocument()
    fireEvent.click(genBtn)
    expect(matchFixture).toHaveBeenCalled()
})
test("Test match fixture delete",()=>{
    const mockData = {
        status: 200,
        data: { message: "Password reset link sent successfully" },
      };
      
    deleteMatch.mockResolvedValue(mockData)
    render(<MemoryRouter><MatchList/></MemoryRouter>)
    const genBtn=screen.getByTestId('delete')
    expect(genBtn).toBeInTheDocument()
    fireEvent.click(genBtn)
    const genBtndelete=screen.getByTestId('deleteButton')
    fireEvent.click(genBtndelete)

})

test("Test match fixture delete- confirmation cancel",()=>{
  
    render(<MemoryRouter><MatchList/></MemoryRouter>)
    const genBtn=screen.getByTestId('delete')
    expect(genBtn).toBeInTheDocument()
    fireEvent.click(genBtn)
    const deleteConfirmationbutton=screen.getByTestId('cancelButton')
    fireEvent.click(deleteConfirmationbutton)
   
})


test("Test match fixture delete- failed",()=>{
    
    const mockError = new Error("Match delete faild");
    mockError.response = {
      data: { message: "Error message from server", errorCode: 4608 },
    };
    deleteMatch.mockRejectedValueOnce(mockError)
    render(<MemoryRouter><MatchList/></MemoryRouter>)
    const genBtn=screen.getByTestId('delete')
    expect(genBtn).toBeInTheDocument()
    fireEvent.click(genBtn)
    const genBtndelete=screen.getByTestId('deleteButton')
    fireEvent.click(genBtndelete)  

})

test("Test match fixture error",()=>{
    const mockError = new Error("Match delete faild.");
    mockError.response = {
      data: { message: "Error message from server.", errorCode: 4603 },
    };
    matchFixture.mockRejectedValueOnce(mockError)
    render(<MemoryRouter><MatchList/></MemoryRouter>)
    const genBtn=screen.getByTestId('generate')
    expect(genBtn).toBeInTheDocument()
    fireEvent.click(genBtn)
    expect(matchFixture).toHaveBeenCalled()
})

})
