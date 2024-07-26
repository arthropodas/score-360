import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import MyBreadcrumbs from './breadcrumbs';


describe('MyBreadcrumbs component', () => {
    test('renders correct breadcrumbs for different locations', () => {
         render(
            <MemoryRouter >
                
                    <MyBreadcrumbs  />
                
            </MemoryRouter>
        )
       
    });
    
});
