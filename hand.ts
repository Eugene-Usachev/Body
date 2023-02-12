import {Eye} from './eye'

interface eyeI {
    eye: Eye;
}
export const handEye: eyeI = {
    eye: Eye
}

export const handConfig = {
    domain: 'http://localhost:4040',
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: '',
    isTimeNecessary: true,
    showDomain: false,
    reactions: {
        onContinue: (response: Response) => {return response},
        onSwitchingProtocols: (response: Response) =>{return response},
        onOK: (response: Response) => {return response},
        onCreated: (response: Response) => {return response},
        onAccepted: (response: Response) => {return response},
        onNonAuthoritativeInformation: (response: Response) => {return response},
        onNoContent: (response: Response) => {return response},
        onResetContent: (response: Response) => {return response},
        onPartialContent: (response: Response) => {return response},
        onMultipleChoices: (response: Response) => {return response},
        onMovedPermanently: (response: Response) => {return response},
        onFound: (response: Response) => {return response},
        onSeeOther: (response: Response) => {return response},
        onNotModified: (response: Response) => {return response},
        onUseProxy: (response: Response) => {return response},
        onTemporaryRedirect: (response: Response) => {return response},
        onBadRequest: (response: Response) => {return response},
        onUnauthorized: (response: Response) => {return response},
        onPaymentRequired: (response: Response) => {return response},
        onForbidden: (response: Response) => {return response},
        onNotFound: (response: Response) => {return response},
        onMethodNotAllowed: (response: Response) => {return response},
        onNotAcceptable: (response: Response) => {return response},
        onProxyAuthenticationRequired: (response: Response) => {return response},
        onRequestTimeout: (response: Response) => {return response},
        onConflict: (response: Response) => {return response},
        onGone: (response: Response) => {return response},
        onLengthRequired: (response: Response) => {return response},
        onPreconditionFailed: (response: Response) => {return response},
        onPayloadTooLarge: (response: Response) => {return response},
        onURITooLong: (response: Response) => {return response},
        onUnsupportedMediaType: (response: Response) => {return response},
        onRangeNotSatisfiable: (response: Response) => {return response},
        onExpectationFailed: (response: Response) => {return response},
        onInternalServerError: (response: Response) => {return response},
        onNotImplemented: (response: Response) => {return response},
        onBadGateway: (response: Response) => {return response},
        onServiceUnavailable: (response: Response) => {return response},
        onGatewayTimeout: (response: Response) => {return response},
        onHTTPVersionNotSupported: (response: Response) => {return response}
    }
};

export enum RestApiMethods {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Patch = "PATCH",
    Delete = "DELETE",
    Options = "OPTIONS",
}

export const hand = (url: string, method: RestApiMethods,
     body?: any,
     credentials: "include" | "same-origin" | "omit" = handConfig.credentials,
     mode: "no-cors" | "cors" | "same-origin" = handConfig.mode,
     cache: "default" | "no-cache" | "reload" | "force-cache" | "only-if-cached" = handConfig.cache,
     headers: { "Content-Type": 'application/json' } | { 'Content-Type': 'application/x-www-form-urlencoded' } | {'Content-Type': string} = handConfig.headers,
     showDomain: boolean = handConfig.showDomain,
     redirect: 'manual' | 'follow' | 'error'= handConfig.redirect,
     referrerPolicy: 'no-referrer' | 'client' | any = handConfig.referrerPolicy) => {
    const realUrl = handConfig.domain + url;
    showDomain ? handEye.eye.fetchSend(realUrl, method, handConfig.isTimeNecessary) : handEye.eye.fetchSend(url, method, handConfig.isTimeNecessary);
    const dateNow = new Date();
    return fetch(realUrl, {
        method: method,
        body: body,
        mode: mode,
        cache: cache,
        credentials: credentials,
        headers: headers,
        redirect: redirect,
        referrerPolicy: referrerPolicy
    }).then(response => {
        showDomain ? handEye.eye.fetchGet(realUrl, method, response.status, Date.now() - dateNow, handConfig.isTimeNecessary) : handEye.eye.fetchGet(url, method, response.status, Date.now() - dateNow, handConfig.isTimeNecessary)
        switch (response.status) {
            case 100:
                return handConfig.reactions.onContinue(response);
            case 101:
                return handConfig.reactions.onSwitchingProtocols(response);
            case 200:
                return handConfig.reactions.onOK(response);
            case 201:
                return handConfig.reactions.onCreated(response);
            case 202:
                return handConfig.reactions.onAccepted(response);
            case 203:
                return handConfig.reactions.onNonAuthoritativeInformation(response);
            case 204:
                return handConfig.reactions.onNoContent(response);
            case 205:
                return handConfig.reactions.onResetContent(response);
            case 206:
                return handConfig.reactions.onPartialContent(response);
            case 300:
                return handConfig.reactions.onMultipleChoices(response);
            case 301:
                return handConfig.reactions.onMovedPermanently(response);
            case 302:
                return handConfig.reactions.onFound(response);
            case 303:
                return handConfig.reactions.onSeeOther(response);
            case 304:
                return handConfig.reactions.onNotModified(response);
            case 305:
                return handConfig.reactions.onUseProxy(response);
            case 307:
                return handConfig.reactions.onTemporaryRedirect(response);
            case 400:
                return handConfig.reactions.onBadRequest(response);
            case 401:
                return handConfig.reactions.onUnauthorized(response);
            case 402:
                return handConfig.reactions.onPaymentRequired(response);
            case 403:
                return handConfig.reactions.onForbidden(response);
            case 404:
                return handConfig.reactions.onNotFound(response);
            case 405:
                return handConfig.reactions.onMethodNotAllowed(response);
            case 406:
                return handConfig.reactions.onNotAcceptable(response);
            case 407:
                return handConfig.reactions.onProxyAuthenticationRequired(response);
            case 408:
                return handConfig.reactions.onRequestTimeout(response);
            case 409:
                return handConfig.reactions.onConflict(response);
            case 410:
                return handConfig.reactions.onGone(response);
            case 411:
                return handConfig.reactions.onLengthRequired(response);
            case 412:
                return handConfig.reactions.onPreconditionFailed(response);
            case 413:
                return handConfig.reactions.onPayloadTooLarge(response);
            case 414:
                return handConfig.reactions.onURITooLong(response);
            case 415:
                return handConfig.reactions.onUnsupportedMediaType(response);
            case 416:
                return handConfig.reactions.onRangeNotSatisfiable(response);
            case 417:
                return handConfig.reactions.onExpectationFailed(response);
            case 500:
                return handConfig.reactions.onInternalServerError(response);
            case 501:
                return handConfig.reactions.onNotImplemented(response);
            case 502:
                return handConfig.reactions.onBadGateway(response);
            case 503:
                return handConfig.reactions.onServiceUnavailable(response);
            case 504:
                return handConfig.reactions.onGatewayTimeout(response);
            case 505:
                return handConfig.reactions.onHTTPVersionNotSupported(response);
            default:
                console.error(`Unhandled response status: ${response.status}`);
                break
        }
    })
}