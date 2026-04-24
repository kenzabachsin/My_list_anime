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
let rawAnimeData = [];

async function fetchAndOrganize() {
    listContainer.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Organizing Folders...</p>";
    
    // 1. Ambil semua data
    for (const id of animeIds) {
        try {
            const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const json = await res.json();
            if (json.data) {
                // Tandai jika ada "Update" di komentar atau ID baru
                json.data.isNewUpdate = id === 61931 || id === 59424; // Contoh ID yang kamu labeli Update
                rawAnimeData.push(json.data);
            }
            await new Promise(r => setTimeout(r, 350));
        } catch (e) { console.error(e); }
    }

    renderFolderedList();
}

function renderFolderedList() {
    listContainer.innerHTML = "";
    
    // 2. Grouping berdasarkan Nama Dasar (Hapus S1, S2, dsb)
    const folders = {};
    rawAnimeData.forEach(anime => {
        // Logika hapus "Season", "S1", "Part" dll untuk nama folder
        const folderName = anime.title.split(/ (Season|S\d|Part|ova)/i)[0].trim();
        if (!folders[folderName]) folders[folderName] = { data: [], hasUpdate: false };
        folders[folderName].data.push(anime);
        if (anime.isNewUpdate) folders[folderName].hasUpdate = true;
    });

    // 3. Sorting: Update di atas, sisanya Abjad A-Z
    const sortedFolderNames = Object.keys(folders).sort((a, b) => {
        if (folders[a].hasUpdate && !folders[b].hasUpdate) return -1;
        if (!folders[a].hasUpdate && folders[b].hasUpdate) return 1;
        return a.localeCompare(b);
    });

    // 4. Render ke HTML
    sortedFolderNames.forEach(name => {
        const folder = folders[name];
        const mainImg = folder.data[0].images.jpg.large_image_url;
        const availableSeasons = folder.data.map(a => {
            if (a.title.includes("S2")) return "S2";
            if (a.title.includes("S3")) return "S3";
            if (a.title.includes("S4")) return "S4";
            if (a.title.includes("S5")) return "S5";
            return "S1";
        }).join(", ");

        const card = document.createElement('div');
        card.className = `card ${folder.hasUpdate ? 'border-update' : ''}`;
        card.innerHTML = `
            <div class="folder-tag">${folder.hasUpdate ? 'HOT UPDATE' : 'FOLDER'}</div>
            <img src="${mainImg}">
            <div class="card-info">
                <h3>${name}</h3>
                <small>Tersedia: ${availableSeasons}</small>
            </div>
        `;
        // Saat diklik, munculkan modal dengan list season di dalamnya
        card.onclick = () => showFolderDetail(name, folder.data);
        listContainer.appendChild(card);
    });
}

function showFolderDetail(title, seasons) {
    // Fungsi ini bisa kamu modif untuk nampilin isi folder di modal
    const content = seasons.map(s => `<div class="season-item">▶ ${s.title}</div>`).join("");
    document.getElementById('detail-konten').innerHTML = `<h2>${title}</h2><br>${content}`;
    document.getElementById('modal').style.display = "block";
}

fetchAndOrganize();