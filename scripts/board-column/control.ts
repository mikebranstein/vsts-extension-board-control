/** The class control.ts will orchestrate the classes of InputParser, Model and View
 *  in order to perform the required actions of the extensions. 
 */
import * as VSSService from "VSS/Service";
import * as WitService from "TFS/WorkItemTracking/Services";
import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";
import { BoardColumnControl } from "./view";
import { ErrorView } from "./errorView";
import * as VSSUtilsCore from "VSS/Utils/Core";
import * as Q from "q";

export class Controller {

    private _fieldName: string = "WEF_FA17412CD1904315BDD8813D3E14CA67_Kanban.Column";
    private _inputs: IDictionaryStringTo<string>;
    private _view: BoardColumnControl;

    constructor() {        
        this._initialize();
    }

    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;

        this._view = new BoardColumnControl();

        // WitService.WorkItemFormService.getService().then(
        //     (service) => {
        //         this._view = new BoardColumnControl();
        //     },
        //     this._handleError);
    }

    private _handleError(error: string): void {
        let errorView = new ErrorView(error);
    }

    public getFieldName(): string {
        return this._fieldName;
    }
}
