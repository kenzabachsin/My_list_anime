const animeIds = [
    38790, // Bofuri
    41514, // Bofuri S2
    53446, // Tondemo Skill de Isekai
    57025, // Tondemo Skill S2
    54714, // Hyakkano (100 Girlfriends)
    57616, // Hyakkano S2
    42923, // Sk8 the Infinity
    49363, // Sk8 (Project/OVA)
    57719, // Akuyaku Reijou Tensei Ojisan
    58172, // Nageki no Bourei S1
    60619, // Nageki no Bourei S2
    53516, // Tensei shitara Dainana Ouji S1
    59095, // Tensei shitara Dainana Ouji S2
    40397, // Maoujou de Oyasumi
    40750, // Kaifuku Jutsushi no Yarinaoshi
    48239, // Leadale no Daichi nite
    48316, // Kage no Jitsuryokusha S1
    54595, // Kage no Jitsuryokusha S2
    57584, // Kage no Jitsuryokusha Movie
    39196, // Mairimashita! Iruma-kun S1
    41402, // Iruma-kun S2
    49784, // Iruma-kun S3
    60310, // Iruma-kun S4
    19815, // No Game No Life
    54900, // Wind Breaker S1
    59160, // Wind Breaker S2
    38555, // Hametsu Flag (Bakarina) S1
    42282, // Bakarina S2
    57891, // Hitoribocchi no Isekai Kouryaku
    51462, // Isekai Nonbiri Nouka S1
    62146, // Isekai Nonbiri Nouka S2
    35790, // Tate no Yuusha S1
    40356, // Tate no Yuusha S2
    40357, // Tate no Yuusha S3
    57907, // Tate no Yuusha S4
    59130, // Isekai Mokushiroku Mynoghra
    50220, // Isekai Shoukan wa Nidome desu
    18507, // Free!
    50273, // Tomodachi Game
    54837, // Akuyaku Reijou Level 99
    53438, // Higeki no Genkyou S1
    61931, // Higeki no Genkyou S2
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
    59424, // Lv2 Kara Cheat S2
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

async function fetchSemuaAnime() {
    listContainer.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Menyusun Watchlist kamu...</p>";
    
    for (const id of animeIds) {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const json = await response.json();
            
            if (json.data) {
                if (listContainer.querySelector('p')) listContainer.innerHTML = "";
                renderCard(json.data);
            }
            await new Promise(res => setTimeout(res, 350)); 
        } catch (err) {
            console.error("Gagal ambil data ID: " + id);
        }
    }
}

function renderCard(anime) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
        <h3>${anime.title}</h3>
    `;
    card.onclick = () => bukaDetail(anime);
    listContainer.appendChild(card);
}

function bukaDetail(anime) {
    const season = anime.season ? anime.season.toUpperCase() : 'N/A';
    const year = anime.year ? anime.year : '';
    const episodes = anime.episodes ? anime.episodes : 'Ongoing';
    const studios = anime.studios.length > 0 ? anime.studios.map(s => s.name).join(', ') : 'N/A';

    detailKonten.innerHTML = `
        <div class="detail-header">
            <img src="${anime.images.jpg.large_image_url}">
            <div class="info-text">
                <h2>${anime.title}</h2>
                <p>
                    <span class="tag">${anime.status}</span> 
                    <span class="tag">${season} ${year}</span>
                </p>
                <div style="margin-top:15px; font-size: 0.9rem; line-height: 1.6;">
                    <p><strong>Studio:</strong> ${studios}</p>
                    <p><strong>Format:</strong> ${anime.type} (${episodes} Eps)</p>
                    <p><strong>Score:</strong> ⭐ ${anime.score || 'N/A'}</p>
                </div>
            </div>
        </div>
        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin: 20px 0;">
        <h3 style="color: #e94560;">Prolog</h3>
        <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.9;">${anime.synopsis || 'Sinopsis belum tersedia.'}</p>
    `;
    modal.style.display = "block";
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

fetchSemuaAnime();