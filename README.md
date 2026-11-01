# Obedové menu v okolí FEI STU

Autor: Samuel Hrdlička

Školský projekt na zobrazenie obedového menu troch reštaurácií v okolí FEI STU. Aplikácia používa HTML, CSS a JavaScript a funguje na strane klienta.

## Spustenie

Projekt otvorte vo WebStorme a súbor `index.html` spustite pomocou Open in Browser cez lokálny HTTP server. Stránku spúšťajte cez HTTP, nie priamym otvorením súboru cez `file://`.

Na načítanie knižníc Bootstrap a jQuery z CDN je potrebné internetové pripojenie.

## Zdroje menu

- Eat & Meet: https://eatandmeet.sk/tyzdenne-menu
- DRAG: https://www.restauracia-drag.sk/restauracia-drag
- Machnáč: https://machnac.sk/denneMenu.html

Lokálne HTML kópie zdrojových stránok sú uložené v priečinku `source`.

## Spracovanie údajov

HTML súbory sa načítavajú asynchrónne pomocou jQuery AJAX. DOMParser vytvorí dokument, z ktorého samostatný parser pre každú reštauráciu vyberie potrebné údaje.

Eat & Meet sa spracúva zo sekcií dní a položiek menu, DRAG z nadpisov a tabuliek a Machnáč z blokov denného menu.

Údaje sa prevedú do jednotnej štruktúry dní a jedál. Spracúvajú sa názvy jedál, typy položiek, ceny a dostupné dátumy, alergény a množstvá. Cudzí HTML kód sa nevkladá priamo do stránky.

## Ovládanie

Používateľ si môže vybrať deň od pondelka do piatka alebo zobraziť celý týždeň. Pri otvorení stránky je zvolený aktuálny pracovný deň, cez víkend pondelok.

Checkboxy umožňujú zobraziť alebo skryť jednotlivé reštaurácie. Prepínanie dní a filtrovanie prebieha bez obnovenia stránky.

Tlačidlo Aktualizovať menu vynúti nové načítanie a spracovanie lokálnych HTML súborov. Tlačidlo Vymazať údaje odstráni uložené aj zobrazené menu.

Pri každej reštaurácii sa zobrazuje dátum a čas poslednej aktualizácie. Počas načítania sa zobrazuje informácia o jeho priebehu.

## Ukladanie údajov

Spracované menu sa ukladá do localStorage samostatne pre každú reštauráciu spolu s časom uloženia.

Ak sú údaje uložené v aktuálny deň, pri ďalšom otvorení stránky sa použijú bez opätovného načítania zdrojového súboru. Staršie údaje sa nahradia novým načítaním.

Nové jedlá sa zobrazia po nahradení súborov v priečinku `source` aktuálnymi HTML kópiami a kliknutí na Aktualizovať menu.

## Ošetrenie chýb

Pri nedostupnom súbore alebo nerozpoznanej štruktúre sa zobrazí chybová správa pri príslušnej reštaurácii. Ostatné reštaurácie sa načítajú nezávisle.

Ak menu na vybraný deň chýba, zobrazí sa informácia o jeho nedostupnosti. Chýbajúca cena sa označí textom Cena neuvedená.

## Použité knižnice a font

- Bootstrap 5.3.8 – štýly ovládacích prvkov a kariet, licencia MIT: https://getbootstrap.com/
- jQuery 4.0.0 – AJAX, udalosti a práca s DOM, licencia MIT: https://jquery.com/
- Inter – lokálny font vo formáte WOFF2, licencia SIL Open Font License 1.1: https://rsms.me/inter/

Font sa načítava pomocou `@font-face`. Súbor fontu je `fonts/InterVariable.woff2` a text jeho licencie je uložený v `fonts/LICENSE.txt`.

## Validácia

HTML sa overuje pomocou https://validator.w3.org/ a CSS pomocou https://jigsaw.w3.org/css-validator/.

Výstupy z oboch validátorov treba uložiť do priečinka `docs`.

## Použitie AI

Pri návrhu riešenia, vysvetľovaní a tvorbe častí kódu bol použitý ChatGPT.
