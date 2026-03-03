import z from "zod";

export const UserValidator = z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    email: z.string().email().optional(),
    location: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
});

export type UserUpdateDTO = z.infer<typeof UserValidator>;
