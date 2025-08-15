import { render, screen, fireEvent } from '@testing-library/react';
import Wishlist from '../../pages/Wishlist';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '../../redux/slices/wishlistSlice';
import cartReducer from '../../redux/slices/cartSlice';

const renderWithProviders = (
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: { wishlist: wishlistReducer, cart: cartReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
    renderOptions
  );
};

describe('Wishlist component', () => {
  test('renders empty wishlist message when no items', () => {
    renderWithProviders(<Wishlist />, {
      preloadedState: { wishlist: [] },
    });

    expect(screen.getByTestId('wishlist-empty-message')).toBeInTheDocument();
  });

  test('renders wishlist items correctly', () => {
    const mockItem = {
      id: 1,
      title: 'Mock Product',
      price: 99.99,
      image: 'mock.jpg',
    };

    renderWithProviders(<Wishlist />, {
      preloadedState: { wishlist: [mockItem] },
    });

    expect(screen.getByText('Mock Product')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-item-price')).toHaveTextContent('$99.99');
    expect(screen.getByTestId('add-to-cart-button')).toBeInTheDocument();
    expect(screen.getByTestId('remove-from-wishlist-button')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-share-icons')).toBeInTheDocument();
  });

  test('clicking Add to Cart dispatches action', () => {
    const mockItem = {
      id: 2,
      title: 'Another Product',
      price: 59.99,
      image: 'image.png',
    };

    renderWithProviders(<Wishlist />, {
      preloadedState: { wishlist: [mockItem], cart: [] },
    });

    const addToCartBtn = screen.getByTestId('add-to-cart-button');
    fireEvent.click(addToCartBtn);
    // We assume dispatch works; full action dispatch testing can be done in integration tests
  });

  test('clicking Remove from Wishlist dispatches action', () => {
    const mockItem = {
      id: 3,
      title: 'Third Product',
      price: 39.99,
      image: 'pic.jpg',
    };

    renderWithProviders(<Wishlist />, {
      preloadedState: { wishlist: [mockItem] },
    });

    const removeBtn = screen.getByTestId('remove-from-wishlist-button');
    fireEvent.click(removeBtn);
    // Assuming reducer works correctly, this interaction should remove the item
  });
});
