const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");

const EPG_URL = "https://epgpainel.ddns.net/epg.xml";
let epgCache = [];

async function updateEPG() {
    try {
        console.log("Baixando Grade Completa...");
        const response = await axios.get(EPG_URL, { timeout: 30000 });
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        if (result && result.tv && result.tv.programme) {
            epgCache = result.tv.programme;
            console.log(`✅ Sucesso! ${epgCache.length} programas na memória.`);
        }
    } catch (err) {
        console.error("❌ Erro ao baixar EPG:", err.message);
    }
}

updateEPG();
setInterval(updateEPG, 2 * 60 * 60 * 1000);

const builder = new addonBuilder({
    id: "org.guia.br.full",
    name: "Guia TV Brasil FULL",
    version: "1.4.0",
    description: "Grade completa de canais abertos e fechados.",
    resources: ["catalog", "meta"],
    types: ["tv"],
    catalogs: [{ type: "tv", id: "guia_br", name: "Grade de Programação" }]
});

// LISTA COMPLETA DE CANAIS (IDs compatíveis com o XML DDNS)
const CANAIS_FIXOS = [
    // ABERTOS
    { id: "GLOBO", name: "Globo", logo: "https://i.imgur.com/7S879vS.png" },
    { id: "SBT", name: "SBT", logo: "https://i.imgur.com/vHqQ9z4.png" },
    { id: "RECORD", name: "Record TV", logo: "https://i.imgur.com/uG939z4.png" },
    { id: "BAND", name: "Band", logo: "https://i.imgur.com/O6S322P.png" },
    { id: "REDETV", name: "Rede TV!", logo: "https://i.imgur.com/S6pC0zI.png" },
    { id: "CULTURA", name: "TV Cultura", logo: "https://i.imgur.com/p00P3p8.png" },

    // TELECINE
    { id: "TELECINE PREMIUM", name: "Telecine Premium", logo: "https://i.imgur.com/8N7S1f4.png" },
    { id: "TELECINE ACTION", name: "Telecine Action", logo: "https://i.imgur.com/2YyO6Wn.png" },
    { id: "TELECINE TOUCH", name: "Telecine Touch", logo: "https://i.imgur.com/vH7S1f4.png" },
    { id: "TELECINE PIPOCA", name: "Telecine Pipoca", logo: "https://i.imgur.com/8N7S1f4.png" },
    { id: "TELECINE FUN", name: "Telecine Fun", logo: "https://i.imgur.com/vH7S1f4.png" },
    { id: "TELECINE CULT", name: "Telecine Cult", logo: "https://i.imgur.com/2YyO6Wn.png" },

    // HBO
    { id: "HBO", name: "HBO", logo: "https://i.imgur.com/H6D4F9T.png" },
    { id: "HBO 2", name: "HBO 2", logo: "https://i.imgur.com/Y3UuA6O.png" },
    { id: "HBO FAMILY", name: "HBO Family", logo: "https://i.imgur.com/8f8Z0eB.png" },
    { id: "HBO SIGNATURE", name: "HBO Signature", logo: "https://i.imgur.com/w9Z8bW9.png" },

    // ESPORTES
    { id: "SPORTV", name: "SporTV", logo: "https://i.imgur.com/Y9v8fXt.png" },
    { id: "SPORTV 2", name: "SporTV 2", logo: "https://i.imgur.com/X9v8fXu.png" },
    { id: "SPORTV 3", name: "SporTV 3", logo: "https://i.imgur.com/W9v8fXv.png" },
    { id: "ESPN", name: "ESPN", logo: "https://i.imgur.com/V9v8fXw.png" },
    { id: "ESPN 2", name: "ESPN 2", logo: "https://i.imgur.com/U9v8fXx.png" },
    { id: "ESPN 4", name: "ESPN 4", logo: "https://i.imgur.com/T9v8fXy.png" },
    { id: "PREMIERE", name: "Premiere", logo: "https://i.imgur.com/h5T2vWn.png" },

    // VARIEDADES E FILMES
    { id: "WARNER", name: "Warner TV", logo: "https://i.imgur.com/yF9x8Vn.png" },
    { id: "TNT", name: "TNT", logo: "https://i.imgur.com/z8tFw8F.png" },
    { id: "UNIVERSAL", name: "Universal TV", logo: "https://i.imgur.com/H8iN2y0.png" },
    { id: "AXN", name: "AXN", logo: "https://i.imgur.com/w09BvYn.png" },
    { id: "MEGAPIX", name: "Megapix", logo: "https://i.imgur.com/H7yW8Zf.png" },
    { id: "VIVA", name: "Viva", logo: "https://i.imgur.com/G9v8fXs.png" },
    { id: "MULTISHOW", name: "Multishow", logo: "https://i.imgur.com/H9v8fXr.png" },
    { id: "GNT", name: "GNT", logo: "https://i.imgur.com/I9v8fXq.png" },

    // INFANTIL
    { id: "DISCOVERY KIDS", name: "Discovery Kids", logo: "https://i.imgur.com/G9b8fXn.png" },
    { id: "CARTOON NETWORK", name: "Cartoon Network", logo: "https://i.imgur.com/I7V8vYn.png" },
    { id: "GLOOB", name: "Gloob", logo: "https://i.imgur.com/U7v8YZn.png" },
    { id: "NICKELODEON", name: "Nickelodeon", logo: "https://i.imgur.com/Z9v8fXn.png" }
];

function getPrograma(canalId) {
    const agora = new Date();
    if (!epgCache.length) return null;
    
    const prog = epgCache.find(p => {
        if (p.$.channel.toUpperCase() !== canalId.toUpperCase()) return false;
        
        // Formato: 20240520143000
        const s = p.$.start;
        const start = new Date(`${s.substring(0,4)}-${s.substring(4,6)}-${s.substring(6,8)}T${s.substring(8,10)}:${s.substring(10,12)}:${s.substring(12,14)}`);
        const e = p.$.stop;
        const stop = new Date(`${e.substring(0,4)}-${e.substring(4,6)}-${e.substring(6,8)}T${e.substring(8,10)}:${e.substring(10,12)}:${e.substring(12,14)}`);
        
        return agora >= start && agora <= stop;
    });

    if (prog) {
        return {
            titulo: prog.title[0]._ || prog.title[0],
            desc: prog.desc ? (prog.desc[0]._ || prog.desc[0]) : "Sem descrição disponível."
        };
    }
    return null;
}

builder.defineCatalogHandler(async () => {
    const metas = CANAIS_FIXOS.map(canal => {
        const info = getPrograma(canal.id);
        return {
            id: `tvbr_${canal.id.toLowerCase().replace(/ /g, "_")}`,
            type: "tv",
            name: canal.name,
            poster: canal.logo,
            posterShape: "square",
            description: info ? `🔴 AGORA: ${info.titulo}` : "Aguardando EPG..."
        };
    });
    return { metas };
});

builder.defineMetaHandler(async (args) => {
    const cleanId = args.id.replace("tvbr_", "").replace(/_/g, " ").toUpperCase();
    const canal = CANAIS_FIXOS.find(c => c.id.toUpperCase() === cleanId);
    
    if (canal) {
        const info = getPrograma(canal.id);
        return {
            meta: {
                id: args.id,
                type: "tv",
                name: canal.name,
                poster: canal.logo,
                logo: canal.logo,
                background: canal.logo,
                posterShape: "square",
                description: info ? `PASSANDO AGORA:\n${info.titulo}\n\nSOBRE:\n${info.desc}` : "Programação indisponível."
            }
        };
    }
    return { meta: null };
});

const addonInterface = builder.getInterface();
module.exports = (req, res) => {
    if (req.url === '/' || req.url === '/manifest.json') {
        res.setHeader('Content-Type', 'application/json');
        res.send(addonInterface.manifest);
    } else {
        addonInterface.serveHTTP(req, res);
    }
};

if (require.main === module) {
    serveHTTP(addonInterface, { port: process.env.PORT || 7000 });
}
