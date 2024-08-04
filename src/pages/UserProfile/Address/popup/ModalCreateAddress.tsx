/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// @types

// _mock

import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../../../components/hook-form";
import {
  addressForm,
  districtProps,
  provincesProps,
  wardProps,
} from "../../../../models/address";
import { useEffect, useState } from "react";
import { ApiAddress } from "../../../../api/services/apiAddress";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
};

export default function ModalCreateAddress({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [provinces, setProvinces] = useState<provincesProps[]>([]);
  const [districts, setDistricts] = useState<districtProps[]>([]);
  const [wards, setWards] = useState<wardProps[]>([]);
  const { apiGetCity, apiDistrict, apiWard, apiCreateAddress } = ApiAddress();

  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required("Cần đặt tên cho địa chỉ").trim(),
    note: Yup.string()
      .required("Cần mô tả số nhà, tên đường")
      .min(2, "Nhiều hơn 2")
      .trim(),
    cityId: Yup.string().required("Bắt buộc"),
    districtId: Yup.string().required("Bắt buộc"),
    wardId: Yup.string().required("bắt buộc"),
    namePersonal: Yup.string().required("Cần tên người nhận").trim(),
    phoneNumber: Yup.string().required("Cần số điện thoại người nhận").trim(),
  });

  const defaultValues = {
    name: "",
    note: "",
    cityId: "",
    districtId: "",
    wardId: "",
    namePersonal: "",
    phoneNumber: "",
  };

  const methods = useForm<addressForm>({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const cityId = watch("cityId");
  const districtId = watch("districtId");

  const onSubmit = async (data: addressForm) => {
    try {
      const response = await apiCreateAddress(data);
      if (response.status === 200) {
        if (onSuccess) onSuccess();
      } else if (response.StatusCode === 500) {
        toast.error(response.Error);
      } else {
        toast.error(response.Error);
      }
    } catch (error) {
      onClose();
      console.error(error);
    }
  };

  const fetchProvice = async () => {
    const response = await apiGetCity();
    setProvinces(response.data);
  };

  const fetchDistrict = async (cityId: string) => {
    const params = {
      CityId: cityId,
    };
    const response = await apiDistrict(params);
    setDistricts(response.data);
  };
  const fetchWard = async (districtId: string) => {
    const params = {
      DistrictId: districtId,
    };
    const response = await apiWard(params);
    setWards(response.data);
  };

  useEffect(() => {
    fetchProvice();
  }, []);

  useEffect(() => {
    if (cityId) {
      fetchDistrict(cityId);
    }
  }, [cityId]);

  useEffect(() => {
    if (districtId) {
      fetchWard(districtId);
    }
  }, [districtId]);
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Thêm mới địa chỉ</DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <RHFTextField name="name" label="Tên địa chỉ" />
            <RHFTextField name="namePersonal" label="Tên người nhận" />
            <RHFTextField name="phoneNumber" label="Số điện thoại" />
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(3, 1fr)",
                },
              }}
            >
              <RHFSelect
                name="cityId"
                label="Tỉnh/Thành phố"
                InputLabelProps={{
                  shrink: true,
                }}
              >
                <option value="" key="empty">
                  Chọn tỉnh/thành phố
                </option>
                {provinces.length > 0 ? (
                  provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))
                ) : (
                  <option>Chưa có tỉnh/ thành phố</option>
                )}
              </RHFSelect>
              <RHFSelect
                name="districtId"
                label="Quận/Huyện"
                InputLabelProps={{
                  shrink: true,
                }}
              >
                <option value="" key="empty">
                  Chọn quận/huyện
                </option>
                {districts.length > 0 ? (
                  districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))
                ) : (
                  <option>Chưa có quận/ huyện</option>
                )}
              </RHFSelect>
              <RHFSelect
                name="wardId"
                label="Phường/Xã"
                InputLabelProps={{
                  shrink: true,
                }}
              >
                <option value="" key="empty">
                  Chọn phường/xã
                </option>
                {wards.length > 0 ? (
                  wards.map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.name}
                    </option>
                  ))
                ) : (
                  <option>Chưa có phường/xã</option>
                )}
              </RHFSelect>
            </Box>

            <RHFTextField name="note" label="Số nhà, tên đường" />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Huỷ
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Tạo địa chỉ
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
