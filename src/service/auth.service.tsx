import { signUpServiceType } from '../types/authType';
import bcrypt from "bcrypt";
import { checkExistingUserRepo, createUserRepo, UpdateUserPasswordRepo } from "../repository/auth.repository";
export { signUpServiceType } from "../types/authType"
import { LoginServiceType } from "../types/authType";
import SendEmailUi from '../utils/react-email-starter/emails/SendEmail';
import SendEmail from '../lib/sendEmail';
import { render } from '@react-email/components';
import { ApiError } from '../utils/error';




export const signUpService = async ({ name, email, password }: signUpServiceType) => {

    const existingUser = await checkExistingUserRepo(email)
    if (existingUser) {
        throw new ApiError("User already exists", 400);
    }


    const hasshedPassword = await bcrypt.hash(password, 10);

    const NewUser = await createUserRepo(name, email, hasshedPassword);
    return NewUser;
}


export const loginService = async ({ email, password }: LoginServiceType) => {

    const existingUser = await checkExistingUserRepo(email);

    if (!existingUser) {
        throw new ApiError("User with the given email does  not exists", 404);
    }

    const validatePassword = await bcrypt.compare(password, existingUser.password)

    if (!validatePassword) {
        throw new ApiError("Invalid email or password", 400);
    }

    return existingUser;


}


export const forgotPasswordService = async (email: string) => {


    const link = {
        url: "http://localhost:3000/reset-password",
        text: "Reset Password"
    }
    const html = await render(
        <SendEmailUi
            heading="Welcome to Our Service"
            message="example.com is excited to have you on board. Please verify your email to get started."
            link={link}
            footer="If you did not sign up for this account, please ignore this email." />
    )
    const sendEmail = await SendEmail(email, "Reset Password", html);
    return sendEmail;
}


export const ResetPasswordService = async (email: string, newPassword: string) => {

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const ResetPassword = await UpdateUserPasswordRepo(email, hashedPassword)
     
    return ResetPassword;
}
