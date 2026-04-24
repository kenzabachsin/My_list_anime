// Validasi List ID Anime (60+ Judul)
const animeIds = [
    38790, // Bofuri
    41514, // Bofuri S2
    53446, // Tondemo Skill de Isekai Hourou Meshi
    57025, // Tondemo skill de isekai hourou meshi S2
    54714, // Hyakkano (100 Girlfriends)
    57616, // Hyakkano (100 Girlfriends) S2
    42923, // Sk8 the Infinity
    49363,
    57719, // Akuyaku Reijou Tensei Ojisan
    58172, // Nageki no Bourei wa Intai Shitai
    60619, // Nageki no Bourei wa Intai Shitai
    53516, // Tensei shitara Dainana Ouji
    59095,
    40397, // Maoujou de Oyasumi
    40750, // Kaifuku Jutsushi no Yarinaoshi
    48239, // Leadale no Daichi nite
    48316, //Kage_no_Jitsuryokusha_ni_Naritakute
    54595,
    57584, // Kage_no_Jitsuryokusha_ni_Naritakute_Movie__Zankyou-hen
    39196, // Mairimashita! Iruma-kun
    41402,
    49784,
    60310,
    19815, // No Game No Life
    54900, // Wind Breaker
    59160,
    38555, // Bakarina (Hametsu Flag)
    42282,
    57891, // Hitoribocchi no Isekai Kouryaku
    51462, // Isekai Nonbiri Nouka
    62146,
    35790, // Tate no Yuusha no Nariagari
    40356,
    40357,
    57907,
    59130, //IsekaiMokushirokuMynoghra
    50220, //Isekai_Shoukan_wa_Nidome_desu
    18507, //Free
    50273, // Tomodachi Game
    54837, // Akuyaku Reijou Level 99
    53438, // Higeki no Genkyou S1
    61931, // Higeki no Genkyou S2 (Update)
    50461, // Otome Game Isekai (Mobsekai)
    60154, // Ore Wa Seikan Kokka
    58714, // Saikyou no Shienshoku
    52305, // Tomo-chan wa Onnanoko!
    58913, // Hikaru ga Shinda Natsu
    57533, // Youkai Gakkou no Sensei
    61174, // Souzai Saishuka no Isekai
    59205, // Clevatess
    52962, // Tearmoon Teikoku
    60303, // Shinjiteita Nakama
    58939, // Sakamoto Days (Part 1)
    60285, // Sakamoto Days (Part 2)
    43523, // Tsuki ga Michibiku S1
    49889, // Tsuki ga Michibiku S2
    56923, // Lv2 Kara Cheat S1
    59424, // Lv2 Kara Cheat S2 (Update)
    60810, // Majutsushi Kunon
    60071, // A Gentle Noble's Vacation
    61549, // Okiraku Ryouchi
    41710, // Genjitsu Shugi Yuusha S1
    49930, // Genjitsu Shugi Yuusha S2
    58146, // Tensei Akujo no Kuro Rekishi
    28171, // Shokugeki no Souma S1
    32282, // Shokugeki no Souma S2
    35788, // Shokugeki no Souma S3
    39940, // Shokugeki no Souma S4
    40902  // Shokugeki no Souma S5
];

const listContainer = document.getElementById('anime-list');
const modal = document.getElementById('modal');
const detailKonten = document.getElementById('detail-konten');
const fabMenu = document.getElementById('fab-menu');
const subMenuJadwal = document.getElementById('sub-menu-jadwal');

let rawAnimeData = [];

async function fetchSemuaAnime() {
    listContainer.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Membangun Database Folder...</p>";
    
    for (const id of animeIds) {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const json = await response.json();
            if (json.data) {
                // Tentukan ID mana yang dianggap "HOT UPDATE"
                json.data.isNewUpdate = (id === 61931 || id === 59424 || id === 62146); 
                rawAnimeData.push(json.data);
            }
            await new Promise(res => setTimeout(res, 350)); 
        } catch (err) { console.error(err); }
    }
    renderFolderedList();
}

function renderFolderedList(filterSeason = 'all') {
    listContainer.innerHTML = "";
    const folders = {};

    const filteredData = filterSeason === 'all' 
        ? rawAnimeData 
        : rawAnimeData.filter(a => a.season && a.season.toLowerCase() === filterSeason);

   filteredData.forEach(anime => {
        // --- LOGIKA PEMBERSIH JUDUL OTOMATIS (UNIVERTAL) ---
        let cleanName = anime.title
            // 1. Hapus semua tulisan di dalam kurung (misal: (TV), (Official), dll)
            .replace(/\s*\([^)]*\)/g, "")
            // 2. Hapus kata-kata penanda season/part dan semua teks setelahnya
            .replace(/\s*(Season|S\d+|Part|\d+(st|nd|rd|th)|2nd|II|III|IV|V|ova|movie|2|3|4|5).*/i, "")
            // 3. Hapus simbol titik dua atau strip yang biasanya memisah judul utama dan sub-judul
            .split(':')[0]
            .split(' - ')[0]
            .trim();

        // Jika setelah dibersihkan namanya jadi kosong (jarang terjadi), balik ke judul asli
        if (!cleanName) cleanName = anime.title;

        // Simpan ke folder
        if (!folders[cleanName]) {
            folders[cleanName] = { data: [], hasUpdate: false };
        }
        folders[cleanName].data.push(anime);
        
        if (anime.isNewUpdate) folders[cleanName].hasUpdate = true;
    });
    // Sort: Hot Update dulu, baru Abjad
    const sortedNames = Object.keys(folders).sort((a, b) => {
        if (folders[a].hasUpdate && !folders[b].hasUpdate) return -1;
        if (!folders[a].hasUpdate && folders[b].hasUpdate) return 1;
        return a.localeCompare(b);
    });

    sortedNames.forEach(name => {
        const folder = folders[name];
        const mainImg = folder.data[0].images.jpg.large_image_url;
        
        // Deteksi label season
        const seasons = folder.data.map(a => {
            const t = a.title.toLowerCase();
            if (t.includes("s2") || t.includes("2nd") || t.includes("ii")) return "S2";
            if (t.includes("s3") || t.includes("3rd") || t.includes("iii")) return "S3";
            if (t.includes("ova")) return "OVA";
            if (t.includes("movie")) return "MOV";
            return "S1";
        });
        const labels = [...new Set(seasons)].sort();

        const card = document.createElement('div');
        card.className = `card ${folder.hasUpdate ? 'border-update' : ''}`;
        card.innerHTML = `
            <div class="folder-tag">${folder.hasUpdate ? '🔥 HOT UPDATE' : '📁 FOLDER'}</div>
            <img src="${mainImg}" loading="lazy">
            <div class="card-info">
                <h3>${name}</h3>
                <small>Tersedia: ${labels.join(", ")}</small>
            </div>
        `;
        card.onclick = () => showFolderDetail(name, folder.data);
        listContainer.appendChild(card);
    });
}

function showFolderDetail(name, data) {
    let html = `<h2>${name}</h2><div style="margin-top:20px">`;
    data.forEach(s => {
        html += `
            <div class="season-item" onclick="window.open('https://myanimelist.net/anime/${s.mal_id}')">
                <img src="${s.images.jpg.small_image_url}" width="40">
                <span>${s.title} (⭐ ${s.score || 'N/A'})</span>
            </div>`;
    });
    html += `</div>`;
    detailKonten.innerHTML = html;
    modal.style.display = "block";
}

// Handler Balon
document.getElementById('fab-main').onclick = () => fabMenu.classList.toggle('active');
window.toggleSubMenu = () => subMenuJadwal.classList.toggle('active');
window.filterAnime = (s) => {
    renderFolderedList(s);
    fabMenu.classList.remove('active');
    subMenuJadwal.classList.remove('active');
};

fetchSemuaAnime();