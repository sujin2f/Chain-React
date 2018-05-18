import Home from 'app/scenes/public/screens/Home';
import About from 'app/scenes/public/screens/About';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/about',
    component: About,
    exact: true,
  },
];
