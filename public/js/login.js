
const btnSignup = document.getElementById("btn-signup");
const btnLogin = document.getElementById("btn-login");
const btnForgot = document.getElementById("btn-forgot")

const signup = async (firstName, lastName, age, email, password) => {
    const response = await fetch(`/api/sessions/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, age, email, password }),
    })

    if (response.ok) {
        return true
    } else {
        const error = await response.json()
        return error.message
    }
}

const login = async (email, password) => {
    try {
        const response = await fetch(`/api/sessions/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            return true
        } else {
            const error = await response.json()
            return error.message
        }
    }
    catch (error) {
        console.log(error);
    }

}

const forgot = async (email, newPassword) => {
    try {
        const response = await fetch(`/api/sessions/forgot`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
        })

        if (response.ok) {
            console.log(await response.json());
            return true
        } else {
            const error = await response.json()
            return error.message
        }

    }
    catch (error) {
        console.log(error);
    }

}

if (btnSignup) {

    btnSignup.addEventListener("click", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("first_name").value
        const lastName = document.getElementById("last_name").value
        const age = document.getElementById("age").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        const result = await signup(firstName, lastName, age, email, password)

        if (result === true) {
            Toastify({
                text: `✅`,
                duration: 2000,
                className: "info",
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast()

            setTimeout(() => {
                window.location.href = `/`;
            }, 2000)

        } else {
            Toastify({
                text: `${result}`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #b00017, #5e1f21)",
                }
            }).showToast()
        }


    });
} else if (btnLogin) {

    btnLogin.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        const result = await login(email, password)

        if (result === true) {
            Toastify({
                text: `✅`,
                duration: 2000,
                className: "info",
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast()

            setTimeout(() => {
                window.location.href = `/products`;
            }, 2000)

        } else {
            Toastify({
                text: `${result}`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #b00017, #5e1f21)",
                }
            }).showToast()
        }

    });
} else {

    btnForgot.addEventListener("click", async (e) => {
        e.preventDefault()
        const email = document.getElementById("email").value
        const newPassword = document.getElementById("newPassword").value
        const newPasswordTwo = document.getElementById("newPasswordTwo").value

        if (newPassword === newPasswordTwo) {

            const result = await forgot(email, newPassword)
            console.log(result);
            if (result === true) {
                Toastify({
                    text: `Contraseña Actualizada`,
                    duration: 2000,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast()

                setTimeout(() => {
                    window.location.href = `/`;
                }, 2000)

            } else {
                Toastify({
                    text: `${result}`,
                    duration: 3000,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to left, #b00017, #5e1f21)",
                    }
                }).showToast()
            }
        } else {

            Toastify({
                text: `Las contraseñas no coinciden`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to left, #b00017, #5e1f21)",
                }
            }).showToast()
        }
    })
}

