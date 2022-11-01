import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneLink,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'MasterDetailsViewWebPartStrings';
import MasterDetails from './components/MasterDetailsView';
import { IMasterDetailsViewProps } from './components/IMasterDetailsViewProps';
import { IMasterDetailsViewWebPartProps } from './IMasterDetailsViewWebPartProps';
import { initDataService } from './data/DataService';

export default class MasterDetailsViewWebPart extends BaseClientSideWebPart<IMasterDetailsViewWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    initDataService(this.context);

    return super.onInit();
  }

  public render(): void {
    const params = new URLSearchParams(document.location.search);
    // attenzione il parametro in query string è case sensitive
    const idMaster = Number(params.get(this.properties.queryStringName));

    const element: React.ReactElement<IMasterDetailsViewProps> = React.createElement(
      MasterDetails,
      {
        isPropertyPaneOpen: this.context.propertyPane.isPropertyPaneOpen(),

        title: this.properties.webpartTitle,
        webRelativeUrl: this.properties.webRelativeUrl,
        masterListName: this.properties.masterListName,
        detailsListName: this.properties.detailsListName,
        detailsMasterFieldName: this.properties.detailsMasterFieldName,
        queryStringName: this.properties.queryStringName,

        idMaster: idMaster,

        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    console.log('instance', this.context.instanceId);
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
                })
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
                  href: "https://www.sgart.it/?SPFxMasterDetails",
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
}
