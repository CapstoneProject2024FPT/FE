import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Card,
    Stack,
    Button,
} from "@mui/material";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";

interface CancelOrderDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (note: string) => void;
}

interface NoteProps {
    note: string;
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({ open, onClose, onConfirm }) => {
    const BrandSchema = Yup.object().shape({
        note: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    });

    const defaultValues: NoteProps = {
        note: "",
    };

    const methods = useForm<NoteProps>({
        resolver: yupResolver(BrandSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: NoteProps) => {
        try {
            onConfirm(data.note);
            reset();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Hủy đơn hàng</DialogTitle>
                <DialogContent>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <RHFTextField
                                name="note"
                                label="Lý do hủy đơn hàng"
                                multiline
                                rows={5}
                            />
                        </Stack>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <div style={{ width: "45%", display: "flex", justifyContent: "space-between" }}>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="error"
                            loading={isSubmitting}
                        >
                            Xác nhận thay đổi
                        </LoadingButton>
                        <Button onClick={onClose} color="primary" variant="contained">
                            Hủy
                        </Button>
                    </div>
                </DialogActions>
            </FormProvider>
        </Dialog>

    );
};

export default CancelOrderDialog;
