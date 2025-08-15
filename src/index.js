import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store'
import 'aos/dist/aos.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <Router>
      <App />
    </Router>
    </Provider>

);

