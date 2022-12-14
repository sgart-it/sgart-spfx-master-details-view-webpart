import { IDetailItem } from "../data/IDetailItem";
import { IMasterItem } from "../data/IMasterItem";

export interface IMasterDetailsViewState {
  success: boolean;
  error: string;

  masterLoading: boolean;
  detailsLoading: boolean;

  showMaster: boolean;
  showDetails: boolean;

  masterItem: IMasterItem;
  detailItems: IDetailItem[];
  
  detailsUrl: string;
  masterUrl: string;

  showDialog: boolean,
  showDialogMessage: string;
}
