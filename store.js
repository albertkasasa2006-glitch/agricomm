/* Agricomm shared helpers.
   Products are saved in the browser (localStorage) so the Sell page and
   the Buy page can share them without a server. */

const KEY_PRODUCTS = "agricomm_products";
const KEY_CART = "agricomm_cart";
const KEY_FAVS = "agricomm_favs";

const CATEGORIES = [
    "Vegetables",
    "Fruits",
    "Grains & Cereals",
    "Livestock & Poultry",
    "Dairy & Eggs",
    "Coffee & Cash Crops",
    "Seeds & Inputs",
    "Other"
];

function loadList(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        return [];
    }
}

function saveList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

function formatUGX(n) {
    return "UGX " + Number(n).toLocaleString("en-US");
}

/* Stops text typed by farmers from being read as HTML */
function esc(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

/* Turns 0772123456 or +256 772 123 456 into 256772123456 for WhatsApp links */
function toWhatsAppNumber(phone) {
    let digits = String(phone).replace(/\D/g, "");
    if (digits.startsWith("0")) digits = "256" + digits.slice(1);
    return digits;
}

/* Shrinks a photo so many products fit in browser storage */
function fileToSmallImage(file, maxSide = 800, quality = 0.75) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not read the photo"));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error("That file is not a valid image"));
            img.onload = () => {
                const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}
