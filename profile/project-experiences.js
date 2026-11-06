(() => {
  const svg = content => `<svg viewBox="0 0 600 360" fill="none" aria-hidden="true" focusable="false">${content}</svg>`;
  const text = (x, y, label, cls = '') => `<text x="${x}" y="${y}" class="${cls}">${label}</text>`;
  const option = (label, title, body, tag) => ({ label, title, body, tag });

  const experiences = {
    'edge-ai': {
      label: '01 / Model to silicon', prompt: 'Choose a model family', caption: 'A conceptual deployment pipeline',
      options: [
        option('CNN', 'Every operation has a cost.', 'For CNNs, the engineering focus includes quantization and model optimization for efficient on-device inference. Accuracy, latency, and memory have to be considered together.', 'CNN · Quantization & efficiency'),
        option('LLM', 'Make room for language.', 'LLM optimization brings model size and inference efficiency into the same conversation. My work connects research prototypes with Python/C++ implementations and the target processor.', 'LLM · Memory & inference'),
        option('VLM', 'Bring vision and language together.', 'VLMs are another model family in my optimization work at NXP. Deployment means working with hardware, compiler, and runtime teams to fit advanced models to the device.', 'VLM · Hardware-aware deployment')
      ],
      graphic: () => svg(`
        <defs><pattern id="silicon-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="currentColor" opacity=".08"/></pattern></defs>
        <rect x="1" y="1" width="598" height="358" rx="24" fill="url(#silicon-grid)"/>
        ${[0, 1, 2].map((i) => `<g data-focus="${i}" class="signal"><path d="M151 ${90 + i * 84}H204L245 174"/><rect x="40" y="${62 + i * 84}" width="110" height="56" rx="10"/>${text(95, 96 + i * 84, ['CNN', 'LLM', 'VLM'][i], 'svg-center')}</g>`).join('')}
        <path class="trace" d="M350 174H404M462 215V266H300V224"/>
        <rect x="236" y="100" width="128" height="146" rx="18" class="chip-pins"/>
        <rect x="246" y="113" width="108" height="120" rx="12" class="silicon-core"/>
        ${text(300, 153, 'OPTIMIZE', 'svg-center core-label')}${text(300, 184, 'CNN', 'svg-center core-model')}
        <text x="300" y="207" class="svg-center core-small">QUANTIZE · FIT</text>
        <rect x="406" y="128" width="151" height="88" rx="14" class="device-node"/>
        ${text(481, 164, 'ON DEVICE', 'svg-center')}${text(481, 190, 'NXP · Ara2 NPU', 'svg-center svg-small')}
        ${text(40, 331, '01 / MODEL', 'svg-small')}${text(246, 331, '02 / OPTIMIZE', 'svg-small')}${text(439, 331, '03 / DEPLOY', 'svg-small')}`)
    },
    embedded: {
      label: '02 / The embedded workbench', prompt: 'Trace a signal', caption: 'An illustrative signal path through an embedded system',
      options: [
        option('Vision', 'A smaller footprint. A useful image.', 'At Himax, I engineered computer vision and ML models for ARM-based edge ASIC platforms. Work included a JPEG encoder with adaptive quantization and rate control.', 'Computer vision · JPEG'),
        option('Audio', 'Listen within the limits.', 'I worked on audio models and DSP under memory and I/O constraints. Buffer-aware pipelines and predictable throughput matter when deploying on small devices.', 'Audio · DSP · Buffers'),
        option('Data-over-sound', 'Let sound carry the data.', 'My implementations included a data-over-sound modem transferring 1 MB payloads. The work sat alongside porting algorithm stacks to MCUs with less than 2 MB of SRAM.', 'Data-over-sound · 1 MB payloads')
      ],
      graphic: () => svg(`
        <defs><pattern id="bench-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="currentColor" opacity=".16"/></pattern></defs>
        <rect x="8" y="8" width="584" height="344" rx="22" fill="url(#bench-grid)" stroke="currentColor" stroke-opacity=".15"/>
        <g class="signal" data-focus="0"><path d="M140 90H213L250 147"/><rect x="56" y="63" width="84" height="54" rx="8"/><circle cx="98" cy="90" r="14"/></g>
        <g class="signal" data-focus="1"><path d="M140 180H250M53 180h12l9-20 13 40 15-51 15 44 10-13h13"/></g>
        <g class="signal" data-focus="2"><path d="M140 270H213L250 213M72 248q40 22 0 44m18-55q58 33 0 66"/>${text(53, 273, '01', 'svg-small')}</g>
        <path class="trace" d="M350 160H415V90H532M350 200H415V270H532"/>
        <rect x="235" y="122" width="130" height="116" rx="6" class="chip-pins"/>
        <rect x="248" y="135" width="104" height="90" rx="5" class="silicon-core"/>
        ${text(300, 175, 'MCU', 'svg-center core-model')}${text(300, 202, 'ARM / C++', 'svg-center core-small')}
        <rect x="430" y="58" width="118" height="64" rx="7" class="device-node"/>
        <rect x="430" y="238" width="118" height="64" rx="7" class="device-node"/>
        ${text(489, 96, 'CPU / NPU', 'svg-center')}${text(489, 266, 'SRAM', 'svg-center')}${text(489, 286, 'under 2 MB', 'svg-center svg-small')}
        ${text(255, 318, 'MEMORY · LATENCY · I/O', 'svg-small')}`)
    },
    sustainability: {
      label: '03 / From disclosure to insight', prompt: 'Follow the research', caption: 'An illustrated research workflow · Corporate Knights, 2023–24',
      options: [
        option('Disclosure', 'Start with the source.', 'Climate disclosures contain valuable information in inconsistent formats. At Corporate Knights, the work focused on extracting metrics aligned with its sustainability taxonomy.', '01 / Source documents'),
        option('Extraction', 'Give the information structure.', 'I designed NLP pipelines using GPT-4, LangChain, and retrieval-augmented generation, combining prompt engineering, fine-tuning, and multi-source, multi-step extraction.', '02 / NLP pipeline'),
        option('Human validation', 'Keep people in the loop.', 'The project achieved a 92% data validation success rate. This is a reported outcome from my Corporate Knights work, with people involved in checking the extracted results.', '03 / Project outcome'),
        option('Insight', 'Put checked insights to work.', 'The pipelines delivered human-validated insights to a real-time database used by client organizations, connecting sustainability research with useful, structured information.', '04 / Research to database')
      ],
      graphic: () => `<div class="research-stack" aria-hidden="true">
        <div class="report-sheet" data-focus="0"><span class="sheet-label">Source / 01</span><strong>Climate<br>disclosures</strong><div class="paper-lines"></div><span class="paper-stamp">Read for context</span></div>
        <div class="report-sheet" data-focus="1"><span class="sheet-label">Extract / 02</span><strong>Reports →<br>structured data</strong><div class="extraction-row">Sources <span>→</span> Taxonomy</div><div class="paper-lines"></div></div>
        <div class="report-sheet" data-focus="2"><span class="sheet-label">Validate / 03</span><strong class="result-number">92<span>%</span></strong><p>Data validation success rate</p><span class="paper-stamp">Corporate Knights · Project outcome</span></div>
        <div class="report-sheet" data-focus="3"><span class="sheet-label">Insight / 04</span><strong>Human-validated.<br>Ready to use.</strong><div class="database-drawing">Research<br>↓<br>Real-time database</div></div>
      </div>`
    },
    camh: {
      label: '05 / Listening for patterns', prompt: 'Explore a topic-modelling approach', caption: 'Illustrative topic map · no participant data · not model output',
      options: [
        option('BERTopic', 'Find themes through semantic similarity.', 'BERTopic groups document embeddings and uses class-based TF-IDF to describe the resulting topics. It was one of the approaches explored in my collaborative CAMH training-response project.', 'Embeddings → Clusters → Topic words'),
        option('Top2Vec', 'Put words and documents in a shared space.', 'Top2Vec learns topic, document, and word representations in a joint embedding space. It was another approach explored to identify relevant themes in training responses.', 'Documents + Words → Topic vectors'),
        option('LDA', 'See a response as a mixture of topics.', 'Latent Dirichlet allocation represents documents as mixtures of topics, with each topic described by a distribution over words. The project explored LDA alongside BERTopic and Top2Vec.', 'Documents → Topic mixtures')
      ],
      sources: [
        ['BERTopic method reference ↗', 'https://maartengr.github.io/BERTopic/algorithm/algorithm.html'],
        ['Top2Vec method reference ↗', 'https://github.com/ddangelov/Top2Vec'],
        ['LDA research paper ↗', 'https://www.jmlr.org/papers/v3/blei03a.html']
      ],
      graphic: () => svg(`
        <path class="map-axis" d="M55 30V315H560"/>
        <ellipse cx="166" cy="130" rx="95" ry="76" class="topic-halo halo-a"/><ellipse cx="425" cy="117" rx="92" ry="68" class="topic-halo halo-b"/><ellipse cx="319" cy="255" rx="109" ry="65" class="topic-halo halo-c"/>
        ${Array.from({ length: 36 }, (_, i) => { const group = Math.floor(i / 12), angle = (i % 12) * 2.4, radius = 20 + (i % 4) * 15; return `<circle class="topic-point topic-${group}" data-point="${i}" cx="${[166, 425, 319][group] + Math.cos(angle) * radius}" cy="${[130, 117, 255][group] + Math.sin(angle) * radius * .65}" r="${i % 5 === 0 ? 7 : 4}"/>`; }).join('')}
        ${text(88, 43, 'RESPONSES → THEMES', 'svg-small')}${text(86, 339, 'A WAY TO ORGANIZE OPEN-ENDED FEEDBACK', 'svg-small')}`)
    },
    education: {
      label: '06 / Notes from a winding path', prompt: 'Open a chapter', caption: 'Selected education and career connections',
      options: [
        option('Chemical engineering', 'Start with physical systems.', 'My Bachelor of Engineering in chemical engineering is from Thapar Institute of Engineering and Technology, completed in 2021. That foundation connects physical systems, data, and engineering.', 'TIET / BE · 2021'),
        option('Analytics & ML', 'Learn a new language for problems.', 'I completed a Master of Engineering at the University of Toronto, with an emphasis in analytics and machine learning, in December 2023. Earlier research included DRDO and a computer science semester at NCKU.', 'University of Toronto / MEng · 2023'),
        option('Engineering practice', 'Carry the connections forward.', 'My path now spans embedded engineering at Himax and on-device model optimization at NXP. Community building through STTC is another way I connect people and technical disciplines.', 'Himax → NXP · STTC')
      ],
      graphic: () => `<div class="notebook-page" aria-hidden="true"><span class="notebook-label">Field notes / Karan Kapur</span>
        <div class="journey-track"><div data-focus="0" class="journey-stop"><span>01</span><strong>Physical<br>systems</strong><small>BE · Chemical engineering</small></div><div data-focus="1" class="journey-stop"><span>02</span><strong>Data &<br>learning</strong><small>MEng · Analytics & ML</small></div><div data-focus="2" class="journey-stop"><span>03</span><strong>Useful<br>technology</strong><small>Embedded · Edge AI · Community</small></div></div>
        <span class="notebook-footer">Different disciplines. Connected questions.</span></div>`
    },

  };

  window.mountProjectExperience = (host, project) => {
    if (project.video) {
      host.hidden = false;
      host.setAttribute('aria-label', project.video.label);
      mountProjectVideo(host, project);
      return;
    }
    if (project.mockup) {
      host.hidden = false;
      host.setAttribute('aria-label', `${project.name} preview`);
      mountProjectMockup(host, project);
      return;
    }
    if (project.liveUrl) {
      host.hidden = false;
      host.setAttribute('aria-label', `${project.name} live website`);
      host.classList.add('live-site');
      host.innerHTML = '<div class="live-site-toolbar"><span>Live website</span><a class="live-site-link" target="_blank" rel="noopener">Open website ↗</a></div><iframe class="live-site-frame" loading="eager" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      host.querySelector('.live-site-link').href = project.liveUrl;
      const frame = host.querySelector('.live-site-frame');
      frame.title = `${project.organization} — live website`;
      frame.src = project.liveUrl;
      return;
    }
    const experience = experiences[project.id];
    if (!experience) return;
    host.hidden = false;
    host.setAttribute('aria-label', experience.prompt);
    host.innerHTML = `<p class="experience-label"></p><figure class="experience-visual">${experience.graphic()}<figcaption></figcaption></figure>
      <div class="experience-controls" role="group"><p class="experience-prompt" id="experience-prompt"></p><div class="experience-buttons"></div></div>
      <div class="experience-detail" aria-live="polite" aria-atomic="true"><p class="experience-tag"></p><h2 class="experience-title"></h2><p class="experience-copy"></p></div>
      <a class="experience-source" target="_blank" rel="noopener" hidden></a>`;
    host.querySelector('.experience-label').textContent = experience.label;
    host.querySelector('figcaption').textContent = experience.caption;
    host.querySelector('.experience-prompt').textContent = experience.prompt;
    host.querySelector('.experience-controls').setAttribute('aria-labelledby', 'experience-prompt');
    const buttonHost = host.querySelector('.experience-buttons');
    const source = host.querySelector('.experience-source');
    const highlights = [...host.querySelectorAll('[data-focus]')];
    const points = [...host.querySelectorAll('[data-point]')];
    const buttons = experience.options.map((choice, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = choice.label;
      button.setAttribute('aria-controls', 'experience-detail');
      button.addEventListener('click', () => select(i));
      buttonHost.append(button);
      return button;
    });
    host.querySelector('.experience-detail').id = 'experience-detail';
    function select(index) {
      const choice = experience.options[index];
      host.dataset.choice = String(index);
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      host.querySelector('.experience-tag').textContent = choice.tag;
      host.querySelector('.experience-title').textContent = choice.title;
      host.querySelector('.experience-copy').textContent = choice.body;
      highlights.forEach(node => node.classList.toggle('is-active', node.dataset.focus.split(' ').includes(String(index))));
      const model = host.querySelector('.core-model');
      if (project.id === 'edge-ai' && model) model.textContent = choice.label;
      // These fixed, synthetic layouts explain approaches without using participant data.
      points.forEach((point, i) => {
        const group = Math.floor(i / 12), angle = (i % 12) * 2.4, radius = 20 + (i % 4) * 15;
        const centers = index === 0 ? [[166, 130], [425, 117], [319, 255]] : index === 1 ? [[200, 150], [365, 125], [310, 237]] : [[175, 100], [300, 180], [425, 260]];
        point.setAttribute('cx', centers[group][0] + Math.cos(angle) * radius);
        point.setAttribute('cy', centers[group][1] + Math.sin(angle) * radius * .65);
      });
      if (experience.sources) {
        source.hidden = false;
        source.textContent = experience.sources[index][0];
        source.href = experience.sources[index][1];
      }
    }
    select(0);
  };
})();
