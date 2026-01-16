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
            console.log(`✅ Guia Sincronizado: ${epgCache.length} programas carregados.`);
        }
    } catch (err) {
        console.error("❌ Erro ao baixar EPG:", err.message);
    }
}
updateEPG();
setInterval(updateEPG, 2 * 60 * 60 * 1000);

const builder = new addonBuilder({
    id: "org.guia.br.ultra",
    name: "Guia TV Brasil Ultra",
    version: "1.8.0",
    description: "Grade completa com +70 canais. Logos oficiais HD.",
    resources: ["catalog", "meta"],
    types: ["tv"],
    catalogs: [{ type: "tv", id: "guia_br", name: "Grade de Programação" }]
});

const CANAIS_FIXOS = [
    // ABERTOS
    { id: "GLOBO", name: "Globo", logo: `${LOGO_BASE}/globo.png` },
    { id: "SBT", name: "SBT", logo: `${LOGO_BASE}/sbt.png` },
    { id: "RECORD", name: "Record TV", logo: `${LOGO_BASE}/record-tv.png` },
    { id: "BAND", name: "Band", logo: `${LOGO_BASE}/band.png` },
    { id: "REDETV", name: "Rede TV!", logo: `${LOGO_BASE}/redetv.png` },
    { id: "CULTURA", name: "TV Cultura", logo: `${LOGO_BASE}/tv-cultura.png` },
    { id: "GAZETA", name: "TV Gazeta", logo: `${LOGO_BASE}/tv-gazeta.png` },
    { id: "REDE VIDA", name: "Rede Vida", logo: `${LOGO_BASE}/redevida.png` },
    { id: "RECORD NEWS", name: "Record News", logo: `${LOGO_BASE}/record-news.png` },

    // FILMES E SÉRIES
    { id: "HBO", name: "HBO", logo: `${LOGO_BASE}/hbo.png` },
    { id: "HBO 2", name: "HBO 2", logo: `${LOGO_BASE}/hbo-2.png` },
    { id: "HBO FAMILY", name: "HBO Family", logo: `${LOGO_BASE}/hbo-family.png` },
    { id: "HBO SIGNATURE", name: "HBO Signature", logo: `${LOGO_BASE}/hbo-signature.png` },
    { id: "HBO MUNDI", name: "HBO Mundi", logo: `${LOGO_BASE}/hbo-mundi.png` },
    { id: "HBO POP", name: "HBO Pop", logo: `${LOGO_BASE}/hbo-pop.png` },
    { id: "HBO XTREME", name: "HBO Xtreme", logo: `${LOGO_BASE}/hbo-xtreme.png` },
    { id: "TELECINE PREMIUM", name: "Telecine Premium", logo: `${LOGO_BASE}/telecine-premium.png` },
    { id: "TELECINE ACTION", name: "Telecine Action", logo: `${LOGO_BASE}/telecine-action.png` },
    { id: "TELECINE TOUCH", name: "Telecine Touch", logo: `${LOGO_BASE}/telecine-touch.png` },
    { id: "TELECINE PIPOCA", name: "Telecine Pipoca", logo: `${LOGO_BASE}/telecine-pipoca.png` },
    { id: "TELECINE FUN", name: "Telecine Fun", logo: `${LOGO_BASE}/telecine-fun.png` },
    { id: "TELECINE CULT", name: "Telecine Cult", logo: `${LOGO_BASE}/telecine-cult.png` },
    { id: "WARNER", name: "Warner TV", logo: `${LOGO_BASE}/warner-channel.png` },
    { id: "TNT", name: "TNT", logo: `${LOGO_BASE}/tnt.png` },
    { id: "TNT SERIES", name: "TNT Series", logo: `${LOGO_BASE}/tnt-series.png` },
    { id: "SPACE", name: "Space", logo: `${LOGO_BASE}/space.png` },
    { id: "AXN", name: "AXN", logo: `${LOGO_BASE}/axn.png` },
    { id: "UNIVERSAL", name: "Universal TV", logo: `${LOGO_BASE}/universal-tv.png` },
    { id: "USA", name: "USA Network", logo: `${LOGO_BASE}/usa-network.png` },
    { id: "MEGAPIX", name: "Megapix", logo: `${LOGO_BASE}/megapix.png` },
    { id: "PARAMOUNT", name: "Paramount Network", logo: `${LOGO_BASE}/paramount-network.png` },
    { id: "STUDIO UNIVERSAL", name: "Studio Universal", logo: `${LOGO_BASE}/studio-universal.png` },
    { id: "CANAL BRASIL", name: "Canal Brasil", logo: `${LOGO_BASE}/canal-brasil.png` },
    { id: "A&E", name: "A&E", logo: `${LOGO_BASE}/ae.png` },
    { id: "SONY", name: "Sony Channel", logo: `${LOGO_BASE}/sony-channel.png` },

    // ESPORTES
    { id: "SPORTV", name: "SporTV", logo: `${LOGO_BASE}/sportv.png` },
    { id: "SPORTV 2", name: "SporTV 2", logo: `${LOGO_BASE}/sportv-2.png` },
    { id: "SPORTV 3", name: "SporTV 3", logo: `${LOGO_BASE}/sportv-3.png` },
    { id: "ESPN", name: "ESPN", logo: `${LOGO_BASE}/espn.png` },
    { id: "ESPN 2", name: "ESPN 2", logo: `${LOGO_BASE}/espn-2.png` },
    { id: "ESPN 3", name: "ESPN 3", logo: `${LOGO_BASE}/espn-3.png` },
    { id: "ESPN 4", name: "ESPN 4", logo: `${LOGO_BASE}/espn-4.png` },
    { id: "BANDSPORTS", name: "BandSports", logo: `${LOGO_BASE}/bandsports.png` },
    { id: "PREMIERE CLUBES", name: "Premiere", logo: `${LOGO_BASE}/premiere.png` },
    { id: "PREMIERE 2", name: "Premiere 2", logo: `${LOGO_BASE}/premiere.png` },
    { id: "PREMIERE 3", name: "Premiere 3", logo: `${LOGO_BASE}/premiere.png` },
    { id: "COMBATE", name: "Combate", logo: `${LOGO_BASE}/combate.png` },

    // INFANTIL
    { id: "DISCOVERY KIDS", name: "Discovery Kids", logo: `${LOGO_BASE}/discovery-kids.png` },
    { id: "CARTOON NETWORK", name: "Cartoon Network", logo: `${LOGO_BASE}/cartoon-network.png` },
    { id: "CARTOONITO", name: "Cartoonito", logo: `${LOGO_BASE}/cartoonito.png` },
    { id: "GLOOB", name: "Gloob", logo: `${LOGO_BASE}/gloob.png` },
    { id: "GLOOBINHO", name: "Gloobinho", logo: `${LOGO_BASE}/gloobinho.png` },
    { id: "NICKELODEON", name: "Nickelodeon", logo: `${LOGO_BASE}/nickelodeon.png` },
    { id: "NICK JR", name: "Nick Jr", logo: `${LOGO_BASE}/nick-jr.png` },
    { id: "DISNEY CHANNEL", name: "Disney Channel", logo: `${LOGO_BASE}/disney-channel.png` },

    // VARIADOS E DOCUMENTÁRIOS
    { id: "VIVA", name: "Viva", logo: `${LOGO_BASE}/viva.png` },
    { id: "MULTISHOW", name: "Multishow", logo: `${LOGO_BASE}/multishow.png` },
    { id: "GNT", name: "GNT", logo: `${LOGO_BASE}/gnt.png` },
    { id: "DISCOVERY", name: "Discovery Channel", logo: `${LOGO_BASE}/discovery-channel.png` },
    { id: "DISCOVERY HOME & HEALTH", name: "Discovery H&H", logo: `${LOGO_BASE}/discovery-home-and-health.png` },
    { id: "HISTORY", name: "History Channel", logo: `${LOGO_BASE}/history.png` },
    { id: "HISTORY 2", name: "History 2", logo: `${LOGO_BASE}/history-2.png` },
    { id: "NATIONAL GEOGRAPHIC", name: "Nat Geo", logo: `${LOGO_BASE}/national-geographic.png` },
    { id: "ANIMAL PLANET", name: "Animal Planet", logo: `${LOGO_BASE}/animal-planet.png` },
    { id: "ID", name: "Investigation Discovery", logo: `${LOGO_BASE}/investigation-discovery.png` },
    { id: "E! ENTERTAINMENT", name: "E! Entertainment", logo: `${LOGO_BASE}/e-entertainment.png` },

    // NOTÍCIAS
    { id: "GLOBO NEWS", name: "GloboNews", logo: `${LOGO_BASE}/globonews.png` },
    { id: "CNN BRASIL", name: "CNN Brasil", logo: `${LOGO_BASE}/cnn-brasil.png` },
    { id: "JOVEM PAN NEWS", name: "Jovem Pan News", logo: `${LOGO_BASE}/jovem-pan-news.png` },
    { id: "BAND NEWS", name: "BandNews TV", logo: `${LOGO_BASE}/bandnews.png` }
];

function getPrograma(canalId) {
    const agora = new Date();
    if (!epgCache.length) return null;
    
    const prog = epgCache.find(p => {
        if (p.$.channel.toUpperCase() !== canalId.toUpperCase()) return false;
        const s = p.$.start;
        const start = new Date(s.substring(0,4), s.substring(4,6)-1, s.substring(6,8), s.substring(8,10), s.substring(10,12));
        const e = p.$.stop;
        const stop = new Date(e.substring(0,4), e.substring(4,6)-1, e.substring(6,8), e.substring(8,10), e.substring(10,12));
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
            description: info ? `🔴 AGORA: ${info.titulo}` : "Programação indisponível."
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
                description: info ? `PASSANDO AGORA:\n${info.titulo}\n\nSOBRE:\n${info.desc}` : "Informações de guia não encontradas."
            }
        };
    }
    return { meta: null };
});

const addonInterface = builder.getInterface();
module.exports = (req, res) => {
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
