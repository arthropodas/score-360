import React from "react";
import TournamentCard from "./TournamentCard";
import { render } from "@testing-library/react";
const mockNavigate=jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: ()=>mockNavigate,
  }));

describe('render',()=>{
   test('render',()=>{
    render(<TournamentCard/>)
   })
})