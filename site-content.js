async function initSiteContent() {
  const content = await window.siteData.loadJSON('data/site-content.json');
  const main = document.querySelector('main');
  if (!main) return;

  const fillList = (id, values) => {
    const list = document.getElementById(id);
    if (!list) return;
    list.replaceChildren(...values.map(value => {
      const item = document.createElement('li');
      item.textContent = value;
      return item;
    }));
  };

  const about = document.getElementById('about-content');
  if (about) {
    about.replaceChildren(...content.about.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
  }

  const eventInfo = document.getElementById('event-information');
  if (eventInfo) {
    eventInfo.replaceChildren(...content.eventInformation.map(entry => {
      const line = document.createElement('p');
      const label = document.createElement('strong');
      label.textContent = `${entry.label}: `;
      line.append(label, document.createTextNode(entry.value));
      return line;
    }));
  }

  fillList('local-organizers', content.localOrganizers);
  fillList('special-thanks', content.specialThanks);

  const speakerSections = document.getElementById('speaker-category-list');
  if (speakerSections) {
    const speakers = await window.siteData.loadSpeakers();
    speakerSections.replaceChildren(...content.speakerCategories.map(category => {
      const section = document.createElement('section');
      const heading = document.createElement('h3');
      const list = document.createElement('ul');
      heading.textContent = category.label;
      speakers.filter(speaker => speaker.category === category.key).forEach(speaker => {
        const item = document.createElement('li');
        item.textContent = `${speaker.tabTitle}, ${speaker.affiliation}`;
        list.appendChild(item);
      });
      section.append(heading, list);
      return section;
    }));
  }

  const registration = document.getElementById('registration-content');
  if (registration) {
    registration.replaceChildren(...content.registration.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
  }

  const paymentLink = document.getElementById('registration-payment');
  if (paymentLink) {
    const url = content.paymentLink || content.paymentUrl || '';
    paymentLink.replaceChildren();
    if (url) {
      const label = document.createElement('p');
      label.innerHTML = '<strong>Payment link:</strong>';
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = content.paymentLinkLabel || 'Open payment page';
      paymentLink.append(label, link);
    } else {
      paymentLink.innerHTML = '<strong>Payment link:</strong> <span>Coming soon</span>';
    }
  }
}

window.initSiteContent = initSiteContent;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initSiteContent().catch(console.error));
} else {
  initSiteContent().catch(console.error);
}
