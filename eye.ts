interface LogGroupStep {
    startTime: number;
    timer: number;
}

const newLogGroupStep = (eye: Eye, elem: {name: string}, groupName: string): LogGroupStep => {
    return {
        startTime: Date.now(),
        timer: setTimeout(() => {
            eye.warn(`Step "${elem.name}" from log group "${groupName}" is working after 2 seconds!`);
        }, 2000)
    }
}

class LogGroup {
    private readonly steps: Map<string, LogGroupStep>;
    private readonly eye: Eye;
    private readonly name: string;
    private readonly message?: string;

    constructor(eye: Eye, name: string, message?: string) {
        this.eye = eye;
        this.steps = new Map<string, LogGroupStep>();
        this.name = name;
        this.message = message;
    };


    newStep(this, elem: {name: string}) {
        this.steps.set(elem.name, newLogGroupStep(this.eye, elem, this.name));
    };

    ready(this, key: string, finish: boolean): boolean {
        const step = this.steps.get(key);
        if (!step) {
            return false;
        }

        clearTimeout(step.timer);
        this.eye.ready(`Step "${key}" from log group "${this.name}" is ready by ${Date.now() - step.startTime} ms!`);

        if (finish) {
            if (this.message) {
                this.eye.ready(this.message + ` by ${Date.now() - this.steps.entries().next().value[1].startTime} ms!`);
            } else {
                this.eye.ready(`Step group "${this.name}" is ready by ${Date.now() - this.steps.entries().next().value[1].startTime} ms!`);
            }
            return true;
        } else {
            return false;
        }
    }
}

export enum MessageStyles {
    warn = 'warn',
    info = 'info',
    error = 'error',
    success = 'success'
}

const formatDate = () => {
    const DateNow = new Date(),
        Year = DateNow.getFullYear(),
        MonthConst = DateNow.getMonth() + 1,
        Month = MonthConst < 10? '0' + MonthConst : MonthConst,
        Day = DateNow.getDate(),
        Hours = DateNow.getHours(),
        MinutesConst = DateNow.getMinutes(),
        Minutes = MinutesConst < 10? `0${MinutesConst}` : MinutesConst,
        SecondsConst = DateNow.getSeconds(),
        Seconds = SecondsConst < 10? `0${SecondsConst}` : SecondsConst,
        Milliseconds = DateNow.getMilliseconds();
    return `${Year}/${Month}/${Day} ${Hours}:${Minutes}:${Seconds}.${Milliseconds}   `;
}

export class Eye {

    private readonly groups: Map<string, LogGroup>;
    private readonly baseStyle: string[];
    private readonly warnStyle: string[];
    private readonly errorStyle: string[];
    private readonly infoStyle: string[];
    private readonly successStyle: string[];
    private readonly readyStyle: string[];

    constructor(readyStyleIs = MessageStyles.success, baseStyle: string[] = [], warnStyle: string[] = [], errorStyle: string[] = [], infoStyle: string[] = [], successStyle: string[] = []) {
        this.groups = new Map<string, LogGroup>();
        this.baseStyle = baseStyle.length == 0 ? [
            "color: #fff",
            "width: 100%",
            "background-color: #333",
            "padding: 2px 4px",
            "font-size: 14px",
            "border-radius: 2px"
        ] : baseStyle
        this.warnStyle = warnStyle.length == 0 ? [
            "color: orange",
        ] : warnStyle
        this.errorStyle = errorStyle.length == 0 ? [
            "color: #fa0000",
        ] : errorStyle;
        this.infoStyle = infoStyle.length == 0 ? [
            "color: lightblue",
        ] : infoStyle;
        this.successStyle = successStyle.length == 0 ? [
            "color: #0fff83",
        ] : successStyle;
        switch (readyStyleIs) {
            case MessageStyles.success: {
                this.readyStyle = this.successStyle;
                break;
            }
            case MessageStyles.error: {
                this.readyStyle = this.errorStyle;
                break;
            }
            case MessageStyles.info: {
                this.readyStyle = this.infoStyle;
                break;
            }
            case MessageStyles.warn: {
                this.readyStyle = this.warnStyle;
                break;
            }
        }
    }

    newLogGroup(this, key: string, firstElem: {name: string}, message?: string) {
        this.info(`${formatDate()}Group: "${key}" was created.`);
        this.groups.set(key, new LogGroup(this, key, message))
        this.groups.get(key).newStep(firstElem);
    }

    newStep(key: string, elem: {name: string}) {
        this.groups.get(key).newStep(elem);
    }

    stepReady(this, key: string, stepName: string, finish = false) {
        if (this.groups.get(key).ready(stepName, finish)) {
            this.groups.delete(key);
        }
    }

    /**
     * styled log message
     * */
    enter(this, message: any, isTimeNecessary = true, style: string[] = []) {
        const realStyle = this.baseStyle.join(';') + ';' + style.join(';') + ';';
        if (typeof message === 'string') {
            console.log(`%c${isTimeNecessary ? formatDate() : ''}${message}`, realStyle)
        } else {
            console.log(`%c${isTimeNecessary ? formatDate() : ''}${JSON.stringify(message, null, 2)}`, realStyle)
        }
    }

    /**
     * log warn
     * */
    warn(this, message: any, isTimeNecessary = true) {
        this.enter(message, isTimeNecessary, this.warnStyle);
    }

    /**
     * log error
     * */
    error(this, message: any, isTimeNecessary = true) {
        this.enter(message, isTimeNecessary, this.errorStyle);
        console.trace()
    }

    /**
     * log info
     * */
    info(this, message: any, isTimeNecessary = true) {
        this.enter(message, isTimeNecessary, this.infoStyle);
    }

    /**
     * log success
     * */
    success(this, message: any, isTimeNecessary = true) {
        this.enter(message, isTimeNecessary, this.successStyle);
    }

    /**
     * log ready
     * */
    ready(this, message: any, isTimeNecessary = true) {
        this.enter(message, isTimeNecessary, this.readyStyle);
    }

    /**
     * log date, type and object. It can be used to log object or array.
     * */
    log(this, object: Object | any[] | Map<any, any> | Set<any>, isTimeNecessary = true, type: string = "log", style: string[] = []) {
        const realStyle = this.baseStyle.join(';') + ';' + style.join(';') + ';';
        console.log(`%c${isTimeNecessary ? formatDate() : ''}type: ${type}`, realStyle, object)
    }

    /**
     * log date, type and object. It can be used to log object or array.
     * */
    logWarn(this, object: Object | any[] | Map<any, any> | Set<any>, isTimeNecessary = true) {
        this.log(object, isTimeNecessary, 'warning', this.warnStyle);
    }

    /**
     * log date, type and object. It can be used to log object or array.
     * */
    logError(this, object: Object | any[] | Map<any, any> | Set<any>, isTimeNecessary = true) {
        this.log(object, isTimeNecessary, 'error', this.errorStyle);
        console.trace()
    }

    /**
     * log date, type and object. It can be used to log object or array.
     * */
    logInfo(this, object: Object | any[] | Map<any, any> | Set<any>, isTimeNecessary = true) {
        this.log(object, isTimeNecessary, 'info', this.infoStyle);
    }

    /**
     * log date, type and object. It can be used to log object or array.
     * */
    logSuccess(this, object: Object | any[] | Map<any, any> | Set<any>, isTimeNecessary = true) {
        this.log(object, isTimeNecessary, 'success', this.successStyle);
    }

    /**
     * log date, type and object. It can be used to log object or array.
     * */
    logReady(this, object: Object | any[] | Map<any, any> | Set<any>, isTimeNecessary = true) {
        this.log(object, isTimeNecessary, 'ready', this.readyStyle)
    }

    fetchSend(url: string, method: string, isTimeNecessary = true) {
        const realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
        let methodStyle: string;
        switch (method) {
            case "GET": {
                methodStyle = [
                    "background-color: #245980",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "POST": {
                methodStyle = [
                    "background-color: #00a550",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "DELETE": {
                methodStyle = [
                    "background-color: #fa0000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "PUT":
            case "PATCH": {
                methodStyle = [
                    "background-color: #ff8000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
        }
        let methodText = method;
        while (methodText.length < 7) {
            methodText += ' '
        }
        console.log(`%c${isTimeNecessary ? formatDate() : ''}fetch to |%c${methodText}%c "${url}"`, realStyle, methodStyle, realStyle);
    }

    fetchGet(url: string, method: string, statusCode: number, time: number, isTimeNecessary = true) {
        let realStyle: string;
        let methodStyle: string, statusCodeStyle: string;
        switch (method) {
            case "GET": {
                methodStyle = [
                    "background-color: #245980",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "POST": {
                methodStyle = [
                    "background-color: #00a550",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "DELETE": {
                methodStyle = [
                    "background-color: #fa0000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
            case "PUT":
            case "PATCH": {
                methodStyle = [
                    "background-color: #ff8000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                break;
            }
        }
        switch (+statusCode.toString()[0]) {
            case 1: {
                statusCodeStyle = [
                    "background-color: #245980",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
                break;
            }
            case 2: {
                statusCodeStyle = [
                    "background-color: #00a550",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.successStyle.join(';') + ';';
                break;
            }
            case 3: {
                statusCodeStyle = [
                    "background-color: orange",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
                break;
            }
            case 4: {
                statusCodeStyle = [
                    "background-color: #c26910",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.errorStyle.join(';') + ';';
                break;
            }
            case 5: {
                statusCodeStyle = [
                    "background-color: #fa0000",
                    "color: #fff",
                    "width: 100%",
                    "padding: 2px 4px",
                    "font-size: 14px",
                    "border-radius: 2px"
                ].join(';') + ';';
                realStyle = this.baseStyle.join(';') + ';' + this.errorStyle.join(';') + ';';
                break;
            }
        }
        let methodText = method;
        while (methodText.length < 7) {
            methodText += ' '
        }
        console.log(`%c${isTimeNecessary ? formatDate() : ''}fetch to |%c${methodText}%c "${url}"   |%c ${statusCode} %c|    ${time} ms`, realStyle, methodStyle, realStyle, statusCodeStyle, realStyle);
    }
}