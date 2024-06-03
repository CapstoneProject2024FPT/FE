// import React from "react";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import { Stack } from "@mui/material";
// import { Specification } from "../../models/products";

// interface DynamicInputProps {
//   specifications: Specification[];
//   setSpecifications: React.Dispatch<React.SetStateAction<Specification[]>>;
// }

// const DynamicInputComponent: React.FC<DynamicInputProps> = ({
//   specifications,
//   setSpecifications,
// }) => {
//   const handleSpecificationChange = (
//     index: number,
//     field: keyof Specification,
//     value: string | number
//   ) => {
//     setSpecifications((prevSpecs) =>
//       prevSpecs.map((spec, i) =>
//         i === index ? { ...spec, [field]: value } : spec
//       )
//     );
//   };

//   const handleAddSpecification = () => {
//     setSpecifications((prevSpecs) => [
//       ...prevSpecs,
//       { nameSpecification: "", value: 0, unit: "" },
//     ]);
//   };

//   const handleDeleteSpecification = (index: number) => {
//     setSpecifications((prevSpecs) => prevSpecs.filter((_, i) => i !== index));
//   };

//   return (
//     <div>
//       {specifications.map((specification, index) => (
//         <Stack direction="row" key={index} spacing={2} sx={{ mt: 2 }}>
//           <TextField
//             label="Tên thông số"
//             value={specification.nameSpecification}
//             onChange={(e) =>
//               handleSpecificationChange(
//                 index,
//                 "nameSpecification",
//                 e.target.value
//               )
//             }
//             sx={{ width: 200 }}
//           />
//           <TextField
//             label="Giá trị"
//             type="number"
//             value={specification.value}
//             onChange={(e) =>
//               handleSpecificationChange(index, "value", Number(e.target.value))
//             }
//             sx={{ width: 100 }}
//           />
//           <TextField
//             label="Đơn vị"
//             value={specification.unit}
//             onChange={(e) =>
//               handleSpecificationChange(index, "unit", e.target.value)
//             }
//             sx={{ width: 100 }}
//           />
//           <IconButton onClick={() => handleDeleteSpecification(index)}>
//             <DeleteIcon />
//           </IconButton>
//         </Stack>
//       ))}
//       <Button
//         sx={{ mt: 4 }}
//         variant="outlined"
//         startIcon={<AddIcon />}
//         onClick={handleAddSpecification}
//       >
//         Thêm thông số
//       </Button>
//     </div>
//   );
// };

// export default DynamicInputComponent;
