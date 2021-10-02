export const loginSchema = {
    phoneNumber: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isLength: {
            options: { min: 11, max:11 }
        },
        isNumeric: true
    }
}



export const registerSchema = {
    name: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    },
    phoneNumber: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isLength: {
            options: { min: 11, max:11 }
        },
        isNumeric: true
    },
    family: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    },

}

export const verifyUserSchema = {
    userId: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    },
    secretCode: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    }
}