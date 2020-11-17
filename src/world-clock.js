const templateHtml = `
<link rel="stylesheet" href="world-clock.css"/>
<style> /* Placeholder for hands' rules */ </style>
<style> /* Placeholder for ticks' rules */ </style>
<div part=face></div>
<div part=hours></div>
<div part=minutes></div>
<div part=seconds></div>
`;

export default class WorldClock extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({mode: 'open'}).innerHTML = templateHtml;
    }

    delays(hours, minutes, seconds)
    {
        return [
            {
                part: 'hours',
                delay: seconds + (minutes * 60) + (hours * 60 * 60)
            },
            {
                part: 'minutes',
                delay: seconds + (minutes * 60)
            },
            {
                part: 'seconds',
                delay: seconds
            }
        ];
    }

    setTime(d)
    {
        const h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
        const styleSheet = this.shadowRoot.styleSheets[1];
        while (styleSheet.cssRules.length)
        {
            styleSheet.deleteRule(0);
        }
        this.delays(h, m, s)
            .map(({part, delay}) => `div[part=${part}] { animation-delay: -${delay}s }`)
            .forEach(rule => styleSheet.insertRule(rule));
        return this;    
    }

    connectedCallback()
    {
        if (!this.hasAttribute("iso-date-time"))
        {
            this.setAttribute("iso-date-time", new Date().toISOString());
        }
        else if (isNaN(Date.parse(this.getAttribute('iso-date-time'))))
        {
            console.error("invalid iso-date-time", this.getAttribute('iso-date-time'));
            this.setAttribute("iso-date-time", new Date().toISOString());
        }
        this.drawFace().setTime(new Date(this.getAttribute('iso-date-time')));
    }

    drawFace()
    {
        const face = this.shadowRoot.querySelector("div[part=face]");
        const styleSheet = this.shadowRoot.styleSheets[2];
        for (let i = 0; i < 60; i+=5)
        {
            styleSheet.insertRule(`
                div[part=tick]:nth-child(${i+1}):before
                {
                    transform: translate(-50%, 50%) rotate(${-i * 6 - 30}deg);
                }`);
        }
        for (let i = 0; i < 60; i++)
        {
            styleSheet.insertRule(`
                div[part=tick]:nth-child(${i+1})
                {
                    transform: translate(-50%, -50%) rotate(${i * 6 - 60}deg) translateX(10em) rotate(90deg);
                }`);
            face.insertAdjacentHTML("beforeend", `<div part=tick></div>`);
        }
        return this;
    }
}
