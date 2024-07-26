import React from 'react';
import { render } from '@testing-library/react';
import RenderLogo from './RenderLogo';

describe('RenderLogo', () => {
   test('should return null when team is not provided', () => {
    const team = { logo: '', team_name: 'sdgdfg' };
   render(<RenderLogo team={team}  />);
    
  });
  test('should return null when team logo and team name are both empty strings', () => {
    const team = { logo: 'test_logo.png', team_name: '' };
     render(<RenderLogo team={team} />);
    
   
  });

})