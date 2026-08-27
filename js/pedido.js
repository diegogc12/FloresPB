document.addEventListener("DOMContentLoaded", function () {

    /*
    ============================================================
    ELEMENTOS PRINCIPALES
    ============================================================
    */

    const totalDisplay = document.getElementById("totalDisplay");
    const confirmBtn = document.getElementById("confirmOrder");

    let metodoPedido = "";


    /*
    ============================================================
    MÉTODO DE PEDIDO
    ============================================================
    */

    const btnDomicilio = document.getElementById("btnDomicilio");
    const formDomicilio = document.getElementById("formDomicilio");

    if (btnDomicilio && formDomicilio) {

        btnDomicilio.addEventListener("click", function () {

            if (metodoPedido === "Domicilio") {

                metodoPedido = "";

                formDomicilio.classList.add("d-none");
                btnDomicilio.classList.remove("btn-rosa");

            } else {

                metodoPedido = "Domicilio";

                formDomicilio.classList.remove("d-none");
                btnDomicilio.classList.add("btn-rosa");
            }

        });

    }


    /*
    ============================================================
    PRODUCTOS
    ============================================================
    
    Cada .list-group-item representa un producto/flor.

    Dentro de cada producto tendremos:

        .qty-input
        .gramaje-group

    Ejemplo:

        Lemon Frost

        qty-input = 3

        3g = 2 unidades
        7g = 1 unidad
        9g = 0 unidades

        qty-input = 3
    */

    const productos = document.querySelectorAll(
        ".list-group-item"
    );


    /*
    ============================================================
    INICIALIZAR GRAMAJES
    ============================================================
    */

    document.querySelectorAll(".gramaje-group").forEach(function (grupo) {

        /*
        Cada presentación comienza en 0 unidades
        */

        if (!grupo.dataset.quantity) {
            grupo.dataset.quantity = "0";
        }


        const chip = grupo.querySelector(".gramaje-chip");

        /*
        Botones + y -
        */

        const botones = grupo.querySelectorAll(".gramaje-btn");


        /*
        ========================================================
        CLICK EN LA TARJETA / SPAN
        ========================================================
        
        Al pulsar el span se agrega UNA unidad.

        Esto permite:

            click → +1

        */

        if (chip) {

            chip.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                let cantidad =
                    parseInt(grupo.dataset.quantity) || 0;

                cantidad++;

                grupo.dataset.quantity =
                    cantidad.toString();

                actualizarEstadoVisual(grupo);

                actualizarCantidadProducto(
                    grupo.closest(".list-group-item")
                );

                updateTotal();

            });

        }


        /*
        ========================================================
        BOTONES + Y -
        ========================================================
        */

        botones.forEach(function (boton) {

            boton.addEventListener("click", function (event) {

                /*
                Evita que el clic también active
                el span/contenedor.
                */

                event.preventDefault();
                event.stopPropagation();


                let cantidad =
                    parseInt(grupo.dataset.quantity) || 0;


                const accion =
                    this.getAttribute("data-action");


                /*
                AGREGAR
                */

                if (accion === "plus") {

                    cantidad++;

                }


                /*
                QUITAR
                */

                if (accion === "minus") {

                    cantidad =
                        Math.max(0, cantidad - 1);

                }


                /*
                Guardar cantidad
                */

                grupo.dataset.quantity =
                    cantidad.toString();


                /*
                Actualizar apariencia
                */

                actualizarEstadoVisual(grupo);


                /*
                Actualizar qty-input
                */

                actualizarCantidadProducto(
                    grupo.closest(".list-group-item")
                );


                /*
                Actualizar precio
                */

                updateTotal();

            });

        });

    });


    /*
    ============================================================
    ESTADO VISUAL DE UNA PRESENTACIÓN
    ============================================================
    */

    function actualizarEstadoVisual(grupo) {

        const cantidad =
            parseInt(grupo.dataset.quantity) || 0;


        if (cantidad > 0) {

            grupo.classList.add("active");

        } else {

            grupo.classList.remove("active");

        }

    }


    /*
    ============================================================
    ACTUALIZAR QTY-INPUT
    ============================================================
    
    El qty-input representa la cantidad total de
    presentaciones seleccionadas de ese producto.

    Ejemplo:

        3g = 2
        7g = 1
        9g = 0

        qty-input = 3
    */

    function actualizarCantidadProducto(producto) {

        if (!producto) {
            return;
        }


        let cantidadTotal = 0;


        /*
        Obtener todas las presentaciones
        */

        const presentaciones =
            producto.querySelectorAll(".gramaje-group");


        presentaciones.forEach(function (grupo) {

            const cantidad =
                parseInt(grupo.dataset.quantity) || 0;

            cantidadTotal += cantidad;

        });


        /*
        Actualizar qty-input
        */

        const qtyInput =
            producto.querySelector(".qty-input");


        if (qtyInput) {

            qtyInput.value =
                cantidadTotal;

        }

    }


    /*
    ============================================================
    CALCULAR TOTAL
    ============================================================
    */

    function updateTotal() {

        let total = 0;


        productos.forEach(function (producto) {

            const presentaciones =
                producto.querySelectorAll(".gramaje-group");


            presentaciones.forEach(function (grupo) {

                const cantidad =
                    parseInt(grupo.dataset.quantity) || 0;


                const precio =
                    parseFloat(grupo.dataset.price) || 0;


                /*
                Subtotal de esa presentación

                Ejemplo:

                3g × $100 × 2 unidades

                = $200
                */

                total +=
                    cantidad * precio;

            });

        });


        /*
        Mostrar total
        */

        if (totalDisplay) {

            totalDisplay.innerText =
                `$${total.toFixed(2)}`;

        }

    }


    /*
    ============================================================
    QTY-INPUT COMO CONTADOR
    ============================================================
    
    El cliente no modifica directamente el qty-input.
    
    Se actualiza automáticamente mediante las tarjetas.

    ============================================================
    */

    document.querySelectorAll(".qty-input").forEach(function (input) {

        input.readOnly = true;

        input.setAttribute(
            "aria-label",
            "Cantidad total seleccionada"
        );

    });


    /*
    ============================================================
    ENVIAR PEDIDO
    ============================================================
    */

    if (confirmBtn) {

        confirmBtn.addEventListener("click", function () {

            let orderSummary = [];

            let total = 0;


            /*
            ====================================================
            RECORRER CADA PRODUCTO
            ====================================================
            */

            productos.forEach(function (producto) {

                /*
                Obtener nombre
                */

                const nombreElemento =
                    producto.querySelector(".fw");


                if (!nombreElemento) {
                    return;
                }


                const nombre =
                    nombreElemento.innerText.trim();


                /*
                Buscar todas las presentaciones
                */

                const presentaciones =
                    producto.querySelectorAll(
                        ".gramaje-group"
                    );


                /*
                =================================================
                RECORRER GRAMAJES
                =================================================
                */

                presentaciones.forEach(function (grupo) {

                    const cantidad =
                        parseInt(
                            grupo.dataset.quantity
                        ) || 0;


                    /*
                    Si cantidad = 0
                    no se agrega al pedido
                    */

                    if (cantidad <= 0) {
                        return;
                    }


                    /*
                    Obtener gramaje
                    */

                    const gramos =
                        grupo.dataset.gramos || "";


                    /*
                    Obtener precio
                    */

                    const precio =
                        parseFloat(
                            grupo.dataset.price
                        ) || 0;


                    /*
                    Subtotal
                    */

                    const subtotal =
                        cantidad * precio;


                    /*
                    Sumar al total
                    */

                    total += subtotal;


                    /*
                    Agregar al pedido

                    Ejemplo:

                    2x Lemon Frost - 3 g = $200
                    */

                    orderSummary.push(
                        `${cantidad}x ${nombre} - ${gramos} g = $${subtotal.toFixed(2)}`
                    );

                });

            });


            /*
            ====================================================
            VALIDAR PEDIDO
            ====================================================
            */

            if (orderSummary.length === 0) {

                alert(
                    "Por favor selecciona al menos una presentación."
                );

                return;

            }


            /*
            ====================================================
            VALIDAR MÉTODO DE PEDIDO
            ====================================================
            */

            if (metodoPedido === "") {

                alert(
                    "Por favor selecciona un método de pedido."
                );

                return;

            }


            /*
            ====================================================
            CREAR MENSAJE
            ====================================================
            */

            let mensaje =
                "Hola, buenas noches.\n\n" +
                "Quisiera ordenar:\n\n" +
                orderSummary.join("\n") +
                "\n\n" +
                `Total: $${total.toFixed(2)}`;


            /*
            ====================================================
            DOMICILIO
            ====================================================
            */

            if (metodoPedido === "Domicilio") {

                const nombre =
                    document.getElementById(
                        "nombreDom"
                    )?.value.trim();


                const telefono =
                    document.getElementById(
                        "telefonoDom"
                    )?.value.trim();


                const calle =
                    document.getElementById(
                        "calleDom"
                    )?.value.trim();


                const entreCalles =
                    document.getElementById(
                        "direccionDom"
                    )?.value.trim();


                const referencia =
                    document.getElementById(
                        "referenciaDom"
                    )?.value.trim();


                /*
                Validar datos
                */

                if (
                    !nombre ||
                    !telefono ||
                    !calle ||
                    !entreCalles ||
                    !referencia
                ) {

                    alert(
                        "Por favor completa todos los datos del pedido a domicilio."
                    );

                    return;

                }


                /*
                Validar teléfono
                */

                if (!/^\d{10}$/.test(telefono)) {

                    alert(
                        "El teléfono debe tener exactamente 10 dígitos."
                    );

                    return;

                }


                /*
                Agregar información
                */

                mensaje +=
                    "\n\nEntrega a domicilio" +
                    `\nNombre: ${nombre}` +
                    `\nTeléfono: ${telefono}` +
                    `\nCalle: ${calle}` +
                    `\nEntre calles: ${entreCalles}` +
                    `\nReferencia: ${referencia}`;


                /*
                Agregar ubicación GPS
                */

                const ubicacion =
                    document.getElementById(
                        "ubicacion"
                    )?.value.trim();


                if (ubicacion) {

                    mensaje +=
                        `\nUbicación: https://www.google.com/maps?q=${ubicacion}`;

                }

            }


            /*
            ENVIAR A WHATSAPP
            */

            const encodedMessage =
                encodeURIComponent(mensaje);


            window.open(
                `https://wa.me/5219871161465?text=${encodedMessage}`,
                "_blank"
            );

        });

    }


    /*
    ESTADO INICIAL
    */

    productos.forEach(function (producto) {

        actualizarCantidadProducto(producto);

    });


    updateTotal();

});