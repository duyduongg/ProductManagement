import { useAppDispatch } from 'app/hook';
import { requestFetchingProductDetail } from 'app/reducers/productDetailSlice';
import { useEffect } from 'react';

export const useFetchingProductDetail = (id: string) => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(requestFetchingProductDetail(id));
	}, [id, dispatch]);
};
