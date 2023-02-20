import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from 'app/hook';
import { ProductDetailCard } from 'components/productDetail/ProductDetailCard';
import { useProductDetail } from 'hooks';
import { Suspense } from 'react';
import { useParams } from 'react-router';

const ProductDetailPage = () => {
	const { productId } = useParams();
	useProductDetail(productId!);
	const productDetail = useAppSelector((state) => state.productDetailState.productDetail);
	return (
		<Suspense fallback={<CircularProgress />}>
			<ProductDetailCard product={productDetail!} />
		</Suspense>
	);
};

export default ProductDetailPage;
