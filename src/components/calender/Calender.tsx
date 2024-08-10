import React, { useCallback, useState } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Badge } from "antd";
import viVN from "antd/es/calendar/locale/vi_VN";
import { GetTaskProps } from "../../models/task";
import ModalDetailTaskCalender from "./ModalDetails";

interface CalenderProps {
  tasks: GetTaskProps[] | [];
}

const CalendarComponent: React.FC<CalenderProps> = ({ tasks }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectTasks, setSelectTasks] = useState<GetTaskProps[]>([]);
  //calender
  const cellRender = useCallback(
    (currentDate: Dayjs, info: { type: string }) => {
      if (tasks.length > 0) {
        if (info.type === "date") {
          const formattedDate = currentDate.format("YYYY-MM-DD");
          const dailyTasks = tasks.filter(
            (task) =>
              dayjs(task.excutionDate).format("YYYY-MM-DD") === formattedDate
          );

          return (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {dailyTasks.map((task) => (
                <li key={task.id}>
                  <Badge
                    status="processing"
                    text={task.type === "Delivery" ? "Giao hàng" : "Bảo hành"}
                  />
                </li>
              ))}
            </ul>
          );
        }
      }
      return null;
    },
    [tasks]
  );

  const onSelect = (date: Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const selectedTasks = tasks.filter(
      (task) => dayjs(task.excutionDate).format("YYYY-MM-DD") === formattedDate
    );
    if (selectedTasks.length > 0) {
      setSelectTasks(selectedTasks);
      setOpen(true);
      return;
    }
    return;
  };
  return (
    <>
      <Calendar cellRender={cellRender} locale={viVN} onSelect={onSelect} />
      {open && (
        <ModalDetailTaskCalender
          TaskData={selectTasks}
          handleClose={() => setOpen(false)}
          open={open}
        />
      )}
    </>
  );
};

export default CalendarComponent;
