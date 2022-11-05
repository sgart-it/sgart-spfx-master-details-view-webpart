import * as React from "react";
import { DetailsList, DetailsListLayoutMode, IColumn, Link, PrimaryButton, SelectionMode, Spinner, SpinnerSize } from "office-ui-fabric-react";
import styles from "../MasterDetails.module.scss";
import { IDetailItem } from "../../data/IDetailItem";

export interface IDetailsViewProps {
  loading: boolean;
  items: IDetailItem[];
}

export default class Details extends React.Component<IDetailsViewProps> {

  private _columns: IColumn[] = [
    { key: 'title', name: 'Nome', fieldName: 'title', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'codProvincia', name: 'Sigla', fieldName: 'codProvincia', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'modified', name: 'Ultima modifica', fieldName: 'modified', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'button', name: 'Button', minWidth: 100, maxWidth: 200, isResizable: false },
  ];

  public render(): React.ReactElement<{}> {
    const { loading, items } = this.props;

    if (items === undefined || items.length === 0) {
      return (
        <div className={styles.grid}>
          <div className={styles.gridRow}>
            <div className={styles.gridCol6}>no items</div>
          </div>
        </div>
      );
    }

    return (
      <>
        {loading && <Spinner size={SpinnerSize.xSmall} />}

        <DetailsList
          items={items}
          columns={this._columns}
          onRenderItemColumn={this._renderItemColumn}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      </>
    );
  }

  private _renderItemColumn = (item: IDetailItem, index: number, column: IColumn): React.ReactNode => {
    const fieldContent = item[column.fieldName as keyof IDetailItem] as string;

    switch (column.key) {
      case 'title':
        return <Link href={"http://it.wikipedia.org/wiki/" + fieldContent.replace(/ /g, '_')} target="_blank">{fieldContent}</Link>;

      case 'button':
        return <PrimaryButton onClick={() => this._showAlert(item.id.toString()) }>Alert</PrimaryButton>;

      default:
        return <span>{fieldContent}</span>;
    }
  }

  private _showAlert(title: string): void {
    // TODO: gestire l'azione se serve
    alert(`Id: ${title}`);
  }
}