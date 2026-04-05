// ========================================
// CONFIGURAÇÃO DO SITE - EDITE AQUI
// ========================================

export const SITE_CONFIG = {
  churchName: "Igreja Puxando a Rede",
  retreatTitle: "Retiro de Jovens da ADPR",
  heroSubtitle: "3 dias de imersão na presença de Deus. Louvor, palavra, comunhão e muita aventura!",
  eventDate: "24 a 26 de Julho de 2026",
  aboutText: `O Retiro de Jovens da ADPR é um momento especial de encontro com Deus e com outros jovens. 
  São 3 dias intensos de louvor, pregação da Palavra, momentos de oração, atividades ao ar livre, 
  esportes, dinâmicas e muita comunhão. Venha viver essa experiência transformadora!`,
  
  maxVagas: 50,
  minAge: 12,
  
  priceTiers: [
    { minAge: 12, maxAge: 15, price: 150, label: "12 a 15 anos" },
    { minAge: 16, maxAge: 20, price: 200, label: "16 a 20 anos" },
    { minAge: 21, maxAge: 99, price: 250, label: "Acima de 21 anos" },
  ] as const,
  
  pixKey: "61984624381",
  pixName: "Ivanildes - Caixa econômica",
  paymentLink: "https://mpago.la/173pkHo",
  
  sisters: [
    { name: "Irmã Ivanildes", phone: "61984624381", role: "Secretaria" },
    { name: "Irmã Stephanie", phone: "61998762089", role: "Secretaria" },
    { name: "Irmã Ladyvania", phone: "83993832746", role: "Presidente/Lider" },
  ],
  
  whatsappMessage: "Oi! Estou com dúvidas sobre o Retiro de Jovens da ADPR.",
  
  // Líderes - casais e irmãs
  // Para trocar as fotos: substitua os arquivos na pasta public/leaders/
  // Nomes dos arquivos: pastor.jpg, pastora.jpg, lider-jovens.jpg, lider-jovens-fem.jpg,
  //                     irma-maria.jpg, irma-ana.jpg, irma-rebeca.jpg
  leaderCouples: [
    {
      label: "Pastores Presidentes",
      members: [
        {
          name: "Pr. Albertino e Pra. Francisca",
          role: "Pastores Presidentes",
          photo: "/leaders/pastor1.jpeg",
        },
      ],
    },
  ],

  leaderSisters: [
    {
          name: "Diác. Iracema",
          role: "Líder de Jovens no Vila do Boa",
          photo: "/leaders/lider-zumbi.jpeg",
        },
        {
          name: "Missionaria Ladyvania",
          role: "Presidente/Líder de Jovens",
          photo: "/leaders/presidente.jpeg",
        },
        {
          name: "Diác. Wanessa",
          role: "Líder de jovens na Master",
          photo: "/leaders/lider-cruz.jpeg",
        },
        {
          name: "Irmã Janaína",
          role: "Líder de jovens na Master",
          photo: "/leaders/lider-cru.jpeg",
        },
        {
          name: "Diác. Fábio",
          role: "Líder de Jovens na Sede",
          photo: "/leaders/fabio.jpeg",
        },
        {
          name: "Diac. Luana",
          role: "Líder de Jovens na Sede",
          photo: "/leaders/diac-luana.jpeg",
        },
  ],

  leaderAuxiliares: [
    {
      name: "Irmã Ivanildes",
      role: "Tesoureira geral de jovens e adolescentes",
      photo: "/leaders/iva.png",
    },
    {
      name: "Irmã Stephanie",
      role: "Secretaria geral de jovens e adolescentes",
      photo: "/leaders/ste.png",
    },
  ],
};

export const getWhatsAppLink = (phone: string) => {
  const msg = encodeURIComponent(SITE_CONFIG.whatsappMessage);
  return `https://wa.me/${phone}?text=${msg}`;
};

export const calculatePrice = (age: number): number | null => {
  if (age < SITE_CONFIG.minAge) return null;
  const tier = SITE_CONFIG.priceTiers.find(t => age >= t.minAge && age <= t.maxAge);
  return tier ? tier.price : null;
};