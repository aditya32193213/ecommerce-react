import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner from '../../components/sections/banner';

// 🧪 Mock BackButton since we only test Banner here
jest.mock('../../components/common/Backbutton', () => () => <div data-testid="mock-back-button" />);

describe('Banner Component', () => {
  it('renders the banner wrapper', () => {
    render(<Banner />);
    const banner = screen.getByTestId('banner-wrapper');
    expect(banner).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    render(<Banner />);
    const heading = screen.getByTestId('banner-heading');
    expect(heading).toHaveTextContent('Explore Trending Products!');
  });

  it('displays the promo badge with correct text', () => {
    render(<Banner />);
    const promo = screen.getByTestId('promo-badge');
    expect(promo).toHaveTextContent('50% Discount Sale!');
    expect(promo).toHaveTextContent('Promo Code:FLAT50');
  });

  it('includes the BackButton component', () => {
    render(<Banner />);
    const backBtn = screen.getByTestId('mock-back-button');
    expect(backBtn).toBeInTheDocument();
  });
});






