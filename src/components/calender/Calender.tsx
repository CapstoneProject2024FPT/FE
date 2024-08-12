import React, { useCallback, useEffect, useState } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Badge } from "antd";
import viVN from "antd/es/calendar/locale/vi_VN";
import { GetTaskProps } from "../../models/task";
import ModalDetailTaskCalender from "./ModalDetails";

interface CalenderProps {
  tasks: GetTaskProps[] | [];
  chooseDate?: Date | undefined | Dayjs | null;
}

const CalendarComponent: React.FC<CalenderProps> = ({ tasks, chooseDate }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectTasks, setSelectTasks] = useState<GetTaskProps[]>([]);
  const [currentDate, setCurrentDate] = useState<Dayjs | undefined>(
    chooseDate ? dayjs(chooseDate) : undefined
  );

  const chosenDayjsDate = chooseDate ? dayjs(chooseDate) : null;

  const cellRender = useCallback(
    (currentDate: Dayjs, info: { type: string }) => {
      if (tasks.length > 0) {
        if (info.type === "date") {
          const formattedDate = currentDate.format("YYYY-MM-DD");
          const dailyTasks = tasks.filter(
            (task) =>
              dayjs(task.excutionDate).format("YYYY-MM-DD") === formattedDate
          );

          // Check if the current date is the chosen date
          const isChosenDate = chosenDayjsDate?.isSame(currentDate, "day");

          return (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                backgroundColor: isChosenDate ? "#f0f8ff" : "transparent",
                borderRadius: isChosenDate ? "8px" : "none",
              }}
            >
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
    [tasks, chosenDayjsDate]
  );

  // Handle date selection
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
  };

  useEffect(() => {
    if (chooseDate) {
      setCurrentDate(dayjs(chooseDate));
    }
  }, [chooseDate]);

  return (
    <>
      <Calendar
        cellRender={cellRender}
        locale={viVN}
        onSelect={onSelect}
        value={currentDate}
      />
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
