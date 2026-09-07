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

                estadoUbi = "";
            } else {

                metodoPedido = "Domicilio";

                formDomicilio.classList.remove("d-none");
                btnDomicilio.classList.add("btn-rosa");

                estadoUbi = "manual";

            }

        });

    }
/*
    ============================================================
    MÉTODO De DATOS de UBICACIÓN
    ============================================================
    

    const btnManualUbi = document.getElementById("option1")
    const btnUbiCoords = document.getElementById("option2")

    const formManual = document.getElementById("formManual")
    const formUbiCoords = document.getElementById("formUbiCoords")

    let metodoDatos = "";

    if (btnManualUbi && btnUbiCoords && formManual && formUbiCoords) {
        btnManualUbi.addEventListener("click", function () {
            // Click en Opción 1
            if (metodoDatos === "Coords") {
                // Si el método de Datos es Coordenadas desaparece
                // y se muestra el formManual
                metodoDatos = "Manual"

                formUbiCoords.classList.add("d-none");
                formManual.classList.remove("d-none");
            }
            
        })

        btnUbiCoords.addEventListener("click", function () {
            // Click en Opción 2
            if (metodoDatos === "Manual") {

                metodoDatos = "Coords"

                formManual.classList.add("d-none");
                formUbiCoords.classList.remove("d-none");
            }
        })
    }

*/

const btnManualUbi = document.getElementById("option1");
const btnUbiCoords = document.getElementById("option2");

const formManual = document.getElementById("formManual");
const formUbiCoords = document.getElementById("formUbiCoords");

let estadoUbi = "";


if (
    btnManualUbi &&
    btnUbiCoords &&
    formManual &&
    formUbiCoords
) {

    function actualizarFormularioUbicacion() {

        if (btnManualUbi.checked) {
            estadoUbi = "manual";

            // Mostrar formulario manual
            formManual.classList.remove("d-none");

            // Ocultar coordenadas
            formUbiCoords.classList.add("d-none");

        }

        else if (btnUbiCoords.checked) {
            estadoUbi = "coords"

            // Ocultar formulario manual
            formManual.classList.add("d-none");

            // Mostrar coordenadas
            formUbiCoords.classList.remove("d-none");

        }

    }


    // Cambio del radio 1
    btnManualUbi.addEventListener(
        "change",
        actualizarFormularioUbicacion
    );


    // Cambio del radio 2
    btnUbiCoords.addEventListener(
        "change",
        actualizarFormularioUbicacion
    );


    // Ejecutar una vez al cargar
    //actualizarFormularioUbicacion();

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

    const nombreElemento =
        producto.querySelector(".fw");

    if (!nombreElemento) {
        return;
    }

    const nombre =
        nombreElemento.innerText.trim();


    /*
    Obtener comentario del producto
    */

    const comentarioInput =
        producto.querySelector(".item-extras");

    const comentario =
        comentarioInput
            ? comentarioInput.value.trim()
            : "";


    /*
    Obtener presentaciones
    */

    const presentaciones =
        producto.querySelectorAll(".gramaje-group");


    presentaciones.forEach(function (grupo) {

        const cantidad =
            parseInt(grupo.dataset.quantity) || 0;


        if (cantidad <= 0) {
            return;
        }


        const gramos =
            grupo.dataset.gramos || "";


        const precio =
            parseFloat(grupo.dataset.price) || 0;


        const subtotal =
            cantidad * precio;


        total += subtotal;


        /*
        Crear detalle del producto
        */

        let detalle =
            `${cantidad}x ${nombre} - ${gramos} g = $${subtotal.toFixed(2)}`;


        /*
        Agregar comentario si existe
        */

        if (comentario) {
            detalle +=
                `\n   Comentario: ${comentario}`;
        }


        orderSummary.push(detalle);

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

                

            }


            /*
            ====================================================
            CREAR MENSAJE
            ====================================================
            */

            let mensaje =
                "Hola FloresPB.\n\n" +
                "Quisiera ordenar:\n\n" +
                orderSummary.join("\n") +
                "\n\n" +
                `Total: $${total.toFixed(2)}`;


            /*
            ====================================================
            DOMICILIO
            ====================================================
            */

            /*
============================================================
VALIDAR DOMICILIO
============================================================
*/

if (metodoPedido === "Domicilio") {

    /*
    ========================================================
    OPCIÓN MANUAL
    ========================================================
    */

    if (estadoUbi === "manual") {

        const calle =
            document.getElementById("calleDom")
            ?.value.trim();

        const entreCalles =
            document.getElementById("direccionDom")
            ?.value.trim();

        const referencia =
            document.getElementById("referenciaDomManual")
            ?.value.trim();


        if (
            !calle ||
            !entreCalles ||
            !referencia
        ) {

            alert(
                "Completa Calle, Entre calles y Referencia."
            );

            return;

        }


        mensaje +=
            "\n\nDirección:" +
            `\nCalle: ${calle}` +
            `\nEntre calles: ${entreCalles}` +
            `\nReferencia: ${referencia}`;

    }


    /*
    ========================================================
    OPCIÓN COORDENADAS
    ========================================================
    */

    else if (estadoUbi === "coords") {

        const referencia =
            document.getElementById("referenciaDomCoords")
            ?.value.trim();


        const ubicacion =
            document.getElementById("ubicacion")
            ?.value.trim();


        if (!ubicacion) {

            alert(
                "Primero debes pulsar 'Usar mi ubicación'."
            );

            return;

        }


        if (!referencia) {

            alert(
                "Escribe una referencia para la entrega."
            );

            return;

        }


        mensaje +=
            "\n\nUbicación:" +
            `\nhttps://www.google.com/maps?q=${ubicacion}` +
            `\nReferencia: ${referencia}`;

    }

}
            /*
            ENVIAR A WHATSAPP
            */

            const encodedMessage =
                encodeURIComponent(mensaje);


            window.open(
                `https://wa.me/5219902333473?text=${encodedMessage}`,
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