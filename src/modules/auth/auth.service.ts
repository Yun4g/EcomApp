import { signUpServiceType } from './../../types/authType';
import bcrypt from "bcrypt";
import { checkExistingUserRepo, createUserRepo } from "./auth.repository";
export {signUpServiceType} from "../../types/authType"
import { LoginServiceType } from "../../types/authType";



export const signUpService = async ({ name, email, password }: signUpServiceType) => {

    const existingUser = await checkExistingUserRepo(email)
    if (existingUser) {
        throw new Error("User already exists");
    }


    const hasshedPassword = await bcrypt.hash(password, 10);

    const NewUser = await createUserRepo(name, email, hasshedPassword);
    return NewUser;
}


export const loginService = async ({ email, password }: LoginServiceType) => {

    const existingUser = await checkExistingUserRepo(email);

    if (!existingUser) {
        throw new Error("User with the given email does  not exists");
    }

    const validatePassword = await bcrypt.compare(password, existingUser.password)

    if (!validatePassword) {
        throw new Error("Invalid email or password");
    }
    


    return existingUser;


}

