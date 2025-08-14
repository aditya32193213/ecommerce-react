import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders the main footer element', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders company logo', () => {
    expect(screen.getByTestId('footer-logo')).toBeInTheDocument();
  });

  it('renders social media icons', () => {
    expect(screen.getByTestId('footer-social-icons').children.length).toBeGreaterThanOrEqual(3);
  });

  it('renders quick links section', () => {
    expect(screen.getByTestId('footer-quick-links')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    expect(screen.getByTestId('footer-contact-info')).toBeInTheDocument();
    expect(screen.getByText(/support@shopnetic\.com/i)).toBeInTheDocument();
  });

  it('renders payment method icons', () => {
    expect(screen.getByTestId('footer-payment-icons').children.length).toBeGreaterThanOrEqual(4);
  });

  it('renders newsletter form with input and button', () => {
    expect(screen.getByTestId('footer-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('footer-subscribe-button')).toBeInTheDocument();
  });

  it('renders footer bottom copyright', () => {
    expect(screen.getByTestId('footer-bottom')).toHaveTextContent(
      `© ${new Date().getFullYear()} Shopnetic. All rights reserved.`
    );
  });
});
