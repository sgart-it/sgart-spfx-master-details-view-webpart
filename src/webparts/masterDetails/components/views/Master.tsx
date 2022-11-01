import * as React from "react";
import { IMasterItem } from "../../data/IMasterItem";
import styles from "../MasterDetails.module.scss";

export interface IMasterViewProps {
  item: IMasterItem;
}

export default class Master extends React.Component<IMasterViewProps> {

  public render(): React.ReactElement<{}> {
    const { item } = this.props;

    if(item===undefined) {
      return (
        <div className={styles.grid}>
          <div className={styles.gridRow}>
            <div className={styles.gridCol6}>undefined</div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        <div className={styles.gridRow}>
          <div className={styles.gridCol4}>Title</div>
          <div className={styles.gridCol6}>{item.title}</div>
        </div>
        <div className={styles.gridRow}>
          <div className={styles.gridCol4}>Cod.</div>
          <div className={styles.gridCol6}>{item.codRegione}</div>
        </div>
      </div>
    );
  }

}