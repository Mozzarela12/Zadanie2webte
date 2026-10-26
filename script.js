const DAY_NAMES = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok"];

let selectedDay = new Date().getDay() - 1;

if (selectedDay < 0 || selectedDay > 4) {
    selectedDay = 0;
}

function getText(element) {
    return (element?.textContent || "").replace(/\s+/g, " ").trim();
}

function parseEatAndMeet(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");

    const menu = DAY_NAMES.map((dayName, index) => {
        const dayElement = doc.querySelector(`#day-${index + 1}`);
        const meals = dayElement ? dayElement.querySelectorAll(".menu-body") : [];
        const items = [];

        meals.forEach(meal => {
            const description = meal.querySelector(".menu-description .desc");

            if (!description) {
                return;
            }

            const allergens = getText(description.querySelector("span"))
                .replace(/[()]/g, "");

            const nameElement = description.cloneNode(true);
            nameElement.querySelectorAll("span").forEach(span => span.remove());
            const name = getText(nameElement);

            if (!name) {
                return;
            }

            const prices = getText(meal.querySelector(".price"))
                .split("/")
                .map(price => price.trim());

            items.push({
                type: getText(meal.querySelector(".menu-title h4")) || "Jedlo",
                name,
                price: prices[0] || "",
                discountPrice: prices[1] || "",
                allergens,
                weight: null
            });
        });

        return { day: dayName, date: null, items };
    });

    if (menu.every(day => day.items.length === 0)) {
        throw new Error("V HTML súbore sa nenašlo menu Eat & Meet.");
    }

    return menu;
}

function renderMenu(menu, dayIndex, container) {
    const day = menu[dayIndex];
    container.empty();
    container.append($("<h4>", { text: day.day, class: "menu-day" }));

    if (day.items.length === 0) {
        container.append($("<p>", {
            text: "Menu na tento deň nie je k dispozícii."
        }));
        return;
    }

    const list = $("<ul>", { class: "menu-list" });

    day.items.forEach(item => {
        const row = $("<li>", { class: "menu-item" });

        row.toggleClass("soup", item.type.toLowerCase().startsWith("polievka"));

        row.append($("<p>", { class: "menu-type", text: item.type }));
        row.append($("<p>", { class: "menu-name", text: item.name }));
        row.append($("<p>", {
            class: "menu-price",
            text: item.price || "Cena neuvedená"
        }));

        const details = [];

        if (item.discountPrice) {
            details.push("S dotáciou: " + item.discountPrice);
        }

        if (item.allergens) {
            details.push("Alergény: " + item.allergens);
        }

        if (details.length > 0) {
            row.append($("<p>", {
                class: "menu-details",
                text: details.join(" · ")
            }));
        }

        list.append(row);
    });

    container.append(list);
}

async function loadEatAndMeet() {
    const container = $("#eat-and-meet-menu");
    container.text("Načítavam menu…");

    try {
        const html = await $.ajax({
            url: "source/eat-and-meet.html",
            dataType: "text",
            timeout: 10000
        });

        const menu = parseEatAndMeet(html);
        renderMenu(menu, selectedDay, container);

        $("#status").text("Zobrazený deň: " + DAY_NAMES[selectedDay]);

        const updatedAt = new Date();

        $("#eat-and-meet-updated").empty().append(
            "Posledná aktualizácia: ",
            $("<time>", {
                datetime: updatedAt.toISOString(),
                text: updatedAt.toLocaleString("sk-SK")
            })
        );
    } catch (error) {
        const message = error?.message ||
            "Skontroluj súbor source/eat-and-meet.html.";

        container.text("Menu sa nepodarilo načítať. " + message);
        $("#status").text("Menu Eat & Meet nie je dostupné.");
    }
}

$(function () {
    $("#year").text(new Date().getFullYear());
    loadEatAndMeet();
});