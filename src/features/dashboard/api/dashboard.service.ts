import api from "@/src/lib/axios";
import { getTodayWork } from "./today.service";

export const getEmployeeDashboard = async () => {

    const [dashboard, todayWork] = await Promise.all([
        api.get("/dashboard/employee"),
        getTodayWork(),
    ]);
    return {
        
        ...dashboard.data.data,
        todayWork,
    };

};