import * as React from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import styles from "../MasterDetails.module.scss";
import { IDetailItem } from "../../data/IDetailItem";

export interface IDetailsViewProps {
  loading: boolean;
  items: IDetailItem[];
}

export default class Details extends React.Component<IDetailsViewProps> {

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

    const rows = items.map((item: IDetailItem, index: number) => {
      return (
        <tr key={item.id}>
          <td>{item.title}</td>
          <td>{item.codProvincia}</td>
          <td>{item.modified}</td>
        </tr>
      );

    });

    return (
      <div className={styles.grid}>
        <div className={styles.gridRow}>
          <div className={styles.gridCol1}>
            {loading && <Spinner size={SpinnerSize.xSmall} />}
            <table>
              <thead>
                <tr>
                  <th>Regione</th>
                  <th>Codice</th>
                  <th>Ultima modifica</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

}