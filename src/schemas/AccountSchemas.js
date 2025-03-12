import { z } from "zod";

export const displayNameSchema = z.object({
    displayName: z.string()
        .min(5, { message: 'Adınız ve soyadınız en az 5 karakter uzunluğunda olmalıdır.' })
        .max(50, { message: 'Adınız ve soyadınız en fazla 50 karakter uzunluğunda olmalıdır.' })
        .regex(/^[A-Za-zÇçĞğİıÖöŞşÜü]+(?: [A-Za-zÇçĞğİıÖöŞşÜü]+)*$/, { message: 'Adınız ve soyadınız yalnızca harflerden oluşmalı ve kelimeler arasında en fazla bir boşluk olmalıdır.' })
        .nonempty({ message: 'Lütfen adınızı ve soyadınızı giriniz.' })
});

export const phoneNumberSchema = z.object({
    phoneNumber: z.string()
        .min(8, { message: "Telefon numarası en az 8 haneli olmalıdır." })
        .max(15, { message: "Telefon numarası en fazla 15 haneli olmalıdır." })
        .regex(/^(\+?[0-9]{1,3})?[0-9]{8,14}$/, { message: "Geçerli bir telefon numarası giriniz." })
        .refine((value) => !/\s/.test(value), {
            message: "Telefon numarası boşluk içeremez.",
        }),
});

export const biographySchema = z.object({
    bio: z.string()
        .min(1, { message: 'Biyografiniz en az 1 karakter uzunluğunda olmalıdır.' })
        .max(100, { message: 'Biyografiniz en fazla 100 karakter uzunluğunda olmalıdır.' })
        .nonempty({ message: 'Lütfen biyografinizi giriniz.' })
});
