const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");

const EPG_URL = "https://epgpainel.ddns.net/epg.xml";
const LOGO_BASE = "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/brazil";

let epgCache = [];

async function updateEPG() {
    try {
        const response = await axios.get(EPG_URL, { timeout: 45000 });
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        if (result && result.tv && result.tv.programme) {
            epgCache = result.tv.programme;
            console.log(`✅ Grade Completa Sincronizada: ${epgCache.length} programas.`);
        }
    } catch (err) {
        console.error("❌ Erro ao baixar EPG:", err.message);
    }
}
updateEPG();
setInterval(updateEPG, 1 * 60 * 60 * 1000);

const builder = new addonBuilder({
    id: "org.guia.br.completo.v11",
    name: "Guia TV Brasil Completo",
    version: "1.11.0",
    description: "Programação completa de todos os canais (EPG).",
    resources: ["catalog", "meta"],
    types: ["tv"],
    catalogs: [{ type: "tv", id: "guia_br", name: "Canais Brasileiros" }]
});

const CANAIS_FIXOS = [
    // ABERTOS
    { id: "GLOBO", name: "Globo", logo: "globo.png" },
    { id: "SBT", name: "SBT", logo: "sbt.png" },
    { id: "RECORD", name: "Record TV", logo: "record-tv.png" },
    { id: "BAND", name: "Band", logo: "band.png" },
    { id: "REDETV", name: "Rede TV!", logo: "redetv.png" },
    { id: "CULTURA", name: "TV Cultura", logo: "tv-cultura.png" },
    { id: "GAZETA", name: "TV Gazeta", logo: "tv-gazeta.png" },
    { id: "REDE VIDA", name: "Rede Vida", logo: "redevida.png" },
    { id: "RECORD NEWS", name: "Record News", logo: "record-news.png" },

    // FILMES E SÉRIES (HBO, TELECINE, TNT...)
    { id: "HBO", name: "HBO", logo: "hbo.png" },
    { id: "HBO 2", name: "HBO 2", logo: "hbo-2.png" },
    { id: "HBO FAMILY", name: "HBO Family", logo: "hbo-family.png" },
    { id: "HBO SIGNATURE", name: "HBO Signature", logo: "hbo-signature.png" },
    { id: "HBO MUNDI", name: "HBO Mundi", logo: "hbo-mundi.png" },
    { id: "HBO POP", name: "HBO Pop", logo: "hbo-pop.png" },
    { id: "HBO XTREME", name: "HBO Xtreme", logo: "hbo-xtreme.png" },
    { id: "TELECINE PREMIUM", name: "Telecine Premium", logo: "telecine-premium.png" },
    { id: "TELECINE ACTION", name: "Telecine Action", logo: "telecine-action.png" },
    { id: "TELECINE TOUCH", name: "Telecine Touch", logo: "telecine-touch.png" },
    { id: "TELECINE PIPOCA", name: "Telecine Pipoca", logo: "telecine-pipoca.png" },
    { id: "TELECINE FUN", name: "Telecine Fun", logo: "telecine-fun.png" },
    { id: "TELECINE CULT", name: "Telecine Cult", logo: "telecine-cult.png" },
    { id: "WARNER", name: "Warner TV", logo: "warner-channel.png" },
    { id: "TNT", name: "TNT", logo: "tnt.png" },
    { id: "TNT SERIES", name: "TNT Series", logo: "tnt-series.png" },
    { id: "SPACE", name: "Space", logo: "space.png" },
    { id: "AXN", name: "AXN", logo: "axn.png" },
    { id: "UNIVERSAL", name: "Universal TV", logo: "universal-tv.png" },
    { id: "USA", name: "USA Network", logo: "usa-network.png" },
    { id: "MEGAPIX", name: "Megapix", logo: "megapix.png" },
    { id: "PARAMOUNT", name: "Paramount Network", logo: "paramount-network.png" },
    { id: "STUDIO UNIVERSAL", name: "Studio Universal", logo: "studio-universal.png" },
    { id: "CANAL BRASIL", name: "Canal Brasil", logo: "canal-brasil.png" },
    { id: "A&E", name: "A&E", logo: "ae.png" },
    { id: "SONY", name: "Sony Channel", logo: "sony-channel.png" },

    // ESPORTES (SPORTV, ESPN, PREMIERE...)
    { id: "SPORTV", name: "SporTV", logo: "sportv.png" },
    { id: "SPORTV 2", name: "SporTV 2", logo: "sportv-2.png" },
    { id: "SPORTV 3", name: "SporTV 3", logo: "sportv-3.png" },
    { id: "ESPN", name: "ESPN", logo: "espn.png" },
    { id: "ESPN 2", name: "ESPN 2", logo: "espn-2.png" },
    { id: "ESPN 3", name: "ESPN 3", logo: "espn-3.png" },
    { id: "ESPN 4", name: "ESPN 4", logo: "espn-4.png" },
    { id: "BANDSPORTS", name: "BandSports", logo: "bandsports.png" },
    { id: "PREMIERE CLUBES", name: "Premiere", logo: "premiere.png" },
    { id: "PREMIERE 2", name: "Premiere 2", logo: "premiere.png" },
    { id: "PREMIERE 3", name: "Premiere 3", logo: "premiere.png" },
    { id: "COMBATE", name: "Combate", logo: "combate.png" },

    // INFANTIL
    { id: "DISCOVERY KIDS", name: "Discovery Kids", logo: "discovery-kids.png" },
    { id: "CARTOON NETWORK", name: "Cartoon Network", logo: "cartoon-network.png" },
    { id: "CARTOONITO", name: "Cartoonito", logo: "cartoonito.png" },
    { id: "GLOOB", name: "Gloob", logo: "gloob.png" },
    { id: "GLOOBINHO", name: "Gloobinho", logo: "gloobinho.png" },
    { id: "NICKELODEON", name: "Nickelodeon", logo: "nickelodeon.png" },
    { id: "NICK JR", name: "Nick Jr", logo: "nick-jr.png" },
    { id: "DISNEY CHANNEL", name: "Disney Channel", logo: "disney-channel.png" },

    // VARIADOS, DOCS E NOTÍCIAS
    { id: "VIVA", name: "Viva", logo: "viva.png" },
    { id: "MULTISHOW", name: "Multishow", logo: "multishow.png" },
    { id: "GNT", name: "GNT", logo: "gnt.png" },
    { id: "DISCOVERY", name: "Discovery Channel", logo: "discovery-channel.png" },
    { id: "DISCOVERY HOME & HEALTH", name: "Discovery H&H", logo: "discovery-home-and-health.png" },
    { id: "HISTORY", name: "History Channel", logo: "history.png" },
    { id: "HISTORY 2", name: "History 2", logo: "history-2.png" },
    { id: "NATIONAL GEOGRAPHIC", name: "Nat Geo", logo: "national-geographic.png" },
    { id: "ANIMAL PLANET", name: "Animal Planet", logo: "animal-planet.png" },
    { id: "GLOBO NEWS", name: "GloboNews", logo: "globonews.png" },
    { id: "CNN BRASIL", name: "CNN Brasil", logo: "cnn-brasil.png" },
    { id: "JOVEM PAN NEWS", name: "Jovem Pan News", logo: "jovem-pan-news.png" },
    { id: "BAND NEWS", name: "BandNews TV", logo: "bandnews.png" }
];

function getPrograma(canalId) {
    const agora = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    if (!epgCache.length) return null;
    
    const prog = epgCache.find(p => {
        if (p.$.channel.toUpperCase() !== canalId.toUpperCase()) return false;
        const parseDate = (str) => {
            const y = str.substring(0,4), m = str.substring(4,6)-1, d = str.substring(6,8);
            const h = str.substring(8,10), min = str.substring(10,12), s = str.substring(12,14);
            return new Date(y, m, d, h, min, s);
        };
        const start = parseDate(p.$.start);
        const stop = parseDate(p.$.stop);
        return agora >= start && agora <= stop;
    });

    if (prog) {
        return {
            titulo: prog.title[0]._ || prog.title[0],
            desc: prog.desc ? (prog.desc[0]._ || prog.desc[0]) : "Sem sinopse disponível."
        };
    }
    return null;
}

builder.defineCatalogHandler(async (args) => {
    const metas = CANAIS_FIXOS.map(canal => {
        const info = getPrograma(canal.id);
        return {
            id: `v11_${canal.id.replace(/ /g, "_")}`,
            type: "tv",
            name: canal.name,
            poster: `${LOGO_BASE}/${canal.logo}`,
            posterShape: "square",
            description: info ? `🔴 AGORA: ${info.titulo}` : "Grade não disponível."
        };
    });
    return { metas };
});

builder.defineMetaHandler(async (args) => {
    const originalId = args.id.replace("v11_", "").replace(/_/g, " ");
    const canal = CANAIS_FIXOS.find(c => c.id.toUpperCase() === originalId.toUpperCase());
    if (canal) {
        const info = getPrograma(canal.id);
        return {
            meta: {
                id: args.id,
                type: "tv",
                name: canal.name,
                poster: `${LOGO_BASE}/${canal.logo}`,
                logo: `${LOGO_BASE}/${canal.logo}`,
                background: `${LOGO_BASE}/${canal.logo}`,
                posterShape: "square",
                description: info 
                    ? `📺 PROGRAMAÇÃO ATUAL:\n${info.titulo}\n\n📖 SINOPSE:\n${info.desc}` 
                    : "Informações de grade não encontradas para este horário."
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
