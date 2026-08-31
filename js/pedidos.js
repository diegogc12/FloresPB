document.addEventListener('DOMContentLoaded', function () {

    const totalDisplay = document.getElementById('totalDisplay');
    const confirmBtn = document.getElementById('confirmOrder');

    let metodoPedido = "";

    /*
    =====================================================
    MÉTODO DE PEDIDO
    =====================================================
    */

    const btnDomicilio = document.getElementById("btnDomicilio");
    const formDomicilio = document.getElementById("formDomicilio");

    btnDomicilio.addEventListener("click", () => {

        if (metodoPedido === "Domicilio") {

            formDomicilio.classList.add("d-none");
            btnDomicilio.classList.remove("btn-rosa");

            metodoPedido = "";

        } else {

            metodoPedido = "Domicilio";

            formDomicilio.classList.remove("d-none");
            btnDomicilio.classList.add("btn-rosa");

        }

    });


    /*
    =====================================================
    PRESENTACIONES / GRAMAJES
    =====================================================
    */

    document.querySelectorAll('.gramaje-group').forEach(group => {

        const chip = group.querySelector('.gramaje-chip');
        const botones = group.querySelectorAll('.gramaje-btn');

        group.dataset.quantity = "0";

        chip.addEventListener('click', () => {

            group.classList.toggle('active');

            if (!group.classList.contains('active')) {
                group.dataset.quantity = "0";
            }

            updateTotal();

        });


        botones.forEach(btn => {

            btn.addEventListener('click', function (e) {

                e.stopPropagation();

                this

                let cantidad =
                    parseInt(group.dataset.quantity) || 0;

                const accion =
                    this.dataset.action;

                if (accion === "plus") {
                

                    cantidad++;

                } else {

                    cantidad = Math.max(0, cantidad - 1);

                }


                group.dataset.quantity = cantidad;


                if (cantidad > 0) {

                    group.classList.add("active");

                } else {

                    group.classList.remove("active");

                }

                updateTotal();

            });

        });

    });


    /*
    =====================================================
    CALCULAR TOTAL
    =====================================================
    */

    function updateTotal() {

        let total = 0;

        document.querySelectorAll('.gramaje-group.active')
            .forEach(group => {

                const cantidad =
                    parseInt(group.dataset.quantity) || 0;

                const precio =
                    parseFloat(group.dataset.price) || 0;

                total += cantidad * precio;

            });

        totalDisplay.innerText =
            `$${total.toFixed(2)}`;

    }

    /*

    Acutalizo Pedidos

    */

    function actualizarCantidadProducto(producto) {

    let cantidadTotal = 0;

    producto.querySelectorAll('.gramaje-group').forEach(gramaje => {

        const cantidad =
            parseInt(gramaje.dataset.quantity) || 0;

        cantidadTotal += cantidad;
    });

    const qtyInput =
        producto.querySelector('.qty-input');

    if (qtyInput) {
        qtyInput.value = cantidadTotal;
    }

    
}


    /*
    =====================================================
    ENVIAR PEDIDO
    =====================================================
    */

    confirmBtn.addEventListener('click', function () {

        let orderSummary = [];
        let total = 0;


        /*
        Agrupar por producto
        */

        document.querySelectorAll('.list-group-item')
            .forEach(producto => {

                const nombre =
                    producto.querySelector('.fw')?.innerText.trim();

                if (!nombre) return;


                const presentaciones =
                    producto.querySelectorAll('.gramaje-group.active');


                presentaciones.forEach(group => {

                    const cantidad =
                        parseInt(group.dataset.quantity) || 0;

                    const gramos =
                        group.dataset.gramos;

                    const precio =
                        parseFloat(group.dataset.price) || 0;


                    if (cantidad > 0) {

                        const subtotal =
                            cantidad * precio;


                        orderSummary.push(
                            `${cantidad}x ${nombre} - ${gramos} g = $${subtotal.toFixed(2)}`
                        );


                        total += subtotal;

                    }

                });

            });


        /*
        No hay productos
        */

        if (orderSummary.length === 0) {

            alert("Por favor selecciona al menos una presentación.");

            return;

        }


        /*
        Método de pedido
        */

        if (metodoPedido === "") {

            alert(
                "Por favor selecciona un método de pedido."
            );

            return;

        }


        /*
        Crear mensaje
        */

        let mensaje =
            "Hola, buenas noches.\n\n" +
            "Quisiera ordenar:\n\n" +
            orderSummary.join("\n") +
            "\n\n" +
            `Total: $${total.toFixed(2)}`;


        /*
        DOMICILIO
        */

        if (metodoPedido === "Domicilio") {

            const nombre =
                document.getElementById("nombreDom").value.trim();

            const telefono =
                document.getElementById("telefonoDom").value.trim();

            const calle =
                document.getElementById("calleDom").value.trim();

            const entreCalles =
                document.getElementById("direccionDom").value.trim();

            const referencia =
                document.getElementById("referenciaDom").value.trim();


            if (
                nombre === "" ||
                calle === "" ||
                telefono === "" ||
                telefono.length !== 10 ||
                entreCalles === "" ||
                referencia === ""
            ) {

                alert(
                    "Completa correctamente los datos de entrega."
                );

                return;

            }


            mensaje +=
                `\n\nEntrega a domicilio` +
                `\nNombre: ${nombre}` +
                `\nTeléfono: ${telefono}` +
                `\nCalle: ${calle}` +
                `\nEntre calles: ${entreCalles}` +
                `\nReferencia: ${referencia}`;

        }


        /*
        ENVIAR A WHATSAPP
        */

        const encodedMessage =
            encodeURIComponent(mensaje);


        window.open(
            `https://wa.me/5219871161465?text=${encodedMessage}`,
            '_blank'
        );

    });

});