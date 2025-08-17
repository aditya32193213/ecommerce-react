/**
 * ============================================================
 * File: Banner.test.jsx
 * Purpose: Unit tests for Banner component
 * ============================================================
 *
 * These tests validate the following:
 * - Renders the banner wrapper properly.
 * - Displays correct heading text.
 * - Displays promo badge with discount + promo code.
 * - Includes the BackButton component (mocked).
 *
 * ============================================================
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner from '../../components/sections/banner';

//  Mock BackButton since Banner imports it, but we only test Banner here
jest.mock('../../components/common/Backbutton', () => () => <div data-testid="mock-back-button" />);

describe('Banner Component', () => {
  //  Test: Wrapper render
  it('renders the banner wrapper', () => {
    render(<Banner />);
    const banner = screen.getByTestId('banner-wrapper');

    expect(banner).toBeInTheDocument(); //  Wrapper should render
  });

  //  Test: Heading text
  it('displays the correct heading', () => {
    render(<Banner />);
    const heading = screen.getByTestId('banner-heading');

    expect(heading).toHaveTextContent('Explore Trending Products!'); //  Heading text check
  });

  //  Test: Promo badge
  it('displays the promo badge with correct text', () => {
    render(<Banner />);
    const promo = screen.getByTestId('promo-badge');

    expect(promo).toHaveTextContent('50% Discount Sale!'); //  Discount text check
    expect(promo).toHaveTextContent('Promo Code:FLAT50'); //  Promo code text check
  });

  //  Test: BackButton inclusion
  it('includes the BackButton component', () => {
    render(<Banner />);
    const backBtn = screen.getByTestId('mock-back-button');

    expect(backBtn).toBeInTheDocument(); //  BackButton should be rendered inside Banner
  });
});