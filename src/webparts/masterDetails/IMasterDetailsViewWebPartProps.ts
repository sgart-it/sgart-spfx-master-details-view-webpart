export interface IMasterDetailsViewWebPartProps {
    webpartTitle: string;
    detailsTitle: string;
    viewMode: string;
    
    webRelativeUrl: string;
    masterListName: string;
    detailsListName: string;
    detailsMasterFieldName: string;
    queryStringName: string;
}
