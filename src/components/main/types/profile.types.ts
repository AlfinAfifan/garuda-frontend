interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
}

interface UpdateProfilePayload {
    email: string;
    name: string;
}