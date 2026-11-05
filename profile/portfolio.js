// CV (October 2026) supplies current roles and dates; LinkedIn supplies additional projects.
window.PORTFOLIO = {
  name: 'Karan Kapur',
  role: 'Edge AI Engineer',
  email: 'karankapur.kapur@gmail.com',
  linkedin: 'https://www.linkedin.com/in/karukapur/',
  github: 'https://github.com/karukapur',
  threads: 'https://www.threads.com/@karukapur',
  projects: [
    {
      id: 'edge-ai', name: 'On-device AI', coverTitle: ['AI, AT', 'THE EDGE.'], color: '#b9b9ed',
      organization: 'NXP Semiconductors', role: 'Lead Software Engineer',
      logos: [{ src: 'profile/logos/nxp.svg', alt: 'NXP Semiconductors logo' }],
      resources: [{ label: 'NXP website', url: 'https://www.nxp.com/' }],
      timeline: 'Oct 2026 — Present', year: '2026', type: 'Edge AI & optimization',
      scope: 'Quantization · CNNs · LLMs · VLMs',
      big: 'Advanced models. Real hardware. Every byte counts.',
      tabs: [
        'I work on quantization and model optimization for CNNs, LLMs, and VLMs, targeting efficient on-device inference on NXP’s Ara2 NPUs.',
        'Deploying a model means balancing accuracy, latency, and memory. My focus is turning those trade-offs into practical engineering decisions.',
        'I develop research prototypes and Python/C++ implementations in collaboration with hardware, compiler, and runtime teams.',
        'My work connects model research with the constraints of the processor that actually has to run it.'
      ]
    },
    {
      id: 'embedded', name: 'Embedded systems', coverTitle: ['SMALL', 'FOOTPRINT.'], color: '#a8c8c4',
      organization: 'Himax Technologies', role: 'Senior Engineer · AI & Deployment',
      logos: [{ src: 'profile/logos/himax.png', alt: 'Himax Technologies logo' }],
      resources: [{ label: 'Himax website', url: 'https://www.himax.com.tw/' }],
      timeline: 'Mar 2024 — Sep 2026', year: '2024–26', type: 'Embedded engineering',
      scope: 'C/C++ · DSP · CPU/NPU profiling',
      big: 'Useful systems, built within less than 2 MB of SRAM.',
      tabs: [
        'At Himax, I engineered computer vision, audio, and ML models for ARM-based embedded edge ASIC platforms under memory, latency, and accelerator-throughput constraints.',
        'Small devices need buffer-aware pipelines and predictable throughput. I ported algorithm stacks to sub-2 MB SRAM MCUs and tuned DSP under memory and I/O constraints.',
        'My implementations included a JPEG encoder with adaptive quantization and rate control, and a data-over-sound modem transferring 1 MB payloads.',
        'I worked across hardware, firmware, product, and runtime teams, delivered technical training to 30+ engineers, and presented Edge AI demonstrations at global forums.'
      ]
    },
    {
      id: 'sustainability', name: 'AI for sustainability', coverTitle: ['REPORTS', 'TO INSIGHT.'], color: '#b9cbaa',
      organization: 'Corporate Knights', role: 'AI Consultant · Contract',
      logos: [{ src: 'profile/logos/corporate-knights-wordmark.png', alt: 'Corporate Knights logo' }],
      resources: [
        { label: 'Corporate Knights', url: 'https://corporateknights.com/' },
        { label: 'Research resources', url: 'https://corporateknights.com/resources/' }
      ],
      timeline: 'Aug 2023 — Feb 2024', year: '2023–24', type: 'NLP & sustainability research',
      scope: 'GPT-4 · LangChain · RAG · Information extraction',
      big: 'Turning climate disclosures into useful, validated data.',
      tabs: [
        'I designed and implemented NLP pipelines using GPT-4, LangChain, and retrieval-augmented generation to support sustainability research at Corporate Knights.',
        'Climate disclosures contain valuable information in inconsistent formats. The work focused on extracting metrics aligned with Corporate Knights’ taxonomy.',
        'I combined prompt engineering, fine-tuning, and multi-source, multi-step information extraction, achieving a 92% data validation success rate.',
        'The pipelines delivered human-validated insights to a real-time database used by client organizations, with people involved in checking the results.'
      ]
    },
    {
      id: 'sttc', name: 'Building STTC', coverTitle: ['BETTER', 'CONNECTED.'], color: '#e1bba8',
      liveUrl: 'https://sttc.tw/',
      organization: 'Southern Taiwan Technology Council', role: 'Co-Founder',
      logos: [{ src: 'profile/logos/sttc.png', alt: 'Southern Taiwan Technology Council logo' }],
      resources: [
        { label: 'STTC website', url: 'https://sttc.tw/' },
        { label: 'Events & community', url: 'https://sttc.tw/events/' }
      ],
      timeline: 'Jan 2026 — Present', year: '2026', type: 'Technology community',
      scope: 'AI · Semiconductors · Sustainability · Events',
      big: 'Good technology starts with people finding each other.',
      tabs: [
        'I co-founded the Southern Taiwan Technology Council, a community-led platform connecting engineers, researchers, founders, students, and technology leaders.',
        'The community brings people together across organizations and disciplines through panels, webinars, workshops, and networking events.',
        'Our programming spans AI, semiconductors, sustainability, manufacturing, and technology entrepreneurship. Participants represent 11 countries and 15+ technical and professional fields.',
        'Building STTC is an extension of my engineering work: making advanced technology easier to understand and creating space for people to learn from each other.'
      ]
    },
    {
      id: 'camh', name: 'NLP for learning', coverTitle: ['LISTEN.', 'LEARN.'], color: '#afc5e3',
      organization: 'CAMH · Collaborative project', role: 'NLP project contributor',
      logos: [{ src: 'profile/logos/camh.svg', alt: 'Centre for Addiction and Mental Health logo' }],
      resources: [{ label: 'CAMH website', url: 'https://www.camh.ca/' }],
      timeline: 'Oct 2022 — Dec 2023', year: '2022–23', type: 'Applied NLP project',
      scope: 'BERTopic · Top2Vec · LDA',
      big: 'Finding actionable patterns in training responses.',
      tabs: [
        'I developed an NLP tool in collaboration with the Centre for Addiction and Mental Health (CAMH) to classify training responses and support improvements to training methods.',
        'Open-ended responses can reveal opportunities that are difficult to identify one response at a time. Topic modelling helps organize that feedback.',
        'The project explored BERTopic, Top2Vec, and latent Dirichlet allocation to identify relevant themes and areas for improvement.',
        'This work reflects my interest in applying machine learning to practical questions with a clear human context.'
      ]
    },
    {
      id: 'education', name: 'Across disciplines', coverTitle: ['CHEMISTRY', 'TO COMPUTE.'], color: '#d8c99e',
      organization: 'University of Toronto · TIET', role: 'MEng · BE',
      logos: [
        { src: 'profile/logos/toronto.jpg', alt: 'University of Toronto logo' },
        { src: 'profile/logos/thapar.jpg', alt: 'Thapar Institute of Engineering and Technology logo' }
      ],
      resources: [
        { label: 'University of Toronto', url: 'https://www.utoronto.ca/' },
        { label: 'Thapar Institute', url: 'https://www.thapar.edu/' }
      ],
      timeline: 'BE 2021 · MEng 2023', year: '2021–23', type: 'Education & research',
      scope: 'Machine learning · Analytics · Chemical engineering',
      big: 'An engineering foundation that crosses disciplines.',
      tabs: [
        'I completed a Master of Engineering at the University of Toronto, with an emphasis in analytics and machine learning, in December 2023. My Bachelor of Engineering in chemical engineering is from Thapar Institute of Engineering and Technology.',
        'My path combines physical systems, data, and software. Earlier research included work at DRDO and a computer science semester abroad at National Cheng Kung University.',
        'At Toronto, I was a Junior Fellow at Massey College and Program Director at the Sustainable Engineers Association. At TIET, I was a founding secretary of the ACM student chapter.',
        'Awards include the MITACS Globalink Research Award Abroad, Massey College bursaries and scholarships, and TIET merit scholarships.'
      ]
    },
    {
      id: 'noshi-boshi', name: 'Noshi Boshi', coverTitle: ['MAKE IT.', 'FROM SCRATCH.'], color: '#d1b7bd',
      organization: 'Noshi Boshi · Delhi, India', role: 'Co-Founder',
      logos: [{ src: 'profile/logos/noshi-boshi.jpg', alt: 'Noshi Boshi logo' }],
      resources: [{ label: 'Noshi Boshi on LinkedIn', url: 'https://www.linkedin.com/company/noshiboshiofficial/' }],
      timeline: 'Apr 2021 — Nov 2022', year: '2021–22', type: 'Entrepreneurship',
      scope: 'Meal kits · Curated recipes · Customer experience',
      big: 'Making new cuisines easier to explore at home.',
      tabs: [
        'I co-founded Noshi Boshi, a meal-kit delivery service in Delhi for food enthusiasts, budding chefs, and culinary professionals.',
        'The service introduced customers to cuisines and cooking techniques from around the world through curated recipes and authentic ingredients.',
        'This was an opportunity to work on a business from the customer’s first encounter through to the experience of cooking a meal.',
        'Entrepreneurship remains part of how I approach engineering and community building: start with a real need and make something useful.'
      ]
    }
  ]
};
