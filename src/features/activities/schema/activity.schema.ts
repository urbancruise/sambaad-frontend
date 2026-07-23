import { z } from "zod";

export const activitySchema = z.object({

    taskId: z
        .string()
        .min(1, "Task is required"),

    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(150),

    description: z
        .string()
        .optional(),

    // priority: z.enum([
    //     "LOW",
    //     "MEDIUM",
    //     "HIGH",
    //     "CRITICAL",
    // ])
    // .optional(),

    assignedToId: z
        .string()
        .optional(),

    // startDate: z
    //     .string()
    //     .optional(),

    // dueDate: z
    //     .string()
    //     .optional(),

});

export type ActivityFormValues =
    z.infer<typeof activitySchema>;