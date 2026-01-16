const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");

const EPG_URL = "https://epgpainel.ddns.net/epg.xml";
// Novo repositório conforme solicitado
const LOGO_BASE = "https://raw.githubusercontent.com/szneto/BrazilTVLogos/main/logos";

let epgCache = [];

async function updateEPG() {
    try {
        const response = await axios.get(EPG_URL, { timeout: 45000 });
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        if (result && result.tv && result.tv.programme) {
            epgCache = result.tv.programme;
            console.log(`✅ EPG Sincronizado: ${epgCache.length} programas.`);
        }
    } catch (err) {
        console.error("❌ Erro ao baixar EPG:", err.message);
    }
}
updateEPG();
setInterval(updateEPG, 60 * 60 * 1000);

const builder = new addonBuilder({
    id: "org.guia.br.szneto.v15",
    name: "Guia TV Brasil SZ",
    version: "1.15.0",
    description: "Grade completa com logos do repositório szneto.",
    resources: ["catalog", "meta"],
    types: ["tv"],
    catalogs: [{ 
        type: "tv", 
        id: "guia_br", 
        name: "Grade de Programação",
        options: { genres: ["Canais Abertos", "Filmes e Séries", "Esportes", "Infantil", "Documentários", "Notícias"] },
        extra: [{ name: "genre", isRequired: false }]
    }]
});

const CANAIS_FIXOS = [
    // CANAIS ABERTOS (Nomes de arquivos do szneto usam MAIÚSCULAS)
    { id: "GLOBO", name: "Globo", logo: "GLOBO.png", genre: "Canais Abertos" },
    { id: "SBT", name: "SBT", logo: "SBT.png", genre: "Canais Abertos" },
    { id: "RECORD", name: "Record TV", logo: "RECORD_TV.png", genre: "Canais Abertos" },
    { id: "BAND", name: "Band", logo: "BAND.png", genre: "Canais Abertos" },
    { id: "REDETV", name: "Rede TV!", logo: "REDETV.png", genre: "Canais Abertos" },
    { id: "CULTURA", name: "TV Cultura", logo: "CULTURA.png", genre: "Canais Abertos" },
    { id: "GAZETA", name: "TV Gazeta", logo: "GAZETA.png", genre: "Canais Abertos" },

    // FILMES E SÉRIES
    { id: "HBO", name: "HBO", logo: "HBO_HD.png", genre: "Filmes e Séries" },
    { id: "HBO 2", name: "HBO 2", logo: "HBO2_HD.png", genre: "Filmes e Séries" },
    { id: "HBO FAMILY", name: "HBO Family", logo: "HBO_FAMILY_HD.png", genre: "Filmes e Séries" },
    { id: "HBO SIGNATURE", name: "HBO Signature", logo: "HBO_SIGNATURE_HD.png", genre: "Filmes e Séries" },
    { id: "TELECINE PREMIUM", name: "Telecine Premium", logo: "TC_PREMIUM_HD.png", genre: "Filmes e Séries" },
    { id: "TELECINE ACTION", name: "Telecine Action", logo: "TC_ACTION_HD.png", genre: "Filmes e Séries" },
    { id: "TELECINE TOUCH", name: "Telecine Touch", logo: "TC_TOUCH_HD.png", genre: "Filmes e Séries" },
    { id: "TELECINE PIPOCA", name: "Telecine Pipoca", logo: "TC_PIPOCA_HD.png", genre: "Filmes e Séries" },
    { id: "TELECINE FUN", name: "Telecine Fun", logo: "TC_FUN_HD.png", genre: "Filmes e Séries" },
    { id: "TELECINE CULT", name: "Telecine Cult", logo: "TC_CULT_HD.png", genre: "Filmes e Séries" },
    { id: "WARNER", name: "Warner TV", logo: "WARNER_CHANNEL_HD.png", genre: "Filmes e Séries" },
    { id: "TNT", name: "TNT", logo: "TNT_HD.png", genre: "Filmes e Séries" },
    { id: "TNT SERIES", name: "TNT Series", logo: "TNT_SERIES_HD.png", genre: "Filmes e Séries" },
    { id: "SPACE", name: "Space", logo: "SPACE_HD.png", genre: "Filmes e Séries" },
    { id: "AXN", name: "AXN", logo: "AXN_HD.png", genre: "Filmes e Séries" },
    { id: "UNIVERSAL", name: "Universal TV", logo: "UNIVERSAL_TV_HD.png", genre: "Filmes e Séries" },
    { id: "MEGAPIX", name: "Megapix", logo: "MEGAPIX_HD.png", genre: "Filmes e Séries" },
    { id: "SONY", name: "Sony Channel", logo: "SONY_CHANNEL_HD.png", genre: "Filmes e Séries" },

    // ESPORTES
    { id: "SPORTV", name: "SporTV", logo: "SPORTV_HD.png", genre: "Esportes" },
    { id: "SPORTV 2", name: "SporTV 2", logo: "SPORTV2_HD.png", genre: "Esportes" },
    { id: "SPORTV 3", name: "SporTV 3", logo: "SPORTV3_HD.png", genre: "Esportes" },
    { id: "ESPN", name: "ESPN", logo: "ESPN_HD.png", genre: "Esportes" },
    { id: "ESPN 2", name: "ESPN 2", logo: "ESPN2_HD.png", genre: "Esportes" },
    { id: "ESPN 3", name: "ESPN 3", logo: "ESPN3_HD.png", genre: "Esportes" },
    { id: "ESPN 4", name: "ESPN 4", logo: "ESPN4_HD.png", genre: "Esportes" },
    { id: "PREMIERE CLUBES", name: "Premiere", logo: "PREMIERE_HD.png", genre: "Esportes" },
    { id: "COMBATE", name: "Combate", logo: "COMBATE_HD.png", genre: "Esportes" },

    // INFANTIL
    { id: "DISCOVERY KIDS", name: "Discovery Kids", logo: "DISCOVERY_KIDS_HD.png", genre: "Infantil" },
    { id: "CARTOON NETWORK", name: "Cartoon Network", logo: "CARTOON_NETWORK_HD.png", genre: "Infantil" },
    { id: "GLOOB", name: "Gloob", logo: "GLOOB_HD.png", genre: "Infantil" },
    { id: "NICKELODEON", name: "Nickelodeon", logo: "NICKELODEON_HD.png", genre: "Infantil" },
    { id: "DISNEY CHANNEL", name: "Disney Channel", logo: "DISNEY_CHANNEL_HD.png", genre: "Infantil" },

    // NOTÍCIAS E DOCS
    { id: "GLOBO NEWS", name: "GloboNews", logo: "GLOBONEWS_HD.png", genre: "Notícias" },
    { id: "CNN BRASIL", name: "CNN Brasil", logo: "CNN_BRASIL_HD.png", genre: "Notícias" },
    { id: "JOVEM PAN NEWS", name: "Jovem Pan News", logo: "JOVEM_PAN_NEWS_HD.png", genre: "Notícias" },
    { id: "DISCOVERY", name: "Discovery Channel", logo: "DISCOVERY_CHANNEL_HD.png", genre: "Documentários" },
    { id: "HISTORY", name: "History Channel", logo: "HISTORY_HD.png", genre: "Documentários" },
    { id: "MULTISHOW", name: "Multishow", logo: "MULTISHOW_HD.png", genre: "Documentários" }
];

function getPrograma(canalId) {
    const agora = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    if (!epgCache.length) return null;
    const prog = epgCache.find(p => {
        if (p.$.channel.toUpperCase() !== canalId.toUpperCase()) return false;
        const parseXmlDate = (str) => {
            const y = str.substring(0,4), m = str.substring(4,6)-1, d = str.substring(6,8);
            const h = str.substring(8,10), min = str.substring(10,12), s = str.substring(12,14);
            return new Date(y, m, d, h, min, s);
        };
        const start = parseXmlDate(p.$.start);
        const stop = parseXmlDate(p.$.stop);
        return agora >= start && agora <= stop;
    });
    if (prog) return { titulo: prog.title[0]._ || prog.title[0], desc: prog.desc ? (prog.desc[0]._ || prog.desc[0]) : "Sem descrição." };
    return null;
}

builder.defineCatalogHandler(async (args) => {
    let canaisFiltrados = CANAIS_FIXOS;
    if (args.extra.genre) {
        canaisFiltrados = CANAIS_FIXOS.filter(c => c.genre === args.extra.genre);
    }
    const metas = canaisFiltrados.map(canal => {
        const info = getPrograma(canal.id);
        const logoUrl = `${LOGO_BASE}/${canal.logo}`;
        return {
            id: `v15_${canal.id.replace(/ /g, "_")}`,
            type: "tv",
            name: canal.name,
            poster: logoUrl,
            posterShape: "square",
            description: info ? `🔴 AGORA: ${info.titulo}` : "Programação não encontrada."
        };
    });
    return { metas };
});

builder.defineMetaHandler(async (args) => {
    const originalId = args.id.replace("v15_", "").replace(/_/g, " ");
    const canal = CANAIS_FIXOS.find(c => c.id.toUpperCase() === originalId.toUpperCase());
    if (canal) {
        const info = getPrograma(canal.id);
        const logoUrl = `${LOGO_BASE}/${canal.logo}`;
        return {
            meta: {
                id: args.id,
                type: "tv",
                name: canal.name,
                poster: logoUrl,
                logo: logoUrl,
                background: logoUrl,
                posterShape: "square",
                description: info ? `📺 PROGRAMAÇÃO ATUAL:\n${info.titulo}\n\n📖 SINOPSE:\n${info.desc}` : "Sem dados no guia para agora."
            }
        };
    }
    return { meta: null };
});

const addonInterface = builder.getInterface();
module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.url === '/' || req.url === '/manifest.json') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(addonInterface.manifest));
    } else {
        addonInterface.serveHTTP(req, res);
    }
};

if (require.main === module) {
    serveHTTP(addonInterface, { port: process.env.PORT || 7000 });
}
