const btnAdd = document.querySelectorAll(".btn-addToCart")
const profile = document.getElementById("ul-profile")

//Funcion que una vez generado el perfil, podre cerrar sesion mediante su respectivo boton
const logOut = async () => {

    const btnLogout = document.getElementById("btn-logout")

    if (btnLogout) {
        btnLogout.addEventListener("click", async (e) => {
            const response = await fetch("/api/sessions/logout")
            if (response.ok) {
                Toastify({
                    text: `Se ha cerrado la sesion`,
                    duration: 3000,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast()
                setTimeout(() => {
                    window.location.href = `/`;
                }, 3000)
            } else {
                Toastify({
                    text: `Error al cerrar sesion`,
                    duration: 3000,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to left, #b00017, #5e1f21)"
                    }
                }).showToast();
            }
        })
    }
}

//Funcion para generar el mensaje de saludo
const saludo = () => {
    let message = profile.dataset.welcome

    Toastify({
        text: `Bienvenido ${message}`,
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

    logOut()
    updateCartNumber()
}

//Funcion para obtener del LS el Id el carrito
const getCartId = async () => {

    const response = await fetch("/api/carts/user/cart")

    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        return false
    }
}

//Funcion para actualizar en el DOM el numero de cantidad de productos
const updateCartNumber = async () => {
    const cartContainer = document.getElementById("container-cart")
    const data = await getCartId()
    if (!data) {
        return
    }
    const cart = data.carrito
    let price = []
    let quantity = []
    let element = ""

    cart.products.map((product) => {
        price.push(product.product.price * product.quantity)
        quantity.push(product.quantity)
    })

    let total = price.reduce((acc, currentValue) => acc + currentValue, 0);
    let count = quantity.reduce((acc, currentValue) => acc + currentValue, 0)

    element += `
        <h1>LISTA DE PRODUCTOS</h1>
        <a href="/carts/${data.cartId}" class="btn-cart" id="btn-cart">
            <div>🛒</div>
            <p  class="counter">${count}</p>
            <p  class="total">$${total}</p>
        </a>
        `
    return cartContainer.innerHTML = element
}

btnAdd.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault()

        const ul = e.target.closest('ul')

        const productId = ul.dataset.id

        let cart = await getCartId()

        let cartId

        if (!cart) {
            cartId = undefined
        } else {
            cartId = cart.cartId
        }

        if (cartId === undefined) {

            await fetch(`/api/carts`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' }

            }).then(res => res.json()).then(data => {

                const { id } = data

                cid = id

                Toastify({
                    text: `CARRITO N°: ${cid} creado con exito `,
                    duration: 3000,
                    className: "info",
                    close: true,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast()
            }).catch((error) => {

                if (error) {

                    Toastify({
                        text: `Error al crear un carrito`,
                        duration: 3000,
                        className: "info",
                        close: true,
                        gravity: "top",
                        position: "center",
                        stopOnFocus: true,
                        style: {
                            background: "linear-gradient(to left, #b00017, #5e1f21)"
                        }
                    }).showToast();

                }
            })
        }
        cart = await getCartId()
        cartId = cart.cartId
        console.log(cartId);

        await fetch(`/api/carts/${cartId}/product/${productId}`, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),

        }).then(res => res.json()).then(data => {

            updateCartNumber()

            Toastify({
                text: `Agregado exitosamente!`,
                duration: 3000,
                className: "info",
                close: true,
                gravity: "bottom",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }

            }).showToast()

        }).catch((error) => {
            if (error) {

                Toastify({
                    text: 'Error al agregar el producto al carrito',
                    className: "success",
                    close: true,
                    gravity: "bottom",
                    position: "center",
                    style: {
                        background: "linear-gradient(to left, #b00017, #5e1f21)",
                    }
                }).showToast();

            }
        })
    })
})

saludo()

