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
            console.log(`✅ EPG Sincronizado: ${epgCache.length} programas.`);
        }
    } catch (err) {
        console.error("❌ Erro ao baixar EPG:", err.message);
    }
}
updateEPG();
setInterval(updateEPG, 60 * 60 * 1000);

const builder = new addonBuilder({
    id: "org.guia.br.categorias.v14",
    name: "Guia TV Brasil Premium",
    version: "1.14.0",
    description: "Grade completa dividida por categorias. Logos oficiais.",
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
    // CANAIS ABERTOS
    { id: "GLOBO", name: "Globo", logo: "globo.png", genre: "Canais Abertos" },
    { id: "SBT", name: "SBT", logo: "sbt.png", genre: "Canais Abertos" },
    { id: "RECORD", name: "Record TV", logo: "record-tv.png", genre: "Canais Abertos" },
    { id: "BAND", name: "Band", logo: "band.png", genre: "Canais Abertos" },
    { id: "REDETV", name: "Rede TV!", logo: "redetv.png", genre: "Canais Abertos" },
    { id: "CULTURA", name: "TV Cultura", logo: "tv-cultura.png", genre: "Canais Abertos" },
    { id: "GAZETA", name: "TV Gazeta", logo: "tv-gazeta.png", genre: "Canais Abertos" },
    { id: "REDE VIDA", name: "Rede Vida", logo: "redevida.png", genre: "Canais Abertos" },

    // FILMES E SÉRIES
    { id: "HBO", name: "HBO", logo: "hbo.png", genre: "Filmes e Séries" },
    { id: "HBO 2", name: "HBO 2", logo: "hbo-2.png", genre: "Filmes e Séries" },
    { id: "HBO FAMILY", name: "HBO Family", logo: "hbo-family.png", genre: "Filmes e Séries" },
    { id: "HBO SIGNATURE", name: "HBO Signature", logo: "hbo-signature.png", genre: "Filmes e Séries" },
    { id: "TELECINE PREMIUM", name: "Telecine Premium", logo: "telecine-premium.png", genre: "Filmes e Séries" },
    { id: "TELECINE ACTION", name: "Telecine Action", logo: "telecine-action.png", genre: "Filmes e Séries" },
    { id: "TELECINE TOUCH", name: "Telecine Touch", logo: "telecine-touch.png", genre: "Filmes e Séries" },
    { id: "TELECINE PIPOCA", name: "Telecine Pipoca", logo: "telecine-pipoca.png", genre: "Filmes e Séries" },
    { id: "TELECINE FUN", name: "Telecine Fun", logo: "telecine-fun.png", genre: "Filmes e Séries" },
    { id: "TELECINE CULT", name: "Telecine Cult", logo: "telecine-cult.png", genre: "Filmes e Séries" },
    { id: "WARNER", name: "Warner TV", logo: "warner-channel.png", genre: "Filmes e Séries" },
    { id: "TNT", name: "TNT", logo: "tnt.png", genre: "Filmes e Séries" },
    { id: "TNT SERIES", name: "TNT Series", logo: "tnt-series.png", genre: "Filmes e Séries" },
    { id: "SPACE", name: "Space", logo: "space.png", genre: "Filmes e Séries" },
    { id: "AXN", name: "AXN", logo: "axn.png", genre: "Filmes e Séries" },
    { id: "UNIVERSAL", name: "Universal TV", logo: "universal-tv.png", genre: "Filmes e Séries" },
    { id: "MEGAPIX", name: "Megapix", logo: "megapix.png", genre: "Filmes e Séries" },
    { id: "PARAMOUNT", name: "Paramount Network", logo: "paramount-network.png", genre: "Filmes e Séries" },
    { id: "STUDIO UNIVERSAL", name: "Studio Universal", logo: "studio-universal.png", genre: "Filmes e Séries" },
    { id: "SONY", name: "Sony Channel", logo: "sony-channel.png", genre: "Filmes e Séries" },

    // ESPORTES
    { id: "SPORTV", name: "SporTV", logo: "sportv.png", genre: "Esportes" },
    { id: "SPORTV 2", name: "SporTV 2", logo: "sportv-2.png", genre: "Esportes" },
    { id: "SPORTV 3", name: "SporTV 3", logo: "sportv-3.png", genre: "Esportes" },
    { id: "ESPN", name: "ESPN", logo: "espn.png", genre: "Esportes" },
    { id: "ESPN 2", name: "ESPN 2", logo: "espn-2.png", genre: "Esportes" },
    { id: "ESPN 3", name: "ESPN 3", logo: "espn-3.png", genre: "Esportes" },
    { id: "ESPN 4", name: "ESPN 4", logo: "espn-4.png", genre: "Esportes" },
    { id: "BANDSPORTS", name: "BandSports", logo: "bandsports.png", genre: "Esportes" },
    { id: "PREMIERE CLUBES", name: "Premiere", logo: "premiere.png", genre: "Esportes" },
    { id: "COMBATE", name: "Combate", logo: "combate.png", genre: "Esportes" },

    // INFANTIL
    { id: "DISCOVERY KIDS", name: "Discovery Kids", logo: "discovery-kids.png", genre: "Infantil" },
    { id: "CARTOON NETWORK", name: "Cartoon Network", logo: "cartoon-network.png", genre: "Infantil" },
    { id: "GLOOB", name: "Gloob", logo: "gloob.png", genre: "Infantil" },
    { id: "GLOOBINHO", name: "Gloobinho", logo: "gloobinho.png", genre: "Infantil" },
    { id: "NICKELODEON", name: "Nickelodeon", logo: "nickelodeon.png", genre: "Infantil" },
    { id: "NICK JR", name: "Nick Jr", logo: "nick-jr.png", genre: "Infantil" },
    { id: "DISNEY CHANNEL", name: "Disney Channel", logo: "disney-channel.png", genre: "Infantil" },

    // DOCUMENTÁRIOS E VARIEDADES
    { id: "DISCOVERY", name: "Discovery Channel", logo: "discovery-channel.png", genre: "Documentários" },
    { id: "HISTORY", name: "History Channel", logo: "history.png", genre: "Documentários" },
    { id: "NATIONAL GEOGRAPHIC", name: "Nat Geo", logo: "national-geographic.png", genre: "Documentários" },
    { id: "VIVA", name: "Viva", logo: "viva.png", genre: "Documentários" },
    { id: "MULTISHOW", name: "Multishow", logo: "multishow.png", genre: "Documentários" },
    { id: "GNT", name: "GNT", logo: "gnt.png", genre: "Documentários" },

    // NOTÍCIAS
    { id: "GLOBO NEWS", name: "GloboNews", logo: "globonews.png", genre: "Notícias" },
    { id: "CNN BRASIL", name: "CNN Brasil", logo: "cnn-brasil.png", genre: "Notícias" },
    { id: "JOVEM PAN NEWS", name: "Jovem Pan News", logo: "jovem-pan-news.png", genre: "Notícias" },
    { id: "BAND NEWS", name: "BandNews TV", logo: "bandnews.png", genre: "Notícias" }
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
            id: `v14_${canal.id.replace(/ /g, "_")}`,
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
    const originalId = args.id.replace("v14_", "").replace(/_/g, " ");
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
