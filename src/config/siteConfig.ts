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
    { minAge: 12, maxAge: 99, price: 150, label: "12 anos acima" },
  ] as const,
  
  pixKey: "61984624381",
  pixName: "Ivanildes - Caixa econômica",
  paymentLink: "https://mpago.la/173pkHo",
  
  sisters: [
    { name: "Irmã Ivanildes", phone: "61984624381", role: "Secretaria" },
    { name: "Irmã Stephanie", phone: "61998762089", role: "Secretaria" },
    { name: "Irmã Ladyvania", phone: "83993832746", role: "Presidente/Lider" },
  ],
  
  whatsappMessage: "Oi! Estou com dúvidas sobre o Retiro de Jovens.",
  
  // Líderes - casais e irmãs
  leaderCouples: [
    {
      label: "Pastores Presidentes",
      members: [
        {
          name: "Pr. Albertino e Pra. Francisca",
          role: "Pastores Presidentes",
          photo: "../src/assets/pastor1.jpeg",
        },
      ],
    },
    {
      label: "Líderes de Jovens",
      members: [
        {
          name: "Diác. Iracema",
          role: "Líder de Jovens no Vila do Boa",
          photo: "../src/assets/lider-zumbi.jpeg",
        },
        {
          name: "Irmã Ladyvania",
          role: "Presidente/Líder de Jovens",
          photo: "../src/assets/presidente.jpeg",
        },
        {
          name: "Irmã Wanessa",
          role: "Líder de jovens na Master",
          photo: "../src/assets/lider-cruz.jpeg",
        },
        {
          name: "Irmã Janaína",
          role: "Líder de jovens na Master",
          photo: "../src/assets/lider-cru.jpeg",
        },
        {
          name: "Diác. Fábio",
          role: "Líder de Jovens na Sede",
          photo: "../src/assets/fabio.jpeg",
        },
        {
          name: "Diac. Luana",
          role: "Líder de Jovens na Sede",
          photo: "../src/assets/diac-luana.jpeg",
        },
      ],
    },
  ],
  
  leaderSisters: [
    {
      name: "Irmã Ivanildes",
      role: "Tesoureira geral de jovens e adolescentes",
      photo: "../src/assets/iva.png",
    },
    {
      name: "Irmã Stephanie",
      role: "Secretaria geral de jovens e adolescentes",
      photo: "../src/assets/ste.png",
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
