const styleCss = `
:host([hidden])
{
    display: none;
}

:host
{
    display: block;
    background: white url(face.svg) no-repeat center;
    background-size: 90%;
    border: 1px red solid;
    border-radius: 50%;
    position: relative;
    height: 20em;
    width: 20em;
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
div[part=seconds] 
{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
div[part=hours]
{
    animation: rotate 43200s infinite linear;
}
div[part=minutes]
{
    animation: rotate 3600s infinite steps(60);
    /* transition: transform 0.3s cubic-bezier(.4,2.08,.55,.44); */
}
div[part=seconds] 
{
    animation: rotate 60s infinite steps(60);
    /* transition: transform 0.2s cubic-bezier(.4,2.08,.55,.44); */
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
@keyframes rotate {
    100% {
        transform: rotateZ(360deg);
    }
}`;


const templateHtml = `
<style>${styleCss}</style>
<style>
    /* Placeholder for animation-delay rules */
</style>
<div part=hours></div>
<div part=minutes></div>
<div part=seconds></div>
`

export default class WorldClock extends HTMLElement
{
    constructor()
    {
        super();
        const template = this.ownerDocument.createElement('template');
        template.innerHTML = templateHtml;

        this.attachShadow({mode: 'open'}).appendChild(
            template.content.cloneNode(true));
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
    }

    connectedCallback()
    {
        if (!this.hasAttribute("iso-date-time"))
        {
            this.setAttribute("iso-date-time", new Date().toISOString());
        }

        this.setTime(new Date(this.getAttribute('iso-date-time')));
    }
}