const styleCss = `
:host([hidden])
{
    display: none;
}

:host
{
    display: block;
    border-radius: 50%;
    shape-outside: circle();
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

div[part=numeral]
{
    position: absolute;
    top: 50%; 
    left: 50%;
    counter-increment: numerals;
}

div[part=numeral]:after
{
    content: counter(numerals, upper-roman);
}

div[part=numeral]:nth-of-type( 1)
{
    transform: translate(-50%, -50%) rotate(-60deg) translateX(9em) rotate(  60deg);
}
div[part=numeral]:nth-of-type( 2)
{
    transform: translate(-50%, -50%) rotate(-30deg) translateX(9em) rotate(  30deg);
}
div[part=numeral]:nth-of-type( 3)
{
    transform: translate(-50%, -50%) rotate(  0deg) translateX(9em) rotate(   0deg);
}
div[part=numeral]:nth-of-type( 4)
{
    transform: translate(-50%, -50%) rotate( 30deg) translateX(9em) rotate( -30deg);
}

div[part=numeral]:nth-of-type( 5)
{
    transform: translate(-50%, -50%) rotate( 60deg) translateX(9em) rotate( -60deg);
}
div[part=numeral]:nth-of-type( 6)
{
    transform: translate(-50%, -50%) rotate( 90deg) translateX(9em) rotate( -90deg);
}
div[part=numeral]:nth-of-type( 7)
{
    transform: translate(-50%, -50%) rotate(120deg) translateX(9em) rotate(-120deg);
}
div[part=numeral]:nth-of-type( 8)
{
    transform: translate(-50%, -50%) rotate(150deg) translateX(9em) rotate(-150deg);
}

div[part=numeral]:nth-of-type( 9)
{
    transform: translate(-50%, -50%) rotate(180deg) translateX(9em) rotate(-180deg);
}
div[part=numeral]:nth-of-type(10)
{
    transform: translate(-50%, -50%) rotate(210deg) translateX(9em) rotate(-210deg);
}
div[part=numeral]:nth-of-type(11)
{
    transform: translate(-50%, -50%) rotate(240deg) translateX(9em) rotate(-240deg);
}
div[part=numeral]:nth-of-type(12)
{
    transform: translate(-50%, -50%) rotate(270deg) translateX(9em) rotate(-270deg);
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
    border-radius: 50%/6%;
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
        transform: rotate(360deg);
    }
}
`;

const templateHtml = `
<style>${styleCss}</style>
<style>
    /* Placeholder for animation-delay rules */
</style>
<div part=face>
    <div part=numeral></div>
    <div part=numeral></div>
    <div part=numeral></div>
    <div part=numeral></div>

    <div part=numeral></div>
    <div part=numeral></div>
    <div part=numeral></div>
    <div part=numeral></div>

    <div part=numeral></div>
    <div part=numeral></div>
    <div part=numeral></div>
    <div part=numeral></div>
</div>
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
        this.setTime(new Date(this.getAttribute('iso-date-time')));
    }
}