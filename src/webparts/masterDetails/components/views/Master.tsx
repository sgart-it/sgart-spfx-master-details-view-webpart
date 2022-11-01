import * as React from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import styles from "../MasterDetails.module.scss";
import { IMasterItem } from "../../data/IMasterItem";

export interface IMasterViewProps {
  loading: boolean;
  item: IMasterItem;
}

export default class Master extends React.Component<IMasterViewProps> {

  public render(): React.ReactElement<{}> {
    const { loading, item } = this.props;

    if (item === undefined) {
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
          <div className={styles.gridCol6}>{item.title} {loading && <Spinner size={SpinnerSize.xSmall} />}</div>
        </div>
        <div className={styles.gridRow}>
          <div className={styles.gridCol4}>Cod.</div>
          <div className={styles.gridCol6}>{item.codRegione}</div>
        </div>
      </div>
    );
  }

}