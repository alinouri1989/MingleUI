import { z } from "zod";

export const changePasswordSchema = z.object({
    currentPassword: z.string()
        .nonempty({ message: "Mevcut şifrenizi giriniz." }),

    newPassword: z.string()
        .min(8, { message: "Şifreniz en az 8 karakter uzunluğunda olmalıdır." })
        .max(16, { message: "Şifreniz en fazla 16 karakter uzunluğunda olmalıdır." })
        .regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\dÇçĞğİıÖöŞşÜü]*$/,
            { message: "Şifreniz en az bir büyük harf ve bir sayı içermelidir." }),

    newPasswordAgain: z.string()
        .nonempty({ message: "Lütfen yeni şifrenizi tekrar giriniz." })
}).refine((data) => data.newPassword === data.newPasswordAgain, {
    message: "Şifreler eşleşmiyor.",
    path: ["newPasswordAgain"],
});
