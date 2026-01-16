const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");

const EPG_URL = "https://raw.githubusercontent.com/LITUATUI/TV-MAP/main/guia.xml";
let epgCache = [];

async function updateEPG() {
    try {
        const response = await axios.get(EPG_URL, { timeout: 20000 });
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        if (result && result.tv && result.tv.programme) {
            epgCache = result.tv.programme;
            console.log("✅ EPG Carregado");
        }
    } catch (err) {
        console.error("❌ Erro EPG:", err.message);
    }
}
updateEPG();
setInterval(updateEPG, 4 * 60 * 60 * 1000);

const builder = new addonBuilder({
    id: "org.guia.tvmap.br.v2",
    name: "Guia TV Brasil",
    version: "1.0.5",
    description: "Canais Brasileiros - Programação em Tempo Real",
    resources: ["catalog", "meta"],
    types: ["tv"],
    catalogs: [{ type: "tv", id: "guia_br", name: "Programação Agora" }]
});

const CANAIS_FIXOS = [
    // ABERTOS
    { id: "Globo", name: "Globo", logo: "https://i.imgur.com/7S879vS.png" },
    { id: "SBT", name: "SBT", logo: "https://i.imgur.com/vHqQ9z4.png" },
    { id: "Record", name: "Record TV", logo: "https://i.imgur.com/uG939z4.png" },
    { id: "Band", name: "Band", logo: "https://i.imgur.com/O6S322P.png" },
    { id: "RedeTV", name: "Rede TV!", logo: "https://i.imgur.com/S6pC0zI.png" },
    { id: "Cultura", name: "TV Cultura", logo: "https://i.imgur.com/p00P3p8.png" },
    { id: "Gazeta", name: "TV Gazeta", logo: "https://i.imgur.com/fMv72K6.png" },

    // FILMES E SÉRIES
    { id: "HBO", name: "HBO", logo: "https://i.imgur.com/H6D4F9T.png" },
    { id: "HBO2", name: "HBO 2", logo: "https://i.imgur.com/Y3UuA6O.png" },
    { id: "HBOFamily", name: "HBO Family", logo: "https://i.imgur.com/8f8Z0eB.png" },
    { id: "HBOSignature", name: "HBO Signature", logo: "https://i.imgur.com/w9Z8bW9.png" },
    { id: "Warner", name: "Warner TV", logo: "https://i.imgur.com/yF9x8Vn.png" },
    { id: "TNT", name: "TNT", logo: "https://i.imgur.com/z8tFw8F.png" },
    { id: "Space", name: "Space", logo: "https://i.imgur.com/z0S8u8I.png" },
    { id: "AXN", name: "AXN", logo: "https://i.imgur.com/w09BvYn.png" },
    { id: "Universal", name: "Universal TV", logo: "https://i.imgur.com/H8iN2y0.png" },
    { id: "USA", name: "USA Network", logo: "https://i.imgur.com/Vp6q8z4.png" },
    { id: "Megapix", name: "Megapix", logo: "https://i.imgur.com/H7yW8Zf.png" },
    { id: "Paramount", name: "Paramount Network", logo: "https://i.imgur.com/U3qW2Yn.png" },
    { id: "StudioUniversal", name: "Studio Universal", logo: "https://i.imgur.com/v8S9bWn.png" },
    { id: "CanalBrasil", name: "Canal Brasil", logo: "https://i.imgur.com/H9z9fX8.png" },

    // ESPORTES
    { id: "SporTV", name: "SporTV", logo: "https://i.imgur.com/Y9v8fXt.png" },
    { id: "SporTV2", name: "SporTV 2", logo: "https://i.imgur.com/X9v8fXu.png" },
    { id: "SporTV3", name: "SporTV 3", logo: "https://i.imgur.com/W9v8fXv.png" },
    { id: "ESPN", name: "ESPN", logo: "https://i.imgur.com/V9v8fXw.png" },
    { id: "ESPN2", name: "ESPN 2", logo: "https://i.imgur.com/U9v8fXx.png" },
    { id: "ESPN4", name: "ESPN 4", logo: "https://i.imgur.com/T9v8fXy.png" },
    { id: "Premiere", name: "Premiere", logo: "https://i.imgur.com/h5T2vWn.png" },
    
    // DOCUMENTÁRIOS E VARIADOS
    { id: "Discovery", name: "Discovery Channel", logo: "https://i.imgur.com/v7S9bXn.png" },
    { id: "DiscoveryKids", name: "Discovery Kids", logo: "https://i.imgur.com/G9b8fXn.png" },
    { id: "DiscHomeHealth", name: "Discovery H&H", logo: "https://i.imgur.com/U8v8fXn.png" },
    { id: "NationalGeographic", name: "Nat Geo", logo: "https://i.imgur.com/Z9v8fXo.png" },
    { id: "History", name: "History Channel", logo: "https://i.imgur.com/V9b8fXp.png" },
    { id: "AnimalPlanet", name: "Animal Planet", logo: "https://i.imgur.com/K9z9vWn.png" },
    { id: "GNT", name: "GNT", logo: "https://i.imgur.com/I9v8fXq.png" },
    { id: "Multishow", name: "Multishow", logo: "https://i.imgur.com/H9v8fXr.png" },
    { id: "Viva", name: "Viva", logo: "https://i.imgur.com/G9v8fXs.png" },
    { id: "Gloob", name: "Gloob", logo: "https://i.imgur.com/U7v8YZn.png" },

    // NOTÍCIAS
    { id: "GloboNews", name: "GloboNews", logo: "https://i.imgur.com/S9v8fXz.png" },
    { id: "CNN", name: "CNN Brasil", logo: "https://i.imgur.com/R9v8fX1.png" },
    { id: "JovemPanNews", name: "Jovem Pan News", logo: "https://i.imgur.com/Q9v8fX2.png" },
    { id: "BandNews", name: "BandNews TV", logo: "https://i.imgur.com/P9v8fX3.png" }
];

builder.defineCatalogHandler(async (args) => {
    if (args.id === "guia_br") {
        const agora = new Date();
        const metas = CANAIS_FIXOS.map(canal => {
            let programaAtual = "Programação indisponível";
            if (epgCache.length > 0) {
                const prog = epgCache.find(p => {
                    if (p.$.channel !== canal.id) return false;
                    const start = new Date(p.$.start.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:00'));
                    const stop = new Date(p.$.stop.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:00'));
                    return agora >= start && agora <= stop;
                });
                if (prog && prog.title) {
                    programaAtual = typeof prog.title[0] === 'string' ? prog.title[0] : prog.title[0]._;
                }
            }
            return {
                id: `brtv_${canal.id.toLowerCase()}`,
                type: "tv",
                name: canal.name,
                poster: canal.logo,
                posterShape: "square",
                description: `📺 AGORA: ${programaAtual}`
            };
        });
        return { metas };
    }
    return { metas: [] };
});

builder.defineMetaHandler(async (args) => {
    const canalId = args.id.replace("brtv_", "");
    const canal = CANAIS_FIXOS.find(c => c.id.toLowerCase() === canalId);
    return {
        meta: canal ? {
            id: args.id,
            type: "tv",
            name: canal.name,
            poster: canal.logo,
            posterShape: "square",
            description: `Guia de TV: ${canal.name}`
        } : null
    };
});

const addonInterface = builder.getInterface();
module.exports = (req, res) => {
    if (req.url === '/') { 
        res.writeHead(302, { 'Location': '/manifest.json' }); 
        res.end(); 
    } else { 
        addonInterface.serveHTTP(req, res); 
    }
};

if (require.main === module) { 
    serveHTTP(addonInterface, { port: process.env.PORT || 7000 }); 
}
