import React from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import cart from "../Cart/cart.json"
import { Button, Card, CardMedia, Divider, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

let cartList = cart;

const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartList.forEach((item) => {
        totalPrice += item.price;
    });
    return totalPrice;
};


const Cart: React.FC = () => {

    return (
        <div style={{ backgroundColor: "#ECF0F1" }}>
            <Box sx={{ flexGrow: 1, margin: "5%", padding: "20px" }}>
                <div style={{ fontSize: "30px", fontWeight: "bold", margin: "10px" }}>Cart</div>
                <Grid container spacing={2}>
                    <Grid xs={8}>
                        {cartList.map((item, index) => {
                            return (
                                <Card key={index} sx={{ display: "flex", padding: "20px", marginBottom: "10px" }}>
                                    <CardMedia component="img" sx={{ width: 200, height: 150 }} image={item.image}  >
                                    </CardMedia>
                                    <Box sx={{ display: 'flex', flexDirection: 'row' }} >

                                        <Typography component="div" variant="h6">
                                            <div>{item.name}</div>
                                        </Typography>

                                    </Box>
                                    <Typography style={{ marginLeft: "50%" }} component="div" variant="h6">
                                        <div>{item.price}$</div>
                                    </Typography>
                                    <Stack>
                                        <Button variant="outlined" startIcon={<DeleteIcon />} style={{ marginLeft: "10px", marginBottom: "10px", fontSize: "20px", cursor: "pointer" }}>Delete</Button>
                                        <Button variant="outlined" startIcon={<FavoriteIcon />} style={{ marginLeft: "10px", fontSize: "20px", cursor: "pointer" }}>Favorite</Button>
                                    </Stack>

                                </Card>
                            )
                        })}
                    </Grid>
                    <Grid xs={4}>
                        <Stack>
                            <Item>
                                <TextField label="Voucher Code" variant="outlined" style={{ margin: "10px" }} />
                                <Button variant="contained" style={{ backgroundColor: "#3498DB", color: "white", fontSize: "20px", cursor: "pointer", margin: "10px" }}>Apply</Button>
                                <Divider />
                                <Typography component="div" variant="h6" style={{ margin: "10px" }}>
                                    Total Price: ${calculateTotalPrice()}
                                </Typography>
                                <Divider />
                                <Button variant="contained" style={{ backgroundColor: "#3498DB", color: "white", fontSize: "20px", cursor: "pointer", margin: "10px" }}>Checkout</Button>
                            </Item>
                        </Stack>

                    </Grid>
                </Grid>
            </Box >
        </div >
    );
};

export default Cart;