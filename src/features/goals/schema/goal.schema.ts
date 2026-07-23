import { z } from "zod";

export const goalSchema = z.object({
    title: z.string().min(3, "Title is required"),

    description: z.string().optional(),

    goalType: z.enum([
        "LONG_TERM",
        "ONGOING",
        "URGENT",
    ]),

    priority: z
        .enum([
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
        ])
        .optional(),
        
    status: z
    .enum([
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
    ])
    .optional(),

    startDate: z.string().optional(),

    dueDate: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalSchema>;