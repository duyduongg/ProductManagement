import { Box, Card, CardContent, Rating, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from 'app/hook';
import { formatNumber } from 'helpers';
import { useProductDetail } from 'hooks';
import { useParams } from 'react-router';
import classes from './ProductDetailPage.module.scss';

const bull = (
	<Box component="span" sx={{ display: 'inline-block', mx: 1, transform: 'scale(1.2)' }}>
		•
	</Box>
);

const ProductDetailPage = () => {
	const { productId } = useParams();
	useProductDetail(productId!);
	const productDetail = useAppSelector((state) => state.productDetailState.productDetail);
	return (
		<Card className={classes.product_container}>
			{productDetail ? (
				<CardContent>
					<div className={classes['card-content']}>
						<img src="/icon.png" alt="lulu" loading="eager" className={classes['product-img']} />
						<div className={classes['product-content']}>
							<Typography sx={{ fontSize: 30, fontFamily: 'inherit' }} gutterBottom>
								{productDetail?.name}
							</Typography>
							<Typography sx={{ fontSize: 18, fontWeight: 800, fontFamily: 'inherit' }}>
								General information:
							</Typography>
							<Typography component="div">
								{bull}
								<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
									Brand:
								</Typography>
								<Typography component="span" sx={{ fontSize: 16, ml: 1 }}>
									{productDetail?.brand}
								</Typography>
							</Typography>
							<Typography component="div">
								{bull}
								<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
									Category:
								</Typography>
								<Typography component="span" sx={{ fontSize: 16, ml: 1 }}>
									{productDetail?.category}
								</Typography>
							</Typography>
							<Typography component="div">
								{bull}
								<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
									Warranty month:
								</Typography>
								<Typography component="span" sx={{ fontSize: 16, ml: 1 }}>
									{productDetail?.warrantyMonth} month(s)
								</Typography>
							</Typography>
							<Typography component="div">
								{bull}
								<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
									Rating:
								</Typography>
								<Rating value={productDetail?.rating} precision={0.5} readOnly disabled />
								<Typography component="span" sx={{ fontWeight: 600, fontSize: 16 }}>
									({formatNumber(productDetail?.numberRating!)})
								</Typography>
							</Typography>
							<Typography component="div">
								{bull}
								<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
									Price:
								</Typography>
								<Typography component="span" sx={{ fontWeight: 800, fontSize: 16, ml: 1, color: 'red' }}>
									{formatNumber(productDetail?.price)}₫
								</Typography>
							</Typography>
						</div>
					</div>
				</CardContent>
			) : (
				<CircularProgress />
			)}
		</Card>
	);
};

export default ProductDetailPage;
