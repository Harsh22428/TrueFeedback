import {z} from 'zod';

export const usernameValidation=z.string().min(2).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special character').nonempty('Username is required');

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string({message:'Email is required'}),
    password:z.string().min(6,{message:'password must be at least 6 characters'})
})