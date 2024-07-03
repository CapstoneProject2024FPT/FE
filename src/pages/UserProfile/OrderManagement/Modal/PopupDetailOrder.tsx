import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

interface ModalOrder {
    orderData: any;
    open: boolean;
    handleClose: () => void;
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const ModalOrderPopup: React.FC<ModalOrder> = ({
    orderData,
    handleClose,
    open
}) => {
    console.log(orderData);

    return (
        <div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Order Status : {orderData?.orderStatus}
                    </Typography>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Order Detail : {orderData?.orderDetail?.map((item: any) => (
                            <div>
                                <p>Product Name : {item.productName}</p>
                                <p>Product Price : {item.productPrice}</p>
                                <p>Product Quantity : {item.productQuantity}</p>
                                ----------------------------------
                            </div>
                        ))}

                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalOrderPopup;