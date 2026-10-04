export function initFilters() {
    document.querySelectorAll(".filters").forEach((filtersBlock) => {
        filtersBlock.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => {
                const section = filtersBlock.closest("section");
                const kind = button.dataset.kind;
                const isActive = button.classList.contains("active");

                filtersBlock.querySelectorAll("button").forEach((btn) => {
                    btn.classList.remove("active");
                });

                const cards = section.querySelectorAll(".dish-card");

                if (isActive) {
                    cards.forEach((card) => {
                        card.style.display = "";
                    });
                    return;
                }

                button.classList.add("active");

                cards.forEach((card) => {
                    if (card.dataset.kind === kind) {
                        card.style.display = "";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
    });
}