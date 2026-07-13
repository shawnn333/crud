import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/redux/store';

test('renders the main task app interface', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(await screen.findByText(/TaskFlow/i)).toBeInTheDocument();
});
