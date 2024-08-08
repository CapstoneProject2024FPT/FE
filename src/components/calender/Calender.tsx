import React, { useCallback } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Badge } from "antd";
import viVN from "antd/es/calendar/locale/vi_VN";
import { GetTaskProps } from "../../models/task";

interface CalenderProps {
  tasks: GetTaskProps[] | [];
}

const CalendarComponent: React.FC<CalenderProps> = ({ tasks }) => {
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
  return (
    <>
      <Calendar cellRender={cellRender} locale={viVN} />
    </>
  );
};

export default CalendarComponent;
