import * as React from 'react';
import styles from './MasterDetailsView.module.scss';
import { MessageBar, MessageBarType, Separator } from "office-ui-fabric-react";
import { IMasterDetailsViewProps } from './IMasterDetailsViewProps';
import { IMasterDetailsViewState } from './IMasterDetailsViewState';
import { escape } from '@microsoft/sp-lodash-subset';
import Master from './views/Master';
import Details from './views/Details';
import { Data } from '../data/DataService';
import { isNullOrWhiteSpace } from '../Helper';
import { IResult } from '../data/IResult';
import { IMasterItem } from '../data/IMasterItem';
import { IDetailItem } from '../data/IDetailItem';
import { ViewMode } from './ViewMode';

const VERSION = "1.2022-11-01";

export default class MasterDetailsView extends React.Component<IMasterDetailsViewProps, IMasterDetailsViewState> {

  public constructor(props: IMasterDetailsViewProps, state: IMasterDetailsViewState) {
    super(props);

    this.state = {
      masterLoading: true,
      detailsLoading: true,

      showMaster: false,
      showDetails: false,

      success: false,

      masterItem: undefined,
      detailItems: [],

      error: undefined,

      masterUrl: "",
      detailsUrl: "",

      showDialog: false,
      showDialogMessage: null
    };
  }

  public render(): React.ReactElement<IMasterDetailsViewProps> {
    const {
      isPropertyPaneOpen,
      title,
      detailsTitle,
      viewMode,

      webRelativeUrl,
      masterListName,
      detailsListName,
      detailsMasterFieldName,
      queryStringName,

      idMaster,

      environmentMessage,
      hasTeamsContext
    } = this.props;

    const { masterLoading, detailsLoading, showMaster, showDetails, masterItem, detailItems } = this.state;

    const isTitleVisible = !isNullOrWhiteSpace(title);
    const isDetailsTitleVisible = !isNullOrWhiteSpace(detailsTitle);

    return (
      <section className={`${styles.masterDetails} ${hasTeamsContext ? styles.teams : ''}`}>

        {isTitleVisible && (
          <div className={styles.title}>
            <span role="heading">{escape(title)}</span>
          </div>
        )}

        {!isNullOrWhiteSpace(this.state.error) && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
            {this.state.error}
          </MessageBar>
        )}

        {showMaster && <Master item={masterItem} loading={masterLoading} />}

        {showMaster && showDetails && <Separator />}

        {showMaster && showDetails && isDetailsTitleVisible && (
          <div className={styles.title2}>
            <span role="heading">{escape(detailsTitle)}</span>
          </div>
        )}

        {showDetails && <Details items={detailItems} loading={detailsLoading} onButtonClick={this.onButtonClick} />}

        {isPropertyPaneOpen && (
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={true}
            className={styles.debugInfo}
          >
            <div>Enviroment: {environmentMessage}</div>
            <div>Version: {VERSION}</div>
            <div>Author: <a href="https://www.sgart.it?SPFxMasterDetails" target="_blank" rel="noreferrer">Sgart.it</a></div>
            <hr />
            <div>viewMode: <strong>{(ViewMode as any)[viewMode]} ({viewMode})</strong></div>
            <div>webUrl: <strong>{escape(webRelativeUrl)}</strong></div>
            <div>masterListName: <strong>{escape(masterListName)}</strong></div>
            <div>detailsListName: <strong>{escape(detailsListName)}</strong></div>
            <div>detailsMasterFieldName: <strong>{escape(detailsMasterFieldName)}</strong></div>
            <div>queryStringName: <strong>{escape(queryStringName)} = <strong>{idMaster}</strong></strong></div>
          </MessageBar>
        )}
      </section>
    );
  }

  public async componentDidMount(): Promise<void> {
    await this.loadItems();
  }

  public async componentDidUpdate(prevProps: IMasterDetailsViewProps, prevState: IMasterDetailsViewState): Promise<void> {
    if (
      prevProps.title !== this.props.title ||
      prevProps.detailsTitle !== this.props.detailsTitle ||
      prevProps.viewMode !== this.props.viewMode ||
      prevProps.webRelativeUrl !== this.props.webRelativeUrl ||
      prevProps.masterListName !== this.props.masterListName ||
      prevProps.detailsListName !== this.props.detailsListName ||
      prevProps.queryStringName !== this.props.queryStringName
    ) {
      await this.loadItems();
    }
  }

  private async loadItems(): Promise<void> {
    const { viewMode, webRelativeUrl, masterListName, detailsListName, detailsMasterFieldName, idMaster } = this.props;

    const showMaster = viewMode === ViewMode.MasterAndDetails || viewMode === ViewMode.Master;
    const showDetails = viewMode === ViewMode.MasterAndDetails || viewMode === ViewMode.Details;

    try {
      this.setState({
        masterLoading: showMaster,
        detailsLoading: showDetails,
        showMaster: showMaster,
        showDetails: showDetails
      });

      if (showMaster === true) {
        this.loadItemMaster(webRelativeUrl, masterListName, idMaster);
      }


      if (showDetails === true) {
        this.loadItemDetails(webRelativeUrl, detailsListName, detailsMasterFieldName, idMaster);
      }

    } catch (error) {
      this.setState({
        masterLoading: false,
        detailsLoading: false,
        success: false,
        masterItem: undefined,
        error: error,
        masterUrl: ""
      });
    }
  }

  private loadItemMaster(webRelativeUrl: string, listName: string, idMaster: number): void {
    Data.getMaster(webRelativeUrl, listName, idMaster)
      .then((result: IResult<IMasterItem>) => {
        this.setState({
          masterLoading: false,
          masterItem: result.data,
          error: result.error,
          masterUrl: result.url
        });
      })
      .catch(error => {
        this.setState({
          masterLoading: false,
          masterItem: undefined,
          error: error
        });
      });
  }
  private loadItemDetails(webRelativeUrl: string, listName: string, masterFieldName: string, idMaster: number): void {
    Data.getDetails(webRelativeUrl, listName, masterFieldName, idMaster)
      .then((result: IResult<IDetailItem[]>) => {
        this.setState({
          detailsLoading: false,
          detailItems: result.data,
          error: result.error,
          masterUrl: result.url
        });
      })
      .catch(error => {
        this.setState({
          detailsLoading: false,
          detailItems: [],
          error: error
        });
      })
  }

  private onButtonClick = (event: any, id: number): void => {
    // TODO: gestire l'azione se serve
    alert(`Id: ${id} TODO`);
  }

}
