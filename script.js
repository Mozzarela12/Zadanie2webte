const DAY_NAMES = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok"];
const SOURCES = [
    {
        id: "eat-and-meet",
        name: "Eat & Meet",
        localUrl: "source/eat-and-meet.html",
        parse: parseEatAndMeet
    },
    {
        id: "drag",
        name: "DRAG",
        localUrl: "source/drag.html",
        parse: parseDrag
    },
    {
        id: "machnac",
        name: "Machnáč",
        localUrl: "source/machnac.html",
        parse: parseMachnac
    }
];

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
function parseDragItem(text, type, price = "") {
    let name = text.replace(/\s+/g, " ").trim();
    let allergens = "";
    let weight = null;

    const allergenPattern = /\/\s*(\d+(?:\s*,\s*\d+)*)\s*\/\s*$/;
    const allergenMatch = name.match(allergenPattern);

    if (allergenMatch) {
        allergens = allergenMatch[1].replace(/\s+/g, "");
        name = name.replace(allergenPattern, "").trim();
    }

    const weightPattern = /^\d+(?:[.,]\d+)?\s*(?:kg|g|ml|l)\b(?:\s*\/\s*\d+(?:[.,]\d+)?\s*(?:kg|g|ml|l)\b)*/i;
    const weightMatch = name.match(weightPattern);

    if (weightMatch) {
        weight = weightMatch[0].replace(/\s+/g, "");
        name = name.slice(weightMatch[0].length).replace(/^\.\s*/, "").trim();
    }

    return {
        type,
        name,
        price: price.replace(/\bEUR\b/gi, "€"),
        discountPrice: "",
        allergens,
        weight
    };
}

function parseDrag(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const dayIds = ["pondelok", "utorok", "streda", "stvrtok", "piatok"];

    const menu = DAY_NAMES.map((dayName, index) => {
        const dayElement = doc.querySelector("#" + dayIds[index]);
        const items = [];

        if (dayElement) {
            const soupHeading = Array.from(
                dayElement.querySelectorAll(".menu_box_title")
            ).find(element => getText(element).toLowerCase() === "polievka");

            let soupText = "";
            let node = soupHeading?.nextSibling;

            while (node) {
                if (
                    node.nodeType === 1 &&
                    node.matches(".menu_box_title, table, script")
                ) {
                    break;
                }

                if (node.nodeType === 1 || node.nodeType === 3) {
                    soupText += node.textContent;
                }

                node = node.nextSibling;
            }

            const soup = parseDragItem(soupText, "Polievka");

            if (soup.name) {
                items.push(soup);
            }

            dayElement.querySelectorAll("table tr").forEach(row => {
                const cells = row.querySelectorAll("td");

                const item = parseDragItem(
                    getText(cells[0]),
                    "Hlavné jedlo",
                    getText(cells[1])
                );

                if (item.name) {
                    items.push(item);
                }
            });
        }

        return { day: dayName, date: null, items };
    });

    if (menu.every(day => day.items.length === 0)) {
        throw new Error("V HTML súbore sa nenašlo menu DRAG.");
    }

    return menu;
}
function parseMachnac(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const menu = DAY_NAMES.map(day => ({ day, date: null, items: [] }));

    const prices = Array.from(doc.querySelectorAll(".denne_menu_ceny h4"))
        .map(getText)
        .filter(text => text.includes("€"));

    const mainPrice = prices
        .filter(text => text.toLowerCase().includes("hlavné jedlo"))
        .join(" / ");

    const soupPrice = prices.find(text =>
        text.toLowerCase().includes("menu polievka")
    ) || "";

    let currentDay = null;

    const elements = doc.querySelectorAll(
        ".menu-container .item-name, .menu-container .item-menu > h4"
    );

    elements.forEach(element => {
        if (element.matches(".item-name")) {
            const title = getText(element.querySelector("h2"));

            currentDay = menu.find(day =>
                title === day.day || title.startsWith(day.day + " ")
            ) || null;

            if (currentDay) {
                currentDay.date = title.slice(currentDay.day.length).trim() || null;
            }

            return;
        }

        let name = getText(element);

        if (!currentDay || !name) {
            return;
        }

        let weight = null;
        let allergens = "";

        const weightMatch = name.match(/^\(([^)]+)\)\s*/);

        if (weightMatch) {
            weight = weightMatch[1].trim();
            name = name.slice(weightMatch[0].length).trim();
        }

        const allergenMatch = name.match(/\s+(\d+(?:\s*,\s*\d+)*)$/);

        if (allergenMatch) {
            allergens = allergenMatch[1].replace(/\s+/g, "");
            name = name.slice(0, allergenMatch.index).trim();
        }

        if (!name) {
            return;
        }

        const isSoup = weight
            ? /(?:ml|l)$/i.test(weight)
            : currentDay.items.length === 0;

        currentDay.items.push({
            type: isSoup ? "Polievka" : "Hlavné jedlo",
            name,
            price: isSoup ? soupPrice : mainPrice,
            discountPrice: "",
            allergens,
            weight
        });
    });

    if (menu.every(day => day.items.length === 0)) {
        throw new Error("V HTML súbore sa nenašlo menu Machnáč.");
    }

    return menu;
}

function renderMenu(menu, dayIndex, container) {
    const day = menu[dayIndex];
    container.empty();
    const title = day.date ? `${day.day} ${day.date}` : day.day;

    container.append($("<h4>", {
        text: title,
        class: "menu-day"
    }));

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
        if (item.weight) {
            details.push("Množstvo: " + item.weight);
        }

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

async function loadRestaurant(source) {
    const container = $("#" + source.id + "-menu");
    const updated = $("#" + source.id + "-updated");

    container.text("Načítavam menu…");
    updated.empty();

    try {
        const html = await $.ajax({
            url: source.localUrl,
            dataType: "text",
            timeout: 10000
        });

        const menu = source.parse(html);
        renderMenu(menu, selectedDay, container);

        const updatedAt = new Date();

        updated.append(
            "Posledná aktualizácia: ",
            $("<time>", {
                datetime: updatedAt.toISOString(),
                text: updatedAt.toLocaleString("sk-SK")
            })
        );
    } catch (error) {
        const message = error?.message ||
            "Skontroluj súbor " + source.localUrl + ".";

        container.text(
            "Menu " + source.name + " sa nepodarilo načítať. " + message
        );
    }
}

$(async function () {
    $("#year").text(new Date().getFullYear());
    $("#status").text("Načítavam menu…");

    await Promise.all(SOURCES.map(loadRestaurant));

    $("#status").text("Zvolený deň: " + DAY_NAMES[selectedDay]);
});