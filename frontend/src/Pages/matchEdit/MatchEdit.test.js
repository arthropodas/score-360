import React from "react";
import MatchEdit from "./MatchEdit";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { getMatch, updateMatchSchedule } from "../../Services/MatchServices";
import "@testing-library/jest-dom";


jest.mock("../../Services/MatchServices",()=>({
    getMatch:jest.fn(),
    updateMatchSchedule:jest.fn()
}));
test('render',async()=>{
  const  mockMatchData={
        "id": 14,
        "city": "sdfasdfdfdf",
        "match_date": "2024-04-20",
        "match_time": "15:20:00",
        "result": "",
        "toss_winner": null,
        "toss_decision": null,
        "status": 3,
        "round": 1,
        "number_of_overs": 14,
        "created_at": "2024-04-17T11:30:04.583044Z",
        "updated_at": "2024-04-18T10:54:58.155529Z",
        "remarks": "",
        "opponent_one": 91,
        "opponent_two": 104,
        "ground": 2,
        "winner": null,
        "tournament": 90,
        "grounds": [
            "JLN",
            "JLk",
            "chinnaswami",
            "bhinnaswami",
            "chinnaswami",
            "chinnaswamii",
            "chinnaswamiiji",
            "chinna",
            "china",
            "japan",
            "japan1",
            "1japan1",
            "2japan2",
            "2japan3",
            "2japan3",
            "2zjapan3",
            "2zjapdan3",
            "2zjafpdan3"
        ]
    }
    render(<BrowserRouter><MatchEdit isOpen={true} matchId={14}/></BrowserRouter>)
act(()=>{
    getMatch.mockResolvedValue(mockMatchData)

})
    await   waitFor(()=>{
        expect(getMatch).toHaveBeenCalled();
      const  ground=screen.getByLabelText(/Ground/i)
      const overs=screen.getByLabelText(/Overs/i)
      const city = screen.getByLabelText(/City/i)
      const matchDate=screen.getByLabelText(/Match date/i)
      const MatchTime =screen.getByLabelText(/Match time/i)
    
   
    })
})

test('cancel',()=>{
    const setIsOpenMock = jest.fn();
    render(<BrowserRouter><MatchEdit isOpen={true} setIsOpen={setIsOpenMock}  matchId={14}/></BrowserRouter>)
    const cbtn=screen.getByTitle(/Cancel/)
act(()=>{
    fireEvent.click(cbtn)

})    
    })

    
