import { Box, Card, CardContent, Rating, Typography } from '@mui/material';
import { formatNumber } from 'helpers/index';
import { ProductDetailDto } from 'models/productDetailDto';
import classes from './ProductDetailCard.module.scss';
const bull = (
	<Box component="span" sx={{ display: 'inline-block', mx: 1, transform: 'scale(1.2)' }}>
		•
	</Box>
);

export interface ProductDetailProps {
	product: ProductDetailDto;
}

export const ProductDetailCard = ({ product }: ProductDetailProps) => {
	return (
		<Card className={classes['product-container']}>
			<CardContent>
				<div className={classes['card-content']}>
					<img src="/icon.png" alt="lulu" loading="eager" className={classes['product-img']} />
					<div className={classes['product-content']}>
						<Typography sx={{ fontSize: 30, fontFamily: 'inherit' }} gutterBottom>
							{product?.name}
						</Typography>
						<Typography sx={{ fontSize: 18, fontWeight: 800, fontFamily: 'inherit' }}>General information:</Typography>
						<Typography component="div">
							{bull}
							<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
								Brand:
							</Typography>
							<Typography component="span" sx={{ fontSize: 16, ml: 1 }}>
								{product?.brand}
							</Typography>
						</Typography>
						<Typography component="div">
							{bull}
							<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
								Category:
							</Typography>
							<Typography component="span" sx={{ fontSize: 16, ml: 1 }}>
								{product?.category}
							</Typography>
						</Typography>
						<Typography component="div">
							{bull}
							<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
								Warranty month:
							</Typography>
							<Typography component="span" sx={{ fontSize: 16, ml: 1 }}>
								{product?.warrantyMonth} month(s)
							</Typography>
						</Typography>
						<Typography component="div">
							{bull}
							<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
								Rating:
							</Typography>
							<Rating value={product?.rating} precision={0.5} readOnly disabled />
							<Typography component="span" sx={{ fontWeight: 600, fontSize: 16 }}>
								({formatNumber(product?.numberRating!)})
							</Typography>
						</Typography>
						<Typography component="div">
							{bull}
							<Typography component="span" sx={{ fontWeight: 800, fontSize: 16 }}>
								Price:
							</Typography>
							<Typography component="span" sx={{ fontWeight: 800, fontSize: 16, ml: 1, color: 'red' }}>
								{formatNumber(product?.price)}₫
							</Typography>
						</Typography>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
