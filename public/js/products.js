const btnAdd = document.querySelectorAll(".btn-addToCart")
const profile = document.getElementById("ul-profile")

let cartBody

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
    let counter = Number(profile.dataset.counter)

    if (counter === 1) {

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
    }

    logOut()
    updateCartNumber()
}

//Funcion para obtener del LS el Id el carrito
const getCartId = () => {

    let ls = localStorage.cart
    let data

    if (ls === undefined) {
        return ls
    } else {
        data = JSON.parse(ls)
        return data.cartId
    }
}

//Funcion para setear la estructura del carrito
const updateCart = (cid, products) => {
    cartBody = {
        "cartId": cid,
        "products": products
    }
}

//Funcion para guardar la estructura del carrito en el localStorage
const setCart = () => {
    localStorage.setItem("cart", JSON.stringify(cartBody))
}

//Funcion para actualizar en el DOM el numero de cantidad de productos
const updateCartNumber = () => {
    const btnCart = document.getElementById("container-cart")
    let ls = localStorage.cart
    let data
    let price = []
    let quantity = []
    let element = ``
    if (ls === undefined) {
        return 0
    } else {
        data = JSON.parse(ls)
        //count += data.products.length
        data.products.map((product) => {
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
        return btnCart.innerHTML = element
    }
}

btnAdd.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault()
        const ul = e.target.closest('ul')

        const productId = ul.dataset.id

        let cartId = getCartId()
        let products = []

        if (cartId === undefined) {

            await fetch(`/api/carts`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' }

            }).then(res => res.json()).then(data => {

                const { id } = data

                cid = id

                updateCart(cid, products)

                setCart();

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

        cartId = await getCartId()

        await fetch(`/api/carts/${cartId}/product/${productId}`, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),

        }).then(res => res.json()).then(data => {

            updateCart(cartId, data.data.products)

            setCart()

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

