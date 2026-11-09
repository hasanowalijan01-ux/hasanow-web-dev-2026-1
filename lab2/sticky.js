import { getTotalPrice, isValidCombo } from "./cart.js";

export function updateStickyPanel() {
    const panel = document.getElementById("sticky-panel");
    const totalEl = document.getElementById("sticky-total");
    const link = document.getElementById("checkout-link");

    if (!panel || !totalEl || !link) return;

    const total = getTotalPrice();
    const hasItems = total > 0;

    if (hasItems) {
        panel.style.display = "flex";
        totalEl.textContent = `${total} ₽`;
        
        if (isValidCombo()) {
            link.classList.remove("disabled");
            link.removeAttribute("aria-disabled");
        } else {
            link.classList.add("disabled");
            link.setAttribute("aria-disabled", "true");
        }
    } else {
        panel.style.display = "none";
    }
}