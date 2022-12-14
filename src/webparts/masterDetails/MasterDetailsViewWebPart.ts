import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneLink,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'MasterDetailsViewWebPartStrings';
import MasterDetails from './components/MasterDetailsView';
import { IMasterDetailsViewProps } from './components/IMasterDetailsViewProps';
import { IMasterDetailsViewWebPartProps } from './IMasterDetailsViewWebPartProps';
import { Data } from './data/DataService';
import { ViewMode } from './components/ViewMode';

export default class MasterDetailsViewWebPart extends BaseClientSideWebPart<IMasterDetailsViewWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    Data.initDataService(this.context);

    return super.onInit();
  }

  public render(): void {
    const params = new URLSearchParams(document.location.search);
    // attenzione il parametro in query string è case sensitive
    const idMaster = Number(params.get(this.properties.queryStringName));
    const props = this.properties;

    const element: React.ReactElement<IMasterDetailsViewProps> = React.createElement(
      MasterDetails,
      {
        isPropertyPaneOpen: this.context.propertyPane.isPropertyPaneOpen(),

        title: props.webpartTitle,
        detailsTitle: props.detailsTitle,
        viewMode: (ViewMode as any)[this.properties.viewMode],

        webRelativeUrl: props.webRelativeUrl,
        masterListName: props.masterListName,
        detailsListName: props.detailsListName,
        detailsMasterFieldName: props.detailsMasterFieldName,
        queryStringName: props.queryStringName,

        idMaster: idMaster,

        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    console.log('Master/Details instance id', this.context.instanceId);
    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    this.render();  // force render

    const viewModeOptions = Object.keys(ViewMode)
      .filter((v) => isNaN(Number(v)))
      .map(item => { return { key: item, text: item } });

    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          header: {
            description: strings.PropertyHeaderDescription
          },
          groups: [
            {
              groupName: strings.PresentationGroupName,
              groupFields: [
                PropertyPaneTextField('webpartTitle', {
                  label: strings.WebPartTitleLabel
                }),
                PropertyPaneTextField('detailsTitle', {
                  label: strings.DetailsTitleLabel
                }),
                PropertyPaneDropdown('viewMode', {
                  label: strings.ViewModeLabel,
                  options: viewModeOptions
                }),
              ]
            },
            {
              groupName: strings.SourceGroupName,
              groupFields: [
                PropertyPaneTextField('webRelativeUrl', {
                  label: strings.WebRelativeUrlLabel,
                  description: strings.WebRelativeUrlDescription
                }),
                PropertyPaneTextField('masterListName', {
                  label: strings.MasterListNameLabel,
                  description: strings.ListNameDescription
                }),
                PropertyPaneTextField('detailsListName', {
                  label: strings.DetailsListNameLabel,
                  description: strings.ListNameDescription
                }),
                PropertyPaneTextField('detailsMasterFieldName', {
                  label: strings.DetailsMasterFieldNameLabel,
                  description: strings.DetailsMasterFieldNameDescription
                }),
                PropertyPaneTextField('queryStringName', {
                  label: strings.QueryStringNameLabel,
                  description: strings.QueryStringNameDescription
                })
              ]
            },
            {
              groupName: strings.AboutGroupName,
              groupFields: [
                PropertyPaneLink('linkField', {
                  text: "Sgart.it",
                  href: "https://www.sgart.it/?SPFxMasterDetailsView",
                  target: "_blank"
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected onPropertyPaneConfigurationComplete(): void {
    this.render();
  }
  /*protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
  }*/
}
