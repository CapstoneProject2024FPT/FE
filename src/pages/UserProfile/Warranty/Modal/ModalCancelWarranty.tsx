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

interface CancelWarrantyDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (note: string) => void;
}

interface DescriptionProps {
    description: string;
}

const CancelWarrantyDialog: React.FC<CancelWarrantyDialogProps> = ({ open, onClose, onConfirm }) => {
    const BrandSchema = Yup.object().shape({
        description: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    });

    const defaultValues: DescriptionProps = {
        description: "",
    };

    const methods = useForm<DescriptionProps>({
        resolver: yupResolver(BrandSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: DescriptionProps) => {
        try {
            onConfirm(data.description);
            reset();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Hủy bảo hành</DialogTitle>
                <DialogContent>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <RHFTextField
                                name="description"
                                label="Lý do hủy bảo hành"
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

export default CancelWarrantyDialog;
