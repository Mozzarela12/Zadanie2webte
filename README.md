# Obedové menu v okolí FEI STU

# Autor: Samuel Hrdlička

# 

# Školský projekt na zobrazenie obedového menu troch reštaurácií v okolí FEI STU. Aplikácia používa HTML, CSS a JavaScript a pracuje na strane klienta.

# Spustenie

# Projekt otvorte vo WebStorme a súbor index.html spustite pomocou Open in Browser cez lokálny HTTP server.

# 

# Stránku otvárajte cez adresu http://localhost, nie priamo cez file://.

# 

# Na načítanie knižníc Bootstrap a jQuery z CDN je potrebné internetové pripojenie.

# Zdroje menu

# \- Eat \& Meet

# \- DRAG

# \- Machnáč

# Lokálne HTML kópie sú uložené v priečinku source.

# Spracovanie údajov

# HTML súbory sa načítavajú asynchrónne pomocou jQuery AJAX. DOMParser vytvorí dokument, z ktorého samostatné parsery vyberú údaje pre jednotlivé reštaurácie.

# 

# Eat \& Meet sa spracúva zo sekcií dní a položiek menu, DRAG z nadpisov a tabuliek a Machnáč z blokov denného menu.

# 

# Výsledkom je jednotná štruktúra dní a jedál. Spracúvajú sa názvy, typy jedál, ceny a dostupné dátumy, alergény a množstvá. Cudzí HTML kód sa nevkladá priamo do stránky.

# Ovládanie a ukladanie

# \- Výber dňa od pondelka do piatka alebo celého týždňa.

# \- Predvolený je aktuálny pracovný deň, cez víkend pondelok.

# \- Checkboxy umožňujú zobraziť alebo skryť reštaurácie.

# \- Spracované údaje sa ukladajú do localStorage pre každú reštauráciu.

# \- Údaje uložené dnes sa pri ďalšom otvorení použijú bez načítania zdroja.

# \- Aktualizovať menu vynúti nové načítanie lokálnych HTML súborov.

# \- Vymazať údaje odstráni uložené aj zobrazené menu.

# \- Pri každej reštaurácii sa zobrazuje čas poslednej aktualizácie.

# Nové jedlá sa zobrazia po nahradení súborov v priečinku source aktuálnymi HTML kópiami a následnej aktualizácii menu.

# Knižnice a font

# \- Bootstrap 5.3.8 – licencia MIT.

# \- jQuery 4.0.0 – licencia MIT.

# \- Inter – licencia SIL Open Font License 1.1.

# Font je uložený lokálne vo formáte WOFF2 a načítaný cez @font-face. Text licencie fontu je v súbore fonts/LICENSE.txt.

# Validácia

# Výsledky validácie HTML a CSS sú uložené v priečinku docs.

# Použitie AI

# Pri návrhu riešenia, vysvetľovaní a tvorbe častí kódu bol použitý ChatGPT.

