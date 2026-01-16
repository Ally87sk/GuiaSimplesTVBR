const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");

const EPG_URL = "https://github.com/limaalef/BrazilTVEPG/raw/master/epg.xml";
let epgCache = [];

async function updateEPG() {
    try {
        console.log("Iniciando download do guia...");
        const response = await axios.get(EPG_URL, { timeout: 30000 }); // Dá 30 segundos para baixar
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        epgCache = result.tv.programme;
        console.log("✅ Guia de programação atualizado com sucesso!");
    } catch (err) {
        console.error("❌ Erro detalhado:", err.message);
        if (err.code === 'ECONNREFUSED') console.log("Verifique sua conexão com a internet.");
    }
}

updateEPG();
setInterval(updateEPG, 4 * 60 * 60 * 1000);

const builder = new addonBuilder({
    id: "org.guia.tvmap",
    name: "Guia TV Map Brasil",
    version: "1.0.0", // ESTA LINHA É OBRIGATÓRIA E DEVE SER ASSIM
    description: "Apenas programação atual dos canais brasileiros.",
    resources: ["catalog", "meta"],
    types: ["tv"],
    catalogs: [{
        type: "tv",
        id: "guia_br",
        name: "Programação Agora"
    }]
});

builder.defineCatalogHandler(async () => {
    const agora = new Date();

    const canaisParaMostrar = []

  const listaCanais = [
      // --- TV ABERTA ---
      { xmlId: "Globo", name: "Globo", logo: "https://i.imgur.com/7S879vS.png" },
      { xmlId: "SBT", name: "SBT", logo: "https://i.imgur.com/vHqQ9z4.png" },
      { xmlId: "Record", name: "Record TV", logo: "https://i.imgur.com/uG939z4.png" },
      { xmlId: "Band", name: "Band", logo: "https://i.imgur.com/O6S322P.png" },

      // --- FILMES E SÉRIES ---
      { xmlId: "HBO", name: "HBO", logo: "https://i.imgur.com/mS9X3zG.png" },
      { xmlId: "HBO2", name: "HBO 2", logo: "https://i.imgur.com/mS9X3zG.png" },
      { xmlId: "TelecinePremium", name: "Telecine Premium", logo: "https://i.imgur.com/Z4v0S0X.png" },
      { xmlId: "TelecineAction", name: "Telecine Action", logo: "https://i.imgur.com/Z4v0S0X.png" },
      { xmlId: "TelecinePipoca", name: "Telecine Pipoca", logo: "https://i.imgur.com/Z4v0S0X.png" },
      { xmlId: "Megapix", name: "Megapix", logo: "https://i.imgur.com/6Xw6X7X.png" },
      { xmlId: "TNT", name: "TNT", logo: "https://i.imgur.com/R3U6zY9.png" },
      { xmlId: "Cinemax", name: "Cinemax", logo: "https://i.imgur.com/T0W1W2Y.png" },
      { xmlId: "Warner", name: "Warner Channel", logo: "https://i.imgur.com/2s3D8W9.png" },
      { xmlId: "StudioUniversal", name: "Studio Universal", logo: "https://i.imgur.com/w9U6Y9X.png" },
      { xmlId: "AXN", name: "AXN", logo: "https://i.imgur.com/8N69vT1.png" },
      { xmlId: "UniversalTV", name: "Universal TV", logo: "https://i.imgur.com/5GzLpT7.png" },

      // --- VARIEDADES E DOCUMENTÁRIOS ---
      { xmlId: "Multishow", name: "Multishow", logo: "https://i.imgur.com/G9O6zW3.png" },
      { xmlId: "GNT", name: "GNT", logo: "https://i.imgur.com/H9O6zW3.png" },
      { xmlId: "DiscoveryChannel", name: "Discovery Channel", logo: "https://i.imgur.com/5GzLpT7.png" },
      { xmlId: "DiscoveryHomeHealth", name: "Discovery H&H", logo: "https://i.imgur.com/5GzLpT7.png" },
      { xmlId: "HistoryChannel", name: "History Channel", logo: "https://i.imgur.com/uG939z4.png" },
      { xmlId: "NationalGeographic", name: "Nat Geo", logo: "https://i.imgur.com/O6S322P.png" },

      // --- ESPORTES ---
      { xmlId: "SporTV", name: "SporTV", logo: "https://i.imgur.com/mOnd1H9.png" },
      { xmlId: "SporTV2", name: "SporTV 2", logo: "https://i.imgur.com/mOnd1H9.png" },
      { xmlId: "SporTV3", name: "SporTV 3", logo: "https://i.imgur.com/mOnd1H9.png" },
      { xmlId: "ESPN", name: "ESPN", logo: "https://i.imgur.com/yO8vW9R.png" },
      { xmlId: "ESPN2", name: "ESPN 2", logo: "https://i.imgur.com/yO8vW9R.png" },
      { xmlId: "ESPN4", name: "ESPN 4", logo: "https://i.imgur.com/yO8vW9R.png" },
      { xmlId: "Premiere", name: "Premiere", logo: "https://i.imgur.com/mOnd1H9.png" },
      { xmlId: "Premiere2", name: "Premiere 2", logo: "https://i.imgur.com/mOnd1H9.png" }
  ];

    const metas = canaisParaMostrar.map(canal => {
        const prog = epgCache.find(p => {
            if (p.$.channel !== canal.xmlId) return false;
            // Converte formato XMLTV (YYYYMMDDHHMMSS) para Date JS
            const start = new Date(p.$.start.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:00'));
            const stop = new Date(p.$.stop.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:00'));
            return agora >= start && agora <= stop;
        });

        const infoAtualmente = prog ? prog.title[0] : "Sem guia disponível";

        return {
            id: `guia_${canal.xmlId.toLowerCase()}`,
            type: "tv",
            name: `${canal.name} - 📅 ${infoAtualmente}`,
            poster: canal.logo,
            description: prog ? `Resumo: ${prog.desc ? prog.desc[0] : 'Sem descrição.'}` : ""
        };
    });

    return { metas };
});

// Handler de Meta (para quando o usuário clicar no canal ver detalhes)
builder.defineMetaHandler(({ id }) => {
    // Retorna detalhes extras se necessário
    return Promise.resolve({ meta: { id, type: "tv" } });
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });