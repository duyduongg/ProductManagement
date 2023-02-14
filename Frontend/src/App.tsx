import loadable from '@loadable/component';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { authActions } from 'app/reducers/authSlice';
import { pageRoutes } from 'constants/apiRoutes';
import { ErrorPage } from 'pages/error/ErrorPage';
import { Fragment, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Header } from './components/header/Header';
const ProductsPage = loadable(() => import('./pages/products/ProductsPage'));
const ProductDetailPage = loadable(() => import('./pages/productDetail/ProductDetailPage'));

function App() {
	const isLoggedIn = useAppSelector((state) => state.authState.isAuthenticated);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (!isLoggedIn) {
			dispatch(authActions.requestSignin());
		} else {
			navigate(`/${pageRoutes.PRODUCT}`);
		}
	}, [isLoggedIn]);
	return (
		<Fragment>
			<Header></Header>
			<Routes>
				<Route path="/" />
				<Route path="/products">
					<Route index element={<ProductsPage />} />
					<Route path=":productId" element={<ProductDetailPage />} />
				</Route>
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</Fragment>
	);
}

export default App;
