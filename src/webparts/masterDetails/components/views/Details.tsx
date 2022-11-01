import * as React from "react";
import { IDetailItem } from "../../data/IDetailItem";
import styles from "../MasterDetails.module.scss";

export interface IDetailsViewProps {
  items: IDetailItem[];
}

export default class Details extends React.Component<IDetailsViewProps> {

  public render(): React.ReactElement<{}> {
    const { items } = this.props;

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