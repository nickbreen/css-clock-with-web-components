// noinspection JSUnusedLocalSymbols
function html(strings, ...keys)
{
    const domParser = new DOMParser()
    return domParser.parseFromString(strings.raw.join(''), 'text/html').firstElementChild;
}

const templateHtml = html`
<link rel="stylesheet" href="world-clock.css"/>
<div part="face">
    <div part="tick" style="--i: 0"></div>
    <div part="tick" style="--i: 1"></div>
    <div part="tick" style="--i: 2"></div>
    <div part="tick" style="--i: 3"></div>
    <div part="tick" style="--i: 4"></div>
    <div part="tick" style="--i: 5"></div>
    <div part="tick" style="--i: 6"></div>
    <div part="tick" style="--i: 7"></div>
    <div part="tick" style="--i: 8"></div>
    <div part="tick" style="--i: 9"></div>
    <div part="tick" style="--i: 10"></div>
    <div part="tick" style="--i: 11"></div>
    <div part="tick" style="--i: 12"></div>
    <div part="tick" style="--i: 13"></div>
    <div part="tick" style="--i: 14"></div>
    <div part="tick" style="--i: 15"></div>
    <div part="tick" style="--i: 16"></div>
    <div part="tick" style="--i: 17"></div>
    <div part="tick" style="--i: 18"></div>
    <div part="tick" style="--i: 19"></div>
    <div part="tick" style="--i: 20"></div>
    <div part="tick" style="--i: 21"></div>
    <div part="tick" style="--i: 22"></div>
    <div part="tick" style="--i: 23"></div>
    <div part="tick" style="--i: 24"></div>
    <div part="tick" style="--i: 25"></div>
    <div part="tick" style="--i: 26"></div>
    <div part="tick" style="--i: 27"></div>
    <div part="tick" style="--i: 28"></div>
    <div part="tick" style="--i: 29"></div>
    <div part="tick" style="--i: 30"></div>
    <div part="tick" style="--i: 31"></div>
    <div part="tick" style="--i: 32"></div>
    <div part="tick" style="--i: 33"></div>
    <div part="tick" style="--i: 34"></div>
    <div part="tick" style="--i: 35"></div>
    <div part="tick" style="--i: 36"></div>
    <div part="tick" style="--i: 37"></div>
    <div part="tick" style="--i: 38"></div>
    <div part="tick" style="--i: 39"></div>
    <div part="tick" style="--i: 40"></div>
    <div part="tick" style="--i: 41"></div>
    <div part="tick" style="--i: 42"></div>
    <div part="tick" style="--i: 43"></div>
    <div part="tick" style="--i: 44"></div>
    <div part="tick" style="--i: 45"></div>
    <div part="tick" style="--i: 46"></div>
    <div part="tick" style="--i: 47"></div>
    <div part="tick" style="--i: 48"></div>
    <div part="tick" style="--i: 49"></div>
    <div part="tick" style="--i: 50"></div>
    <div part="tick" style="--i: 51"></div>
    <div part="tick" style="--i: 52"></div>
    <div part="tick" style="--i: 53"></div>
    <div part="tick" style="--i: 54"></div>
    <div part="tick" style="--i: 55"></div>
    <div part="tick" style="--i: 56"></div>
    <div part="tick" style="--i: 57"></div>
    <div part="tick" style="--i: 58"></div>
    <div part="tick" style="--i: 59"></div>
</div>
<div part=hours></div>
<div part=minutes></div>
<div part=seconds></div>
`;

export default class WorldClock extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'}).appendChild(templateHtml.cloneNode(true))
    }

    // noinspection JSUnusedGlobalSymbols
    static get observedAttributes() {
        return ['tz']
    }

    get tz() {
        return this.getAttribute('tz')
    }

    set tz(tz) {
        this.setAttribute('tz', tz)
        this.applyTime()
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.applyTime()
    }

    // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'tz':
                this.applyTime()
                break
        }
    }

    get delays() {
        const dateTimeFormat = new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: this.tz ? this.tz : 'UTC'});
        const {hour, minute, second} = Object.fromEntries(dateTimeFormat.formatToParts(Date.now())
            .filter(part => ['hour', 'minute', 'second'].indexOf(part.type) !== -1)
            .map(({type, value}) => [type, Number.parseInt(value, 10)]));
        return [
            {
                part: 'hours',
                delay: second + (minute * 60) + (hour * 60 * 60)
            },
            {
                part: 'minutes',
                delay: second + (minute * 60)
            },
            {
                part: 'seconds',
                delay: second
            }
        ];
    }

    applyTime() {
        this.delays.forEach(({part, delay}) => {
            // setting this as a style attribute (rather than adding a stylesheet rule) redraws the hands
            this.shadowRoot.querySelector(`div[part=${part}]`).style.animationDelay = `-${delay}s`
        })
    }
}
