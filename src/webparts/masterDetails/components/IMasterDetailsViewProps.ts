export interface IMasterDetailsViewProps {
  title: string;
  isPropertyPaneOpen: boolean;

  webRelativeUrl: string;
  masterListName: string;
  detailsListName: string;
  detailsMasterFieldName: string;
  queryStringName: string;

  idMaster: number;

  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
