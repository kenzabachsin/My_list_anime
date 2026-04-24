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
const closeBtn = document.querySelector('.close');
const detailKonten = document.getElementById('detail-konten');
const fabMain = document.getElementById('fab-main');
const fabMenu = document.getElementById('fab-menu');
const subMenuJadwal = document.getElementById('sub-menu-jadwal');

let rawAnimeData = []; // Tempat simpan data asli dari API

/**
 * 1. FUNGSI AMBIL DATA (FETCH)
 */
async function fetchSemuaAnime() {
    listContainer.innerHTML = "<p style='text-align:center; grid-column: 1/-1; color: #e94560;'>Membangun Folder Database...</p>";
    
    for (const id of animeIds) {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const json = await response.json();
            
            if (json.data) {
                // Logika Update: Jika ID adalah ID tertentu (misal ID baru), tandai sebagai Update
                // Di sini kita contohkan ID 61931 dan 59424 sebagai update baru
                json.data.isNewUpdate = (id === 61931 || id === 59424); 
                rawAnimeData.push(json.data);
            }
            // Delay 350ms agar tidak kena limit API
            await new Promise(res => setTimeout(res, 350)); 
        } catch (err) {
            console.error("Error ID " + id + ":", err);
        }
    }
    renderFolderedList();
}

/**
 * 2. FUNGSI PENGELOMPOKKAN FOLDER & RENDER
 */
function renderFolderedList(filterSeason = 'all') {
    listContainer.innerHTML = "";
    const folders = {};

    // Filter berdasarkan musim jika dipilih lewat balon
    const filteredData = filterSeason === 'all' 
        ? rawAnimeData 
        : rawAnimeData.filter(a => a.season && a.season.toLowerCase() === filterSeason);

    // Grouping: Menggabungkan season ke dalam satu nama folder
    filteredData.forEach(anime => {
        let folderName = anime.title
            .replace(/ (Season|S\d|Part|ova|Movie|2nd|3rd|4th|5th|I|II|III|IV|V).*/i, "")
            .replace(/[:]/g, "")
            .trim();

        if (!folders[folderName]) {
            folders[folderName] = { data: [], hasUpdate: false };
        }
        folders[folderName].data.push(anime);
        if (anime.isNewUpdate) folders[folderName].hasUpdate = true;
    });

    // Sorting: Update paling atas, sisanya urut Abjad A-Z
    const sortedFolderNames = Object.keys(folders).sort((a, b) => {
        if (folders[a].hasUpdate && !folders[b].hasUpdate) return -1;
        if (!folders[a].hasUpdate && folders[b].hasUpdate) return 1;
        return a.localeCompare(b);
    });

    // Gambar Folder ke layar
    sortedFolderNames.forEach(name => {
        const folder = folders[name];
        const mainImg = folder.data[0].images.jpg.large_image_url;
        
        // Cek Season yang tersedia
        const seasonLabels = folder.data.map(a => {
            const t = a.title.toLowerCase();
            if (t.includes("s2") || t.includes("2nd") || t.includes("ii")) return "S2";
            if (t.includes("s3") || t.includes("3rd") || t.includes("iii")) return "S3";
            if (t.includes("s4") || t.includes("4th") || t.includes("iv")) return "S4";
            if (t.includes("s5") || t.includes("5th") || t.includes("v")) return "S5";
            if (t.includes("ova")) return "OVA";
            return "S1";
        });
        const uniqueSeasons = [...new Set(seasonLabels)].sort();

        const card = document.createElement('div');
        card.className = `card ${folder.hasUpdate ? 'border-update' : ''}`;
        card.innerHTML = `
            <div class="folder-tag">${folder.hasUpdate ? '🔥 HOT UPDATE' : '📁 FOLDER'}</div>
            <img src="${mainImg}" loading="lazy">
            <div class="card-info">
                <h3>${name}</h3>
                <small>Tersedia: ${uniqueSeasons.join(", ")}</small>
            </div>
        `;
        card.onclick = () => showFolderDetail(name, folder.data);
        listContainer.appendChild(card);
    });
}

/**
 * 3. LOGIKA DETAIL FOLDER (MODAL)
 */
function showFolderDetail(folderName, seasons) {
    let content = `<h2 style="color: #e94560; margin-bottom: 20px;">${folderName}</h2>`;
    
    seasons.forEach(s => {
        content += `
            <div class="season-item" onclick="bukaSpesifik('${s.mal_id}')">
                <div style="display:flex; gap: 15px; align-items:center;">
                    <img src="${s.images.jpg.small_image_url}" style="width:50px; border-radius:5px;">
                    <div>
                        <strong style="display:block;">${s.title}</strong>
                        <span style="font-size:0.8rem; opacity:0.7;">Score: ⭐ ${s.score || 'N/A'} | Status: ${s.status}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    detailKonten.innerHTML = content;
    modal.style.display = "block";
}

// Fungsi dummy untuk klik di dalam folder (bisa dikembangkan untuk buka sinopsis)
window.bukaSpesifik = function(id) {
    window.open(`https://myanimelist.net/anime/${id}`, '_blank');
}

/**
 * 4. KONTROL BALON & FILTER
 */
fabMain.onclick = () => {
    fabMenu.classList.toggle('active');
    if (!fabMenu.classList.contains('active')) subMenuJadwal.classList.remove('active');
};

window.toggleSubMenu = function() {
    subMenuJadwal.classList.toggle('active');
}

window.filterAnime = function(season) {
    renderFolderedList(season);
    fabMenu.classList.remove('active');
    subMenuJadwal.classList.remove('active');
}

// Tutup Modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

// Jalankan Program
fetchSemuaAnime();