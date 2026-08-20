      (() => {
        const portraitSources = [
          "blossom-portrait-a",
          "blossom-portrait-b",
          "blossom-portrait-c",
          "blossom-portrait-d",
          "blossom-portrait-e"
        ];
        const portraitDots = document.getElementById("portrait-dots");

        if (portraitDots) {
          portraitDots.renderDot = (index, active) => {
            const button = document.createElement("button");
            const image = document.createElement("img");
            button.type = "button";
            button.className = "thumb-dot";
            button.dataset.active = String(active);
            image.src = `https://picsum.photos/seed/${portraitSources[index]}/120/84`;
            image.alt = "";
            button.appendChild(image);
            return button;
          };
        }

        document.querySelectorAll("[data-align]").forEach((button) => {
          button.addEventListener("click", () => {
            const alignment = button.dataset.align;
            const editorialCarousel = document.getElementById("editorial-carousel");
            if (!editorialCarousel) return;
            const slides = editorialCarousel.querySelectorAll("[data-blossom-slide]");
            slides.forEach((slide) => {
              slide.style.scrollSnapAlign = alignment;
            });
            document.querySelectorAll("[data-align]").forEach((control) => {
              control.setAttribute("aria-pressed", String(control === button));
            });
            const refreshMarker = document.createComment("refresh snap geometry");
            editorialCarousel.appendChild(refreshMarker);
            refreshMarker.remove();
            const activeButton = document.querySelector('.hero-dots [aria-current="true"]');
            const activeIndex = Number.parseInt(activeButton?.getAttribute("command")?.split("-").pop() || "0", 10);
            requestAnimationFrame(() => {
              slides[activeIndex]?.scrollIntoView({ behavior: "smooth", inline: alignment, block: "nearest" });
            });
          });
        });

        const portraitCarousel = document.getElementById("portrait-carousel");
        const commandReadout = document.getElementById("command-readout");
        let overscrollTimer;

        if (portraitCarousel && commandReadout) {
          portraitCarousel.addEventListener("command", (event) => {
            const command = event.command || event.detail?.command;
            if (command) commandReadout.textContent = command.replace("--blossom-", "");
          });

          portraitCarousel.addEventListener("overscroll", (event) => {
            event.preventDefault();
            portraitCarousel.classList.add("is-overscrolling");
            commandReadout.textContent = `edge ${Math.abs(event.detail.left).toFixed(1)}px`;
            clearTimeout(overscrollTimer);
            overscrollTimer = setTimeout(() => portraitCarousel.classList.remove("is-overscrolling"), 120);
          });
        }

        const liveCarousel = document.getElementById("live-carousel");
        const liveCount = document.getElementById("live-count");
        const removeButton = document.getElementById("remove-slide");
        const names = ["En Compras mayores a", "2x1 en Oz", "Descuento 20%", "15% en tu Primer Pedido", "Pedidos arriba de"];

        if (!liveCarousel || !liveCount || !removeButton) return;

        const updateLiveCount = () => {
          const count = liveCarousel.querySelectorAll("[data-blossom-slide]").length;
          liveCount.textContent = `${count} ${count === 1 ? "slide" : "slides"}`;
          removeButton.disabled = count <= 1;
        };

        /* Evento Click en Botón de Agregar Slide */
        document.getElementById("add-slide")?.addEventListener("click", () => {
          const count = liveCarousel.querySelectorAll("[data-blossom-slide]").length;
          const slide = document.createElement("article");
          slide.className = "live-slide";
          slide.setAttribute("data-blossom-slide", "");
          slide.innerHTML = `<p class="micro-label"> Promo ${String(count + 1).padStart(2, "0")}</p><strong>${names[count % names.length]}</strong><p>Compra 2 Oz y llevate la 3ra Totalmente Gratis.</p>`;
          liveCarousel.appendChild(slide);
          updateLiveCount();
          requestAnimationFrame(() => slide.scrollIntoView({ behavior: "smooth", inline: "end", block: "nearest" }));
        });

        removeButton.addEventListener("click", () => {
          const slides = liveCarousel.querySelectorAll("[data-blossom-slide]");
          if (slides.length > 1) slides[slides.length - 1].remove();
          updateLiveCount();
        });

        updateLiveCount();
      })();
