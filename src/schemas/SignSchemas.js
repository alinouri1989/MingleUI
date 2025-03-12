import { z } from "zod";

export const signInSchema = z.object({
    Email: z.string().email("Geçerli bir email adresi giriniz"),
    Password: z.string().nonempty("Şifrenizi giriniz"),
});

export const signUpSchema = z.object({
    DisplayName: z.string()
        .min(5, { message: "Ad soyad en az 5, en fazla 50 karakter olmalıdır." })
        .max(50, { message: "Ad soyad en az 5, en fazla 50 karakter olmalıdır." })
        .regex(/^(?!.*\d)[A-Za-zÇçĞğİıÖöŞşÜü]+(?: [A-Za-zÇçĞğİıÖöŞşÜü]+)?$/, {
            message: "Sadece harf içermeli ve en fazla bir boşluk olmalıdır.",
        }),

    Email: z.string()
        .email({ message: "Lütfen geçerli bir e-mail adresi giriniz." })
        .max(30, { message: "E-Mail adresiniz en fazla 30 karakter uzunluğunda olmalıdır." }),
    Password: z.string()
        .min(8, { message: "Şifreniz en az 8 karakter uzunluğunda olmalıdır." })
        .max(16, { message: "Şifreniz en fazla 16 karakter uzunluğunda olmalıdır." })
        .regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\dÇçĞğİıÖöŞşÜü]*$/, {
            message: "Şifreniz en az bir büyük harf ve bir sayı içermelidir.",
        }),
    PasswordAgain: z.string(),
    BirthDate: z.date({
        invalid_type_error: "Geçerli bir tarih giriniz.",
    }).refine(date => date <= new Date(), {
        message: "Doğum tarihi gelecekte olamaz.",
    }),
}).refine(data => data.Password === data.PasswordAgain, {
    message: "Şifreler eşleşmiyor.",
    path: ["PasswordAgain"],
});

export const resetPasswordSchema = z.object({
    Email: z.string()
        .email({ message: "Lütfen geçerli bir e-mail adresi giriniz." })
        .nonempty({ message: "E-Mail adresi boş bırakılamaz." })
});