import { z } from "zod";

// Display Name için Şema
export const displayNameSchema = z.object({
    displayName: z.string()
        .min(5, { message: 'Adınız ve soyadınız en az 5 karakter uzunluğunda olmalıdır.' })
        .max(50, { message: 'Adınız ve soyadınız en fazla 50 karakter uzunluğunda olmalıdır.' })
        .regex(/^[A-Za-zÇçĞğİıÖöŞşÜü]+(?: [A-Za-zÇçĞğİıÖöŞşÜü]+)*$/, { message: 'Adınız ve soyadınız yalnızca harflerden oluşmalı ve kelimeler arasında en fazla bir boşluk olmalıdır.' })
        .nonempty({ message: 'Lütfen adınızı ve soyadınızı giriniz.' })
});

// Telefon Numarası için Şema
export const phoneNumberSchema = z.object({
    phoneNumber: z.string()
        .min(11, { message: 'Telefon numaranız en az 11 karakter uzunluğunda olmalıdır.' })
        .max(15, { message: 'Telefon numaranız en fazla 15 karakter uzunluğunda olmalıdır.' })
        .regex(/^\+?\d+$/, { message: 'Geçerli bir telefon numarası giriniz.' })
        .nonempty({ message: 'Lütfen bir telefon numarası giriniz.' })
});

// Biyografi için Şema
export const biographySchema = z.object({
    bio: z.string()
        .min(1, { message: 'Biyografiniz en az 1 karakter uzunluğunda olmalıdır.' })
        .max(100, { message: 'Biyografiniz en fazla 100 karakter uzunluğunda olmalıdır.' })
        .nonempty({ message: 'Lütfen biyografinizi giriniz.' })
});
