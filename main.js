const buttonI = document.getElementById("button");
const output = document.getElementById("output");
const formUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const converterProperty = {
    length: [
        "kilometer",
        "hektometer",
        "dekameter",
        "meter",
        "desimeter",
        "centimeter",
        "milimeter",
    ],
    weight: [
        "kilogram",
        "hektogram",
        "dekagram",
        "gram",
        "desigram",
        "centigram",
        "miligram",
    ],
    time: [
        "hour",
        "minute",
        "second"
    ],
    temperature: [
        "Fahrenheit",
        "Kelvin",
        "Celsius",
    ]
};

class unitConverter {
    constructor() {
        this.unit = {
            length: {
                kilometer: 1000,
                hektometer: 100,
                dekameter: 10,
                meter: 1,
                desimeter: 0.1,
                centimeter: 0.01,
                milimeter: 0.001,
            },
            weight: {
                kilogram: 1000,
                hektogram: 100,
                dekagram: 10,
                gram: 1,
                desigram: 0.1,
                centigram: 0.01,
                miligram: 0.001,
            },
            time: {
                hour: 3600,
                minute: 60,
                second: 1,
            },
            temperature: {},
        }
        this.tempUnits = ["Celsius", "Fahrenheit", "Kelvin"];
    }

    #getCategory(fromUnit) {
        if (this.tempUnits.includes(fromUnit)) return "temperature"; // Cek manual untuk suhu
        return Object.keys(this.unit).find(cat => fromUnit in this.unit[cat]) || null;
    }

    convert(value, fromUnit, toUnit) {
        const category = this.#getCategory(fromUnit);
        if (!category) {
            throw new Error("Satuan tidak ditemukan dalam kategori mana pun");
        }

        if (category === "temperature") {
            if (fromUnit === "Celsius" && toUnit === "Fahrenheit") {
                return (value * 9/5) + 32;
            }
            if (fromUnit === "Fahrenheit" && toUnit === "Celsius") {
                return (value - 32) * 5/9;
            }
            if (fromUnit === "Celsius" && toUnit === "Kelvin") {
                return value + 273.15;
            }
            if (fromUnit === "Kelvin" && toUnit === "Celsius") {
                return value - 273.15;
            }
            if (fromUnit === "Kelvin" && toUnit === "Fahrenheit") {
                return (value - 273.15) * 9/5 + 32;
            } if (formUnit === "Fahrenheit" && toUnit === "Kelvin") {
                return (value - 32) * 5/9 + 273.15
            }
            throw new Error("Konversi suhu tidak valid");
        }
    
        // Cek apakah toUnit ada dalam kategori yang sama
        if (!(toUnit in this.unit[category])) {
            throw new Error("Satuan tujuan tidak valid dalam kategori ini");
        }
    
        return (value * this.unit[category][fromUnit]) / this.unit[category][toUnit];
    }
    
}

const converter = new unitConverter();

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-btn")) {
        const selectedCategory = e.target.dataset.category;
        updateUnitOptions(selectedCategory);
    }
});

function updateUnitOptions(category) {
    const unitSelects = [formUnit, toUnit];
    console.log("mengubah unit ke => ", category);
    unitSelects.forEach((select) => {
        select.innerHTML = converterProperty[category].map((unit) => `<option value="${unit}">${unit}</option>`).join(" ");
    });
}

buttonI.addEventListener("click", (event) => {
    event.preventDefault();
    const value = Number(document.getElementById("input").value);
    const formUnit = document.getElementById("from-unit").value;
    const toUnit = document.getElementById("to-unit").value;
    const hasil = converter.convert(value, formUnit, toUnit);
    if (hasil < 0) {
        return (output.innerHTML = `Hasil: ${hasil} ${toUnit}`);
    }
    return (output.innerHTML = `Hasil: ${hasil.toLocaleString(
        "id-ID"
    )} ${toUnit}`);
});

const bubble = document.querySelector(".chat-bubble");
const maskot = document.querySelector(".assistant-img");
const textBubble = [
    "Halo butuh bantuan konversi?👾",
    "Masukkan angka & pilih satuan, lalu klik Convert!",
    "[SYSTEM ONLINE] Konversi data siap!✅",
    "Ingin tahu lebih banyak? Lihat halaman <span>bantuan!</span>",
    "Panjang? Massa? Waktu? Aku bisa bantu!🔍",
    "⚙️ Memproses… konversi dalam hitungan detik!",
    "Aku bisa mengubah meter ke centimeter, kilogram ke gram, dan banyak lagi!🚀",
]

let hideTimeout;
let lastTextIndex = -1;

maskot.addEventListener("click", () => {
    // Pastikan bubble reset agar tidak spam efek animasi
    bubble.classList.remove("show");

    setTimeout(() => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * textBubble.length);
        } while (newIndex === lastTextIndex); // Ulangi jika sama dengan sebelumnya

        lastTextIndex = newIndex; // Simpan teks terakhir yang ditampilkan
        bubble.innerHTML = textBubble[newIndex];

        if (bubble.textContent.includes("bantuan")) {
            bubble.addEventListener("click", () => {
                window.location.href = "help/bantuan.html";
            });
        }

        bubble.classList.add("show");
        clearTimeout(hideTimeout);

        hideTimeout = setTimeout(() => {
        bubble.classList.remove("show");
    }, 5000);
}, 300);
});