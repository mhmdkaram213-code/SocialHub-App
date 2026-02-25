import * as zod from "zod"

export const registerSchema = zod.object({
    name: zod
        .string()
        .nonempty('Name is Required')
        .min(3, 'Name min 3 char')
        .max(8, 'Name is max 8 char'),

    username: zod
        .string()
        .toLowerCase()
        .nonempty('Username is Required')
        .min(3, 'Username min 3 char')
        .max(15, 'Username max 15 char')
        .regex(/^[a-z][a-z0-9_]*$/,
            'Username must start with letter and contain only lowercase letters, numbers, and _'),

    email: zod
        .string()
        .nonempty('Email is Required')
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid Email'),

    password: zod
        .string()
        .nonempty('Password is Required')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Invalid Password'),

    rePassword: zod
        .string()
        .nonempty('rePassword is Required'),

    gender: zod
        .string()
        .nonempty('Gender is Required'),

    dateOfBirth: zod
        .coerce.date()
        .refine((value) => {
            const yearNow = new Date().getFullYear()
            const userAge = yearNow - value.getFullYear()
            return userAge >= 20
        }, 'Age less than 20')

}).refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: 'Passwords do not match'
})