const styleCss = `
:host([hidden])
{
    display: none;
}

:host
{
    display: block;
    border-radius: 50%;
    position: relative;
    height: 20em;
    width: 20em;
    shape-outside: circle();
}

:host:before 
{
    background: black;
    border-radius: 50%;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 5%;
    height: 5%;
}
                
div[part=hours], 
div[part=minutes],
div[part=seconds],
div[part=face]
{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

div[part=face]
{
    counter-reset: numerals;
}

div[part=tick]:nth-of-type(5n+1)
{
    counter-increment: numerals;
}

div[part=tick]:nth-of-type(5n+1):before
{
    content: counter(numerals, upper-roman);
}

div[part=tick]
{
    position: absolute;
    top: 50%;
    left: 50%;
}
div[part=tick]:before
{
    position: absolute;
}
div[part=tick]:after
{
    content: "";
    background: #666;
    position: absolute;
    height: 0.5em;
    width: 1px;
}

div[part=tick]:nth-of-type(5n+1):after
{
    content: "";
    background: #333;
    position: absolute;
    height: 0.25em;
    width: 2px;
}

div[part=hours]
{
    animation: rotate 43200s infinite linear;
}
div[part=minutes]
{
    animation: rotate 3600s infinite steps(60);
}
div[part=seconds] 
{
    animation: rotate 60s infinite steps(60);
}

div[part=hours]:after,
div[part=minutes]:after,
div[part=seconds]:after
{
    content: "";
    background: black;
    position: absolute;
    transform-origin: 50% 100%;
}
div[part=hours]:after
{
    height: 20%;
    left: 48.75%;
    top: 30%;
    width: 2.5%;
    border-radius: 50%/5%;
}
div[part=minutes]:after
{
    height: 40%;
    left: 49%;
    top: 10%;
    width: 2%;
    border-radius: 50%/4%;
}
div[part=seconds]:after
{
    background-color: red;
    height: 45%;
    left: 49.5%;
    top: 14%;
    width: 1%;
    border-radius: 50%/2%;
}

div[part=seconds]:before 
{
    background: red;
    border-radius: 50%;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 2.5%;
    height: 2.5%;
}
@keyframes rotate 
{
    to 
    {
        transform: rotate(360deg);
    }
}`;

const templateHtml = `
<style>${styleCss}</style>
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