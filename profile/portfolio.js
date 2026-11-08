// CV (October 2026) supplies current roles and dates; LinkedIn supplies additional projects.
window.PORTFOLIO = {
  name: 'Karan Kapur',
  role: 'Edge AI Engineer',
  email: 'karankapur.kapur@gmail.com',
  linkedin: 'https://www.linkedin.com/in/karukapur/',
  github: 'https://github.com/karukapur',
  threads: 'https://www.threads.com/@karukapur',
  selectedIds: ['sustainability', 'flipwords', 'whispener', 'edgesentry', 'sttc', 'noshi-boshi'],
  projects: [
    {
      id: 'flipwords', name: 'FlipWords', color: '#c4b0ed',
      caseStudy: {
        status: 'Experimental · Open source',
        contribution: 'I designed and built the Kotlin app, cover-screen overlay and adaptive vocabulary scheduler for the Galaxy Z Flip6.',
        decision: 'The scheduler uses screen activity and exposure across days to estimate familiarity. Learning-state signals stay on the device; the optional local AI Lab generates vocabulary packs.',
        result: 'A working vocabulary app with an open-source implementation and documented scheduling decisions.',
        limitation: 'Exposure is a proxy for familiarity, not a direct measure of recall. The cover-screen overlay is experimental and targets the Galaxy Z Flip6.'
      },
      organization: 'FlipWords · Open source', role: 'Design & development',
      logos: [{ src: 'profile/flipwords.svg', alt: 'FlipWords' }],
      resources: [{ label: 'View on GitHub', url: 'https://github.com/karukapur/flipwords' }],
      sourceUrl: 'https://github.com/karukapur/flipwords',
      mockup: { alt: 'FlipWords on a Galaxy Z Flip6: vocabulary on the folded cover screen and the Learn page on the open phone.' },
      notesUrl: 'https://github.com/karukapur/flipwords/blob/main/docs/SCHEDULER.md',
      timeline: '', year: '',
      type: 'Personal Android project', scope: 'Kotlin · Cover-screen overlay',
      big: 'Traditional Chinese, without opening your phone.',
      tabLabels: ['What', 'Why', 'The build', 'Source'],
      tabs: [
        'I built FlipWords for passive vocabulary learning on the Galaxy Z Flip6. Chinese words, pinyin and English appear on the cover screen, with an adaptive scheduler deciding when to revisit them.',
        'Learning a language can fit into the moments when you glance at your phone. The cover screen gives Traditional Chinese vocabulary a place in those everyday moments, without needing to open the app.',
        'Built in Kotlin, FlipWords combines an experimental cover-screen overlay with context-aware spaced repetition. Screen activity and exposure across days guide scheduling. Familiarity is estimated from exposure; recall is not directly measured.',
        'FlipWords is open source. The repository includes the Android app, scheduler documentation and setup instructions. Vocabulary and learning-state signals stay on the device, with an optional local AI Lab for generating vocabulary packs.'
      ]
    },
    {
      id: 'whispener', name: 'Whispener', color: '#a9c9e5', workOnly: true,
      caseStudy: {
        status: 'Android beta · Installed as Narad',
        contribution: 'I built the Kotlin and Jetpack Compose app, integrated Whisper and Sherpa inference, and implemented timestamped transcripts, local storage and session-preserving Pause and Resume.',
        decision: 'Keep the original Chinese transcript alongside optional English context. Audio stays in device memory; remote summaries are off by default and send finalized text only when enabled.',
        result: 'An Android beta with a recorded Listen-screen demo and open-source native inference integration.',
        limitation: 'The recording demonstrates the app flow, not a transcription benchmark. Optional remote summaries depend on the user-selected provider.'
      },
      organization: 'Narad · Android beta', role: 'Design & development',
      logos: [{ src: 'profile/whispener.svg', alt: 'Whispener microphone' }],
      resources: [{ label: 'View on GitHub', url: 'https://github.com/karukapur/whispener' }],
      sourceUrl: 'https://github.com/karukapur/whispener',
      video: { src: 'media/whispener-narad-demo.mp4', poster: 'media/whispener-narad-demo-poster.jpg', width: 1080, height: 2640, label: 'Whispener screen recording: the Narad Android app with English context and Traditional Chinese transcript panels' },
      timeline: '', year: '', type: 'Personal Android project · Beta',
      scope: 'Kotlin · Whisper / Sherpa · On-device speech',
      big: 'Follow the conversation. Keep the original words.',
      tabLabels: ['What', 'Why', 'The build', 'Source'],
      tabs: [
        'I built Whispener, installed as Narad, to help follow Chinese speech. The Android app preserves a timestamped Chinese transcript and can maintain a concise English context summary alongside it. The recording shows its Listen screen.',
        'Following a conversation in another language takes more than catching individual words. Narad keeps the original Chinese visible while offering English context, so the main idea and the words behind it stay together.',
        'Built with Kotlin and Jetpack Compose, the app runs Whisper through whisper.cpp or Sherpa on the phone. Voice activity detection segments incoming speech, Room stores finalized transcripts, and Pause and Resume preserve the same listening session.',
        'The repository includes the Android app, native inference integration and beta build instructions. Audio stays in memory on the device. Optional English summaries send finalized transcript text to a user-selected OpenRouter or Groq model; remote summaries are off by default.'
      ]
    },
    {
      id: 'edgesentry', name: 'EdgeSentry', color: '#b4c7c0',
      caseStudy: {
        status: 'Hardware prototype · Open source',
        contribution: 'I connected Grove Vision AI V2 inference to a XIAO ESP32-C3, built the serial-result parser, and exposed detection metadata through Wi-Fi and BLE.',
        decision: 'Run INT8 YOLOv8 on the Himax WE2 and transmit timing, classes and bounding boxes instead of camera footage. Recover complete JSON messages from fragmented UART data at 921600 baud.',
        result: 'Wi-Fi, BLE and USB power-bank operation are validated. Integration sketches and deployment notes are available in the source repository.',
        limitation: 'The exploded image is an enclosure concept. A production enclosure and dedicated mobile app are future work; no FPS or power benchmark is claimed here.'
      },
      organization: 'EdgeSentry · Open source', role: 'Design & development',
      logos: [{ src: 'profile/edgesentry.svg', alt: 'EdgeSentry camera reticle' }],
      resources: [{ label: 'View on GitHub', url: 'https://github.com/karukapur/edgesentry' }],
      sourceUrl: 'https://github.com/karukapur/edgesentry',
      mockup: { alt: 'EdgeSentry exploded hardware concept: OV5647 camera, Grove Vision AI V2, XIAO ESP32-C3, battery, charging board and magnetic enclosure.' },
      timeline: '', year: '', type: 'Personal edge-AI prototype',
      scope: 'YOLOv8 · Himax WE2 · ESP32-C3 · Wi-Fi / BLE',
      big: 'A little field tech. A lot of local intelligence.',
      tabLabels: ['What', 'Why', 'The build', 'Source'],
      tabs: [
        'I built EdgeSentry as a compact object-detection prototype. A Grove Vision AI V2 runs YOLOv8 locally, while a XIAO ESP32-C3 sends detection results to a phone over a self-hosted Wi-Fi dashboard or BLE.',
        'A small camera can do useful work without streaming its view to the cloud. EdgeSentry keeps inference on the device and sends only detection metadata: timing, classes and bounding boxes. Think pocket-sized field tech, with a little 007 energy.',
        'The Himax WE2 pairs a Cortex-M55 with an Ethos-U55 NPU for INT8 inference. I connected its UART1 output to the ESP32-C3 at 921600 baud and built a parser to recover complete JSON results from fragmented serial data.',
        'The open-source repository contains the integration sketches, deployment notes and engineering learnings. Wi-Fi, BLE and USB power-bank operation are validated; the exploded view shows a hardware concept. A dedicated mobile app and production enclosure are future work.'
      ]
    },
    {
      id: 'edge-ai', name: 'On-device AI', color: '#b9b9ed',
      caseStudy: {
        status: 'Current role · NXP Semiconductors',
        contribution: 'As Lead Software Engineer, I develop research prototypes and Python/C++ implementations with hardware, compiler and runtime teams.',
        decision: 'Treat quantization and model optimization as hardware-aware trade-offs across accuracy, latency and memory for CNNs, LLMs and VLMs on Ara2 NPUs.',
        result: 'Current engineering work connecting model research with practical on-device inference constraints.',
        limitation: 'This is a role overview. Project-specific implementation details and performance results are not published on this page.'
      },
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
      id: 'embedded', name: 'Embedded systems', color: '#a8c8c4',
      caseStudy: {
        status: 'Completed role · Himax Technologies',
        contribution: 'I ported algorithm stacks, optimized DSP and deployed vision, audio and ML pipelines on ARM-based edge ASIC platforms. Implementations included a JPEG encoder and a data-over-sound modem.',
        decision: 'Design around buffers, memory and I/O rather than treating inference in isolation. JPEG work included adaptive quantization and rate control; profiling considered CPU/NPU throughput.',
        result: 'Work included sub-2 MB SRAM deployments, a modem transferring 1 MB payloads, and technical training for 30+ engineers.',
        limitation: 'These figures describe deployment constraints, payload size and training reach. They are not comparative speed or accuracy benchmarks.'
      },
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
      id: 'sustainability', name: 'AI for sustainability', color: '#b9cbaa',
      caseStudy: {
        status: 'Completed contract · Corporate Knights',
        contribution: 'I designed and implemented GPT-4, LangChain and RAG pipelines for taxonomy-aligned extraction, combining prompt engineering, fine-tuning and multi-source, multi-step processing.',
        decision: 'Keep source context connected to extracted metrics and retain human review before delivering structured insights to the database.',
        result: 'The project reported a 92% data validation success rate and delivered human-validated insights to a real-time database used by client organizations.',
        limitation: 'The public portfolio does not include the evaluation sample, denominator or baseline, so 92% should not be read as general model accuracy. Dashboard data and trends are illustrative.'
      },
      organization: 'Corporate Knights', role: 'AI Consultant · Contract',
      logos: [{ src: 'profile/logos/corporate-knights-wordmark.png', alt: 'Corporate Knights logo' }],
      resources: [
        { label: 'Corporate Knights', url: 'https://corporateknights.com/' },
        { label: 'Research resources', url: 'https://corporateknights.com/resources/' }
      ],
      timeline: 'Aug 2023 — Feb 2024', year: '2023–24', type: 'NLP & sustainability research',
      scope: 'GPT-4 · LangChain · RAG · Information extraction',
      big: 'Turning climate disclosures into useful, validated data.',
      work: {
        previewUrl: 'profile/sustainability-work.html',
        tabLabels: ['What', 'Why', 'The build', 'Impact'],
        tabs: [
          'I worked with Corporate Knights on an AI document workflow for sustainability research. The system turns complex disclosures into structured metrics and supports human validation, making the data easier to analyze at scale.',
          'ESG and annual reports hold useful climate data, but inconsistent layouts and terminology make comparisons difficult. The workflow connects extracted figures to their source context and a shared sustainability taxonomy.',
          'I built NLP pipelines with GPT-4, LangChain, and retrieval-augmented generation, combining prompt engineering, fine-tuning, and multi-source, multi-step information extraction.',
          'The project achieved a 92% data validation success rate and delivered human-validated insights to a real-time database used by client organizations. The laptop shows an illustrative version of that workflow.'
        ]
      },
      tabs: [
        'I designed and implemented NLP pipelines using GPT-4, LangChain, and retrieval-augmented generation to support sustainability research at Corporate Knights.',
        'Climate disclosures contain valuable information in inconsistent formats. The work focused on extracting metrics aligned with Corporate Knights’ taxonomy.',
        'I combined prompt engineering, fine-tuning, and multi-source, multi-step information extraction, achieving a 92% data validation success rate.',
        'The pipelines delivered human-validated insights to a real-time database used by client organizations, with people involved in checking the results.'
      ]
    },
    {
      id: 'sttc', name: 'Building STTC', color: '#e1bba8',
      caseStudy: {
        status: 'Ongoing community · Co-founder',
        contribution: 'I co-founded a community-led platform connecting engineers, researchers, founders, students and technology leaders in Southern Taiwan.',
        decision: 'Build connections across organizations and disciplines through panels, webinars, workshops and networking, spanning AI, semiconductors, sustainability and entrepreneurship.',
        result: 'The community brings together participants representing 11 countries and 15+ technical and professional fields.',
        limitation: 'These counts describe the community represented in this portfolio, not attendance at a single event. Current programming is listed on the STTC website.'
      },
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
      id: 'camh', name: 'NLP for learning', color: '#afc5e3',
      caseStudy: {
        status: 'Completed collaborative project',
        contribution: 'I developed an NLP tool in collaboration with CAMH to organize training responses and identify themes relevant to improving training methods.',
        decision: 'Explore BERTopic, Top2Vec and LDA as different ways of organizing open-ended feedback. The interactive map explains the approaches using synthetic coordinates rather than participant responses.',
        result: 'A topic-modelling tool and exploration of three approaches for identifying themes in training feedback.',
        limitation: 'The map is illustrative, not model output. Participant data, comparative evaluation scores and downstream training outcomes are not published here.'
      },
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
      id: 'education', name: 'Across disciplines', color: '#d8c99e',
      caseStudy: {
        status: 'BE 2021 · MEng 2023',
        contribution: 'I completed a chemical engineering BE at TIET and an MEng at the University of Toronto with an emphasis in analytics and machine learning. Research and study also included DRDO and NCKU.',
        decision: 'Connect physical systems with data and software, alongside leadership as a Massey College Junior Fellow, Sustainable Engineers Association Program Director and founding secretary of the TIET ACM chapter.',
        result: 'An interdisciplinary foundation supported by a MITACS Globalink Research Award Abroad, Massey College bursaries and scholarships, and TIET merit scholarships.',
        limitation: 'This page summarizes education and selected activities. The CV provides the consolidated chronology.'
      },
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
      id: 'noshi-boshi', name: 'Noshi Boshi', color: '#d1b7bd',
      caseStudy: {
        status: 'Founder experience · 2021–22',
        contribution: 'I co-founded a meal-kit delivery service in Delhi, working on the customer experience from first encounter through to cooking a meal.',
        decision: 'Pair curated recipes with authentic ingredients so customers could explore unfamiliar cuisines and cooking techniques at home.',
        result: 'A meal-kit service and product experience, illustrated here by the supplied unboxing animation.',
        limitation: 'The animation shows the product concept and presentation. Customer counts, revenue and other traction metrics are not published in this portfolio.'
      },
      video: { src: 'media/noshi-boshi-unboxing.mp4', poster: 'media/noshi-boshi-unboxing-poster.jpg', label: 'Noshi Boshi meal-kit product unboxing animation' },
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
