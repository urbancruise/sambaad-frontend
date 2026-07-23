import { z } from "zod";

export const taskSchema = z.object({

    goalId: z.string().min(1, "Goal is required"),

    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(150),

    description: z.string().optional(),

    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    ]),
    status: z
    .enum([
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
    ])
    .optional(),

    startDate: z.string(),

    dueDate: z.string(),

});

export type TaskFormValues =
    z.infer<typeof taskSchema>;
