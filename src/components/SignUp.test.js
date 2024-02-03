import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SignUp from './SignUp';

describe('SignUp Component', () => {
  test('renders Signup form with email, password, and confirm password fields', () => {
    const { getByLabelText, getByText } = render(<SignUp />);
    
   
    const emailInput = getByLabelText('Email');
    expect(emailInput).toBeInTheDocument();
    

    const passwordInput = getByLabelText('Password');
    expect(passwordInput).toBeInTheDocument();
    

    const confirmPasswordInput = getByLabelText('Confirm Password');
    expect(confirmPasswordInput).toBeInTheDocument();
    
    const signupButton = getByText('Signup');
    expect(signupButton).toBeInTheDocument();
  });

  test('allows user to switch between Signup and Login modes', async () => {
    const { getByText } = render(<SignUp />);
  

    await waitFor(() => {

      const switchButtonText = getByText(/(Create new account|Login with existing account)/);
      expect(switchButtonText).toBeInTheDocument();
    });


    const switchButtonText = getByText('Login with existing account');
    expect(switchButtonText).toBeInTheDocument();
  });

 
});
