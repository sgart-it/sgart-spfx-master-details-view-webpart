import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
//import { escape } from "@microsoft/sp-lodash-subset";
import { IResult } from "./IResult";
import { IMasterItem } from "./IMasterItem";
import { isNullOrWhiteSpace } from "../Helper";
import { IDetailItem } from "./IDetailItem";

let _context: WebPartContext = undefined;
let _locale: string = 'en-US';

const _httpOptionsGet: ISPHttpClientOptions = {
    headers: {
        'odata-version': '3.0',
        'accept': 'application/json;odata=nometadata',
    }
};

const ERROR_PREFIX = 'Custom error: ';

const _localeDateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
const _localeTimeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }; //, second: '2-digit' };
const _localeDateTimeOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }; //, second: '2-digit' };


const getString = (item: object, name: string): string | undefined => {
    try {
        const value = (item as any)[name];
        console.log('getString', item, item as any, (item as any)[name]);

        if (null === value) return undefined;

        return value;
    } catch (error) {
        console.error('getString', error);
        return undefined;
    }
};

const getDate = (item: object, name: string, format: string): string | undefined => {
    try {
        const value = (item as any)[name];

        if (null === value) return undefined;

        const date = new Date(value);

        switch (format) {
            case 'date':
                return date.toLocaleString(_locale, _localeDateOptions);
            case 'time':
                return date.toLocaleString(_locale, _localeTimeOptions);
            default:
                return date.toLocaleString(_locale, _localeDateTimeOptions).replace(',', '');
        }
    } catch (error) {
        console.error('getDate', error);
        return undefined;
    }
};

/*const getBoolean = (item: object, name: string): boolean => {
    try {
        const value = (item as any)[name];

        if (null === value) return undefined;

        return value === true || value === 'true';
    } catch (error) {
        console.error('getBoolean', error);
        return false;
    }
};*/

const getWebRelativeUrl = (webRelativeUrl: string): string => {
    let url = webRelativeUrl;
    if (url === undefined || url === null || url === '')
        url = _context.pageContext.web.serverRelativeUrl;
    if (url === '/')
        return '';
    return url;
};

const getListRelativeUrl = (webRelativeUrl: string, listName: string): string => {

    const relativeUrl = getWebRelativeUrl(webRelativeUrl);
    let urlPart: string = '';
    const isUrl = listName.length > 1 && listName[0] === '/';
    if (isUrl) {
        const listNameLower = listName.toLowerCase();
        if (listNameLower === '/lists') {
            urlPart = 'web/' + listNameLower;
        } else {
            urlPart = `web/GetList('${relativeUrl}${listName}')/items`;
        }
    } else {
        //{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
        const isGuid = listName.length === 38 && listName[0] === '{' && listName[37] === '}';
        if (isGuid) {
            urlPart = `web/lists(guid'${listName.substring(1, listName.length - 1)}')/items`;
        } else {
            urlPart = `web/lists/GetByTitle('${listName}')/items`;
        }
    }

    return relativeUrl + '/_api/' + urlPart;
}

export const initDataService = (context: WebPartContext): void => {
    _context = context;
    _locale = _context.pageContext.cultureInfo.currentCultureName;
};


export async function getMaster(webRelativeUrl: string, listName: string, idMaster: number): Promise<IResult<IMasterItem>> {
    const result: IResult<IMasterItem> = {
        success: false,
        data: {
            id: 0,
            title: '',
            codRegione: ''
        },
        error: 'not initialized',
        url: ''
    };

    try {
        // TODO: per questioni di performance indicare nella "$select=" solo i campi necessari
        const relativeUrl = getListRelativeUrl(webRelativeUrl, listName);
        result.url = relativeUrl + `?$filter=Id eq ${idMaster}`
            + "&$select=Id,Title,CodRegione"
            + "&$top=1";

        const response: SPHttpClientResponse = await _context.spHttpClient.get(result.url, SPHttpClient.configurations.v1, _httpOptionsGet);
        const responseJson = await response.json();

        if (responseJson['odata.error'] !== undefined) {
            result.error = ERROR_PREFIX + responseJson['odata.error'].message.value;
        } else {
            const spItems = responseJson.value;

            if (spItems === undefined) {
                result.error = `${ERROR_PREFIX}Response 'value' undefined, please check parameters and generated URL`;
            } else {
                if (spItems.length > 0) {
                    const spItem = spItems[0];

                    const title = getString(spItem, "Title");

                    result.data.id = spItem.Id;
                    result.data.title = isNullOrWhiteSpace(title) || title === '-' ? '' : title;
                    result.data.codRegione = getString(spItem, "CodRegione");
                }
                result.success = true;
                result.error = undefined;
            }
        }
    } catch (error) {
        console.error(`${ERROR_PREFIX}DataService.getMaster: ${listName}`, error);
        result.success = false;
        result.error = error;
    }
    return result;
}

export async function getDetails(webRelativeUrl: string, listName: string, filedName: string, idMaster: number): Promise<IResult<IDetailItem[]>> {
    const result: IResult<IDetailItem[]> = {
        success: false,
        data: [],
        error: 'not initialized',
        url: ''
    };

    try {
        // TODO: per questioni di performance indicare nella "$select=" solo i campi necessari
        const relativeUrl = getListRelativeUrl(webRelativeUrl, listName);
        result.url = relativeUrl + `?$filter=${filedName} eq ${idMaster}`
            + "&$select=Id,Title,CodProvincia,Modified"
            + "&$orderby=Title"
            + "&$top=5000";

        const response: SPHttpClientResponse = await _context.spHttpClient.get(result.url, SPHttpClient.configurations.v1, _httpOptionsGet);
        const responseJson = await response.json();

        if (responseJson['odata.error'] !== undefined) {
            result.error = ERROR_PREFIX + responseJson['odata.error'].message.value;
        } else {
            const spItems = responseJson.value;

            if (spItems === undefined) {
                result.error = `${ERROR_PREFIX}Response 'value' undefined, please check parameters and generated URL`;
            } else {
                result.data = spItems.map((item: any): IDetailItem => {
                    const title = getString(item, "Title");
                    return {
                        id: item.Id,
                        title: isNullOrWhiteSpace(title) || title === '-' ? '' : title,
                        codProvincia: getString(item, "CodProvincia"),
                        modified: getDate(item, "Modified", "date")
                    };
                });
                result.success = true;
                result.error = undefined;
            }
        }

    } catch (error) {
        console.error(`${ERROR_PREFIX}DataService.getDetails: ${listName}`, error);
        result.success = false;
        result.error = error;
    }
    return result;
}
