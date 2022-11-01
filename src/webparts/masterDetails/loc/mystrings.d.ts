declare interface IMasterDetailsViewWebPartStrings {
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;

  PropertyHeaderDescription: string;
  PresentationGroupName: string;
  SourceGroupName: string;
  AboutGroupName: string;


  WebPartTitleLabel: string;
  
  WebRelativeUrlLabel: string;
  WebRelativeUrlDescription: string;
  MasterListNameLabel: string;
  ListNameDescription: string;
  DetailsListNameLabel: string;
  DetailsMasterFieldNameLabel: string;
  DetailsMasterFieldNameDescription: string;

  QueryStringNameLabel: string;
  QueryStringNameDescription: string;

}

declare module 'MasterDetailsViewWebPartStrings' {
  const strings: IMasterDetailsViewWebPartStrings;
  export = strings;
}
